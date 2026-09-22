import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { categories } from '../../data/categories';
import { isAbortError } from '../../lib/errors';
import { DEFAULT_INSTALLMENTS, MAX_INSTALLMENTS, MIN_INSTALLMENTS, normalizeInstallments } from '../../lib/pricing';
import ProductImage from '../../components/ProductImage';
import { createAdminProduct, getAdminProductById, updateAdminProduct, uploadProductImage } from '../../services/adminProducts';

const initialForm = {
  name: '',
  model: '',
  category: 'iphones',
  capacity: '',
  color: '',
  condition: 'Sellado',
  battery_health: '',
  price_usd: '',
  max_installments: String(DEFAULT_INSTALLMENTS),
  installment_surcharges: {},
  stock: '1',
  description: '',
  featured: false,
  active: true,
  image_url: '',
};

function mapProductToForm(product) {
  return {
    name: product.name || '',
    model: product.model || '',
    category: product.category || 'iphones',
    capacity: product.capacity || '',
    color: product.color || '',
    condition: product.condition || 'Sellado',
    battery_health: product.battery_health ?? '',
    price_usd: product.price_usd ?? '',
    max_installments: String(product.max_installments ?? DEFAULT_INSTALLMENTS),
    installment_surcharges: product.installment_surcharges || {},
    stock: product.stock ?? '0',
    description: product.description || '',
    featured: Boolean(product.featured),
    active: Boolean(product.active),
    image_url: product.image_url || '',
  };
}

function validate(form, imageFile) {
  const errors = [];
  if (!form.name.trim()) errors.push('El nombre es obligatorio.');
  if (!form.model.trim()) errors.push('El modelo es obligatorio.');
  if (!form.category) errors.push('La categoría es obligatoria.');
  if (!form.condition) errors.push('El estado es obligatorio.');
  if (form.price_usd === '' || Number(form.price_usd) < 0) errors.push('El precio USD debe ser válido.');
  if (!Number.isInteger(Number(form.max_installments)) || Number(form.max_installments) < MIN_INSTALLMENTS || Number(form.max_installments) > MAX_INSTALLMENTS) errors.push('La cantidad máxima de cuotas debe estar entre 1 y 18.');
  for (let quantity = MIN_INSTALLMENTS; quantity <= normalizeInstallments(form.max_installments); quantity += 1) {
    const value = form.installment_surcharges[String(quantity)] ?? 0;
    if (value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0)) errors.push(`El recargo de ${quantity} ${quantity === 1 ? 'cuota' : 'cuotas'} debe ser un número mayor o igual a 0.`);
  }
  if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) errors.push('El stock debe ser un entero mayor o igual a cero.');
  if (form.condition === 'Usado' && form.battery_health !== '' && (Number(form.battery_health) < 0 || Number(form.battery_health) > 100)) errors.push('La batería debe estar entre 0 y 100.');
  if (imageFile && !imageFile.type.startsWith('image/')) errors.push('La imagen debe ser un archivo de imagen.');
  if (imageFile && imageFile.size > 5 * 1024 * 1024) errors.push('La imagen no puede superar 5 MB.');
  return errors;
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [objectPreview, setObjectPreview] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEdit) return undefined;
    let mounted = true;
    const controller = new AbortController();
    setLoading(true);
    getAdminProductById(id, { signal: controller.signal })
      .then((product) => {
        if (!mounted) return;
        if (!product) throw new Error('No encontramos ese producto.');
        setForm(mapProductToForm(product));
      })
      .catch((loadError) => {
        if (!mounted || controller.signal.aborted || isAbortError(loadError)) return;
        setError(loadError.message);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, isEdit]);

  useEffect(() => () => { if (objectPreview) URL.revokeObjectURL(objectPreview); }, [objectPreview]);

  const preview = useMemo(() => objectPreview || form.image_url || '/images/products/placeholder.svg', [form.image_url, objectPreview]);
  const installmentQuantities = useMemo(() => {
    const max = normalizeInstallments(form.max_installments);
    return Array.from({ length: max }, (_, index) => index + 1);
  }, [form.max_installments]);

  function updateField(event) {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function updateSurcharge(quantity, value) {
    setForm((current) => ({
      ...current,
      installment_surcharges: {
        ...(current.installment_surcharges || {}),
        [String(quantity)]: value,
      },
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null;
    if (objectPreview) URL.revokeObjectURL(objectPreview);
    setImageFile(file);
    setObjectPreview(file ? URL.createObjectURL(file) : '');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(form, imageFile);
    if (errors.length) {
      setError(errors.join(' '));
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const imageUrl = imageFile ? await uploadProductImage(imageFile) : form.image_url;
      const payload = { ...form, image_url: imageUrl };
      if (isEdit) await updateAdminProduct(id, payload);
      else await createAdminProduct(payload);
      setSuccess('Producto guardado correctamente.');
      navigate('/admin/productos', { replace: true, state: { notice: isEdit ? 'Producto actualizado.' : 'Producto creado.' } });
    } catch (saveError) {
      setError(saveError.message || 'No pudimos guardar el producto.');
    } finally {
      setSaving(false);
    }
  }

  return <section className="admin-page">
    <div className="admin-page-heading">
      <div><span className="eyebrow">PRODUCTOS</span><h1>{isEdit ? 'Editar producto' : 'Agregar producto'}</h1><p>Los cambios activos se reflejan en la tienda pública.</p></div>
      <Link className="button button-outline" to="/admin/productos"><ArrowLeft size={17} />Volver</Link>
    </div>
    {error && <div className="admin-alert" role="alert">{error}</div>}
    {success && <div className="admin-success" role="status">{success}</div>}
    {loading ? <p className="admin-table-state">Cargando producto...</p> : <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label>Nombre<input name="name" value={form.name} onChange={updateField} placeholder="iPhone 17 Pro 256GB" required /></label>
        <label>Modelo<input name="model" value={form.model} onChange={updateField} placeholder="iPhone 17 Pro" required /></label>
        <label>Categoría<select name="category" value={form.category} onChange={updateField}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Capacidad<input name="capacity" value={form.capacity} onChange={updateField} placeholder="256 GB" /></label>
        <label>Color<input name="color" value={form.color} onChange={updateField} placeholder="Titanio natural" /></label>
        <label>Estado<select name="condition" value={form.condition} onChange={updateField}><option value="Sellado">Sellado</option><option value="Usado">Usado</option></select></label>
        <label className={form.condition === 'Usado' ? '' : 'is-muted'}>Salud de batería<input name="battery_health" type="number" min="0" max="100" value={form.battery_health} onChange={updateField} placeholder="92" disabled={form.condition !== 'Usado'} /></label>
        <label>Precio USD<input name="price_usd" type="number" min="0" step="0.01" value={form.price_usd} onChange={updateField} required /></label>
        <label>Cantidad máxima de cuotas<select name="max_installments" value={form.max_installments} onChange={updateField}>{Array.from({ length: MAX_INSTALLMENTS }, (_, index) => index + 1).map((quantity) => <option key={quantity} value={quantity}>{quantity} {quantity === 1 ? 'cuota' : 'cuotas'}</option>)}</select></label>
        <label>Stock<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={updateField} required /></label>
      </div>
      <section className="admin-installment-surcharges" aria-label="Recargo por cuota">
        <div>
          <h2>Recargo por cuota</h2>
          <p>Usá 0 para cuotas sin recargo. El cliente verá el valor final calculado automáticamente.</p>
        </div>
        <div className="admin-surcharge-grid">
          {installmentQuantities.map((quantity) => <label key={quantity}>
            <span>{quantity} {quantity === 1 ? 'cuota' : 'cuotas'}</span>
            <div><input type="number" min="0" step="0.01" inputMode="decimal" value={form.installment_surcharges[String(quantity)] ?? 0} onChange={(event) => updateSurcharge(quantity, event.target.value)} aria-label={`Recargo para ${quantity} ${quantity === 1 ? 'cuota' : 'cuotas'}`} /><span>%</span></div>
          </label>)}
        </div>
      </section>
      <label className="admin-description">Descripción<textarea name="description" value={form.description} onChange={updateField} rows="5" placeholder="Detalles del estado, garantía y observaciones relevantes." /></label>
      <div className="admin-image-uploader">
        <div><ProductImage src={preview} alt="Preview del producto" /><span>Preview</span></div>
        <label><ImagePlus size={20} />Imagen del producto<input type="file" accept="image/*" onChange={handleImageChange} /></label>
      </div>
      <div className="admin-form-toggles">
        <label><input type="checkbox" name="featured" checked={form.featured} onChange={updateField} />Destacado</label>
        <label><input type="checkbox" name="active" checked={form.active} onChange={updateField} />Activo</label>
      </div>
      <button className="button button-dark admin-save" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar producto'}<Save size={18} /></button>
    </form>}
  </section>;
}
