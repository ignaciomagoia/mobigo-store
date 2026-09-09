import { test, expect } from '@playwright/test';
import { apiRoute, mockProducts, rows } from './fixtures/products';

test('consulta activos y destacados y resuelve inactivos como inexistentes', async ({ page }) => {
  const requests = [];
  page.on('request', (request) => { if (request.url().includes('/rest/v1/products')) requests.push(new URL(request.url())); });
  await mockProducts(page);
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(4);
  expect(requests.some((url) => url.searchParams.get('featured') === 'eq.true')).toBe(true);
  await page.goto('/catalogo');
  await expect(page.locator('.product-card')).toHaveCount(6);
  await expect(page.getByText('Equipo inactivo')).toHaveCount(0);
  await page.goto(`/producto/${rows.at(-1).id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ese producto no está por acá.');
  expect(requests.every((url) => url.searchParams.get('active') === 'eq.true')).toBe(true);
});

test('espera la respuesta y muestra un estado vacío sin recurrir a los mocks', async ({ page }) => {
  let release;
  const pending = new Promise((resolve) => { release = resolve; });
  await page.route(apiRoute, async (route) => {
    await pending;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.goto('/catalogo');
  await expect(page.getByText('Cargando productos…')).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(0);
  release();
  await expect(page.getByRole('heading', { name: 'Pronto, más opciones para vos.' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(0);
});

test('un error permite reintentar y el detalle diferencia error de 404', async ({ page }) => {
  await page.route(apiRoute, (route) => route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid API key' }) }));
  await page.goto(`/producto/${rows[0].id}`);
  await expect(page.getByRole('heading', { name: 'No pudimos cargar este producto.' })).toBeVisible();
  await expect(page.getByText('Ese producto no está por acá.')).toHaveCount(0);
  await mockProducts(page);
  await page.locator('main').getByRole('button', { name: 'Reintentar' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(rows[0].name);
});

test('adapta pesos, batería cero, campos opcionales e imagen faltante', async ({ page }) => {
  await mockProducts(page, [{ ...rows[1], price_ars: 1250000, battery_health: 0, image_url: '/foto-inexistente.jpg', model: null, capacity: null, color: null, description: null }]);
  await page.goto(`/producto/${rows[1].id}`);
  await expect(page.locator('.detail-price-note')).toContainText('ARS 1.250.000');
  await expect(page.locator('.detail-attributes')).toContainText('0%');
  await expect(page.locator('.gallery-main > img')).toHaveAttribute('src', '/images/products/placeholder.svg');
  await expect(page.locator('.detail-description')).toContainText('Consultanos para conocer más detalles');
  await page.goto('/catalogo');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card .battery')).toHaveText('0%');
});

test('las fichas usan datos nuevos de la API y navegan a otro ID real', async ({ page }) => {
  const fresh = { ...rows[0], id: '11111111-2222-4333-8444-555555555555', name: 'Equipo cargado en Supabase', price_usd: 777, image_url: null };
  await mockProducts(page, [fresh, rows[1]]);
  await page.goto('/catalogo');
  await expect(page.locator('.product-card')).toHaveCount(2);
  await page.getByRole('link', { name: fresh.name, exact: true }).click();
  await expect(page).toHaveURL(`/producto/${fresh.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(fresh.name);
  await expect(page.locator('.detail-price')).toHaveText('USD 777');
  await page.locator('.related-section .product-button').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(rows[1].name);
  await expect(page.locator('.detail-price')).toHaveText('USD 890');
});
