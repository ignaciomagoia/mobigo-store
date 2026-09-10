import { test, expect } from '@playwright/test';
import { mockProducts } from './fixtures/products';

test.beforeEach(async ({ page }) => { await mockProducts(page); });

test('la portada carga todas las imágenes y los filtros cambian los productos', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Tu próximo iPhone está en MobiGo.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'iPhones disponibles' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByRole('link', { name: /Apple Watch/ }).first().click();
  await expect(page).toHaveURL('/apple-watch');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card')).toContainText('Apple Watch Series 11');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
});

test('el catálogo busca, filtra y permite recuperar una búsqueda vacía', async ({ page, isMobile }) => {
  await page.goto('/catalogo');
  await expect(page.locator('.product-card')).toHaveCount(6);
  if (isMobile) await page.getByRole('button', { name: 'Filtros', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Usado' }).check();
  await expect(page.locator('.product-card')).toHaveCount(2);
  if (isMobile) await page.locator('.catalog-filter-close').click();
  await page.getByRole('searchbox').fill('producto inexistente');
  await expect(page.getByRole('heading', { name: 'No encontramos ese modelo.' })).toBeVisible();
  await page.locator('.empty-state .button').click();
  await expect(page.locator('.product-card')).toHaveCount(6);
});

test('el detalle muestra batería, cambia la galería y prepara una consulta del equipo', async ({ page }) => {
  await page.goto('/producto/00000000-0000-4000-8000-000000000002');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('iPhone 15 Pro 256 GB');
  await expect(page.locator('.detail-attributes')).toContainText('92%');
  await page.getByRole('button', { name: 'Ver detalle de la imagen' }).click();
  await expect(page.locator('.gallery-main > img')).toHaveAttribute('alt', 'Detalle del iPhone 15 Pro');
  await expect(page.getByRole('button', { name: 'Ver detalle de la imagen' })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.detail-whatsapp').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.message-preview')).toContainText('iPhone 15 Pro 256 GB');
  await expect(page.locator('.message-preview')).toContainText('USD 890');
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('iPhone 15 Pro 256 GB');
});

test('menú y enlaces de categoría funcionan en cada dispositivo', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
  }
  await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'iPhones', exact: true }).click();
  await expect(page).toHaveURL('/iphones');
  await expect(page.locator('.product-card')).toHaveCount(3);
  if (isMobile) await expect(page.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
  await page.locator('.product-more-link').first().click();
  await expect(page).toHaveURL('/producto/00000000-0000-4000-8000-000000000001');
  await expect(page.locator('.detail-attributes')).not.toContainText('Salud de batería');
});

test('las rutas desconocidas y los productos inexistentes tienen una salida', async ({ page }) => {
  await page.goto('/producto/no-existe');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ese producto no está por acá.');
  await page.getByRole('link', { name: 'Explorar productos' }).click();
  await expect(page).toHaveURL('/catalogo');
  await page.goto('/ruta-inexistente');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página se desconectó.');
});

test('el contenido no desborda en mobile, tablet ni desktop', async ({ page }) => {
  test.setTimeout(60000);
  for (const width of [320, 375, 390, 600, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/catalogo', '/producto/00000000-0000-4000-8000-000000000001', '/contacto']) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} a ${width}px`).toBe(true);
    }
  }
});
