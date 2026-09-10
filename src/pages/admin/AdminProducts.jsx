import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { categories } from '../../data/categories';
import { formatPrice } from '../../lib/formatPrice';
import { isAbortError } from '../../lib/errors';
import ProductImage from '../../components/ProductImage';
import { deleteAdminProduct, getAdminProducts, updateAdminProductFields } from '../../services/adminProducts';

function ProductSwitch({ checked, label, onChange }) {
  return <label className="admin-switch">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    <span />
  </label>;
}

export default function AdminProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todas');
  const [condition, setCondition] = useState('todos');

  async function loadProducts(signal, isMounted = () => true) {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminProducts({ signal });
      if (!isMounted()) return;
      setProducts(data);
    } catch (loadError) {
      if (!isMounted() || signal.aborted || isAbortError(loadError)) return;
      setError(loadError.message || 'No pudimos cargar los productos.');
    } finally {
      if (isMounted()) setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    loadProducts(controller.signal, () => mounted);
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es');
    return products.filter((product) => {
      const text = `${product.name} ${product.model || ''} ${product.capacity || ''} ${product.color || ''}`.toLocaleLowerCase('es');
      return (!normalizedQuery || text.includes(normalizedQuery))
        && (category === 'todas' || product.category === category)
        && (condition === 'todos' || product.condition === condition);
    });
  }, [category, condition, products, query]);

  async function toggleField(product, field, value) {
    setError('');
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, [field]: value } : item));
    try {
      await updateAdminProductFields(product.id, { [field]: value });
    } catch (toggleError) {
      setError(toggleError.message || 'No pudimos actualizar el producto.');
      setProducts((current) => current.map((item) => item.id === product.id ? product : item));
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar ${product.name}? Esta acción no se puede deshacer.`)) return;
    setError('');
    try {
      await deleteAdminProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setNotice('Producto eliminado.');
    } catch (deleteError) {
      setError(deleteError.message || 'No pudimos eliminar el producto.');
    }
  }

  function clearFilters() {
    setQuery('');
    setCategory('todas');
    setCondition('todos');
  }

  return <section className="admin-page">
    <div className="admin-page-heading">
      <div><span className="eyebrow">CATÁLOGO</span><h1>Productos</h1><p>Gestioná los productos de tu tienda.</p></div>
      <Link className="button button-dark" to="/admin/productos/nuevo"><Plus size={18} />Agregar producto</Link>
    </div>
    {notice && <div className="admin-success" role="status">{notice}</div>}
    {error && <div className="admin-alert" role="alert">{error}</div>}
    <div className="admin-toolbar">
      <label className="search-field"><Search size={18} /><input type="search" placeholder="Buscar producto..." aria-label="Buscar producto" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoría"><option value="todas">Todas las categorías</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select value={condition} onChange={(event) => setCondition(event.target.value)} aria-label="Filtrar por estado"><option value="todos">Todos los estados</option><option value="Sellado">Sellado</option><option value="Usado">Usado</option></select>
      <button className="button button-outline" type="button" onClick={clearFilters}>Limpiar</button>
    </div>
    <div className="admin-table" aria-busy={loading}>
      <div className="admin-product-row admin-product-head"><span></span><span>Imagen</span><span>Producto</span><span>Categoría</span><span>Estado</span><span>Precio USD</span><span>Stock</span><span>Destacado</span><span>Activo</span><span>Acciones</span></div>
      {loading && <p className="admin-table-state">Cargando productos...</p>}
      {!loading && !visible.length && <p className="admin-table-state">No hay productos para mostrar.</p>}
      {!loading && visible.map((product) => <div className="admin-product-row" key={product.id}>
        <label className="admin-row-check"><input type="checkbox" aria-label={`Seleccionar ${product.name}`} /></label>
        <ProductImage src={product.image_url || '/images/products/placeholder.svg'} alt={product.name} />
        <strong>{product.name}<small>{product.capacity || product.model || 'Sin capacidad'}</small></strong>
        <span>{categories.find((item) => item.id === product.category)?.name || product.category}</span>
        <span className={`admin-status ${product.condition === 'Sellado' ? 'is-sellado' : 'is-usado'}`}>{product.condition}</span>
        <span>{formatPrice(product.price_usd, 'USD')}</span>
        <span>{product.stock}</span>
        <ProductSwitch checked={product.featured} label={`Marcar destacado ${product.name}`} onChange={(value) => toggleField(product, 'featured', value)} />
        <ProductSwitch checked={product.active} label={`Marcar activo ${product.name}`} onChange={(value) => toggleField(product, 'active', value)} />
        <span className="admin-actions"><Link to={`/admin/productos/${product.id}/editar`}><Edit3 size={16} />Editar</Link><button type="button" onClick={() => handleDelete(product)} aria-label={`Eliminar ${product.name}`}><Trash2 size={17} /></button></span>
      </div>)}
    </div>
  </section>;
}
