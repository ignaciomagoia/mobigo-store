import { getSupabase } from '../lib/supabase';
import { normalizeCondition } from '../lib/productCopy';
import { normalizeInstallments, normalizeInstallmentSurcharges } from '../lib/pricing';

const columns = 'id,name,category,model,capacity,color,condition,battery_health,price_usd,max_installments,installment_surcharges,description,stock,featured,active,image_url,created_at,updated_at';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const colorSwatches = {
  'titanio desierto': '#c5ad95', 'titanio natural': '#aaa69b', azul: '#a9c5db',
  medianoche: '#424b51', 'oro rosa': '#d6b6aa', lavanda: '#b3a8d9',
  negro: '#232323', blanco: '#efefed', plata: '#c6c7c9', rosa: '#f2d6cc',
};

// Adaptador entre las columnas de la base y los componentes existentes.
// No incorpora datos de los mocks ni inventa especificaciones técnicas.
function toProduct(row) {
  const image = row.image_url || '/images/products/placeholder.svg';
  const condition = normalizeCondition(row.condition);
  return {
    id: row.id, name: row.name, category: row.category, model: row.model,
    capacity: row.capacity, color: row.color || 'Consultar color',
    colorHex: colorSwatches[row.color?.toLocaleLowerCase('es')] || '#c6c7c9',
    condition,
    battery: condition === 'Usado' ? row.battery_health : null,
    price: Number(row.price_usd), currency: 'USD',
    maxInstallments: normalizeInstallments(row.max_installments),
    installmentSurcharges: normalizeInstallmentSurcharges(row.installment_surcharges, row.max_installments),
    description: row.description || 'Consultanos para conocer más detalles de este producto.',
    stock: row.stock, featured: row.featured, active: row.active,
    createdAt: row.created_at, updatedAt: row.updated_at,
    label: null,
    image,
    gallery: [
      { src: image, alt: `${row.name}${row.color ? ` en ${row.color}` : ''}`, view: 'full' },
      { src: image, alt: `Detalle del ${row.name}`, view: 'detail' },
    ],
    features: [row.model && `Modelo: ${row.model}`, row.capacity && `${row.category === 'apple-watch' ? 'Tamaño' : row.category === 'accesorios' ? 'Compatible con' : 'Capacidad'}: ${row.capacity}`, `Condición: ${row.condition}`, row.color && `Color: ${row.color}`].filter(Boolean),
    includes: 'Consultanos qué accesorios y elementos incluye esta unidad.',
  };
}

async function readProducts({ featured = false, signal } = {}) {
  let query = getSupabase().from('products').select(columns).eq('active', true);
  if (featured) query = query.eq('featured', true);
  query = query.order('featured', { ascending: false }).order('created_at', { ascending: false }).order('id');
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(toProduct);
}

export function getProducts({ signal } = {}) {
  return readProducts({ signal });
}

export function getFeaturedProducts({ signal } = {}) {
  return readProducts({ featured: true, signal });
}

export async function getProductById(id, { signal } = {}) {
  // Los enlaces antiguos o inválidos deben mostrar 404, no un error de UUID.
  if (!uuidPattern.test(id || '')) return null;
  let query = getSupabase().from('products').select(columns).eq('active', true).eq('id', id);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? toProduct(data) : null;
}
