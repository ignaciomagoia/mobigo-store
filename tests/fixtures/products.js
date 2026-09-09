// Solo pruebas: respuestas HTTP simuladas, sin conexión a un proyecto real.
import { products as references } from '../../src/data/products.js';

export const rows = references.map((product, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  name: product.name, category: product.category, model: product.name,
  capacity: product.capacity, color: product.color, condition: product.condition,
  battery_health: product.battery, price_usd: product.price, price_ars: null,
  description: product.description, stock: product.stock,
  featured: product.featured, active: true, image_url: product.image,
  created_at: `2026-01-0${6 - index}T00:00:00Z`, updated_at: '2026-01-06T00:00:00Z',
}));

rows.push({ ...rows[0], id: '00000000-0000-4000-8000-000000000099', name: 'Equipo inactivo', active: false });

export const apiRoute = 'https://mobigo-test.supabase.co/rest/v1/products*';

export async function mockProducts(page, data = rows) {
  await page.route(apiRoute, (route) => {
    const params = new URL(route.request().url()).searchParams;
    let result = [...data];
    if (params.get('active') === 'eq.true') result = result.filter((p) => p.active);
    if (params.get('featured') === 'eq.true') result = result.filter((p) => p.featured);
    if (params.has('id')) result = result.filter((p) => `eq.${p.id}` === params.get('id'));
    result.sort((a, b) => Number(b.featured) - Number(a.featured) || b.created_at.localeCompare(a.created_at) || a.id.localeCompare(b.id));
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(result) });
  });
}
