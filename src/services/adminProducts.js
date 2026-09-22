import { getSupabase } from '../lib/supabase';
import { normalizeCondition } from '../lib/productCopy';
import { normalizeInstallments, normalizeInstallmentSurcharges } from '../lib/pricing';

export const PRODUCT_IMAGES_BUCKET = 'product-images';

const columns = 'id,name,category,model,capacity,color,condition,battery_health,price_usd,max_installments,installment_surcharges,description,stock,featured,active,image_url,created_at,updated_at';

function emptyToNull(value) {
  return value === '' || value == null ? null : value;
}

function cleanProductPayload(product) {
  const condition = normalizeCondition(product.condition);
  const batteryHealth = emptyToNull(product.battery_health);
  const maxInstallments = normalizeInstallments(product.max_installments);
  return {
    name: product.name.trim(),
    category: product.category,
    model: emptyToNull(product.model?.trim()),
    capacity: emptyToNull(product.capacity?.trim()),
    color: emptyToNull(product.color?.trim()),
    condition,
    battery_health: condition === 'Usado' && batteryHealth != null ? Number(batteryHealth) : null,
    price_usd: Number(product.price_usd),
    max_installments: maxInstallments,
    installment_surcharges: normalizeInstallmentSurcharges(product.installment_surcharges, maxInstallments),
    description: emptyToNull(product.description?.trim()),
    stock: Number(product.stock),
    featured: Boolean(product.featured),
    active: Boolean(product.active),
    image_url: emptyToNull(product.image_url),
  };
}

export async function getAdminProducts({ signal } = {}) {
  let query = getSupabase().from('products').select(columns).order('created_at', { ascending: false }).order('id');
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return data.map((product) => ({ ...product, condition: normalizeCondition(product.condition) }));
}

export async function getAdminProductById(id, { signal } = {}) {
  let query = getSupabase().from('products').select(columns).eq('id', id);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? { ...data, condition: normalizeCondition(data.condition) } : null;
}

export async function createAdminProduct(product) {
  const { data, error } = await getSupabase()
    .from('products')
    .insert(cleanProductPayload(product))
    .select(columns)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAdminProduct(id, product) {
  const { data, error } = await getSupabase()
    .from('products')
    .update(cleanProductPayload(product))
    .eq('id', id)
    .select(columns)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAdminProductFields(id, fields) {
  const { data, error } = await getSupabase()
    .from('products')
    .update(fields)
    .eq('id', id)
    .select(columns)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAdminProduct(id) {
  const { error } = await getSupabase().from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(file) {
  const supabase = getSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('Iniciá sesión para subir imágenes.');

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  const path = `${userData.user.id}/${id}.${extension}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
