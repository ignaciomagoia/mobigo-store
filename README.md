# MobiGo Store

React + Vite + React Router. La Home, el catálogo, las fichas `/producto/:id` y el panel `/admin` consumen `public.products` de Supabase. La tienda pública mantiene la identidad visual de MobiGo y todas las consultas de venta se hacen por WhatsApp.

No hay carrito, checkout, pagos, cuotas ni cálculo de envíos.

## Conectar Supabase

1. En tu proyecto de Supabase, abrí **SQL Editor** y ejecutá **todo el contenido de [`supabase/products.sql`](supabase/products.sql)** si todavía no creaste la tabla.
2. Ejecutá **todo el contenido de [`supabase/admin_setup.sql`](supabase/admin_setup.sql)**. Esta migración cambia `Nuevo` a `Sellado`, crea `admin_users`, configura RLS y prepara el bucket `product-images`.
3. Copiá `.env.example` a `.env` en la raíz del proyecto y completá:

```dotenv
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA
```

Usá la publishable key pública del proyecto en `VITE_SUPABASE_PUBLISHABLE_KEY`. `VITE_SUPABASE_ANON_KEY` sigue funcionando como compatibilidad si ya la tenías configurada. No uses `service_role` ni una clave secreta: las variables `VITE_*` se incluyen en el navegador. `.env` ya está ignorado por `.gitignore`; las credenciales no están hardcodeadas.

4. Creá el primer usuario en **Authentication → Users** y después ejecutá [`supabase/create_first_admin.sql`](supabase/create_first_admin.sql) cambiando el email de ejemplo por el email real.
5. Entrá a `/admin/login`, cargá productos y marcá `Activo` para publicarlos.
6. Reiniciá Vite después de modificar `.env`. Para publicar, generá el build nuevamente con las variables configuradas.

Sin variables, el resto de la tienda carga y el catálogo muestra un error recuperable. Una tabla vacía muestra el estado vacío. Un fallo de conexión nunca se disfraza mostrando productos mock.

## Iniciar y compilar

Requiere Node.js 22.12 o posterior; probado con Node.js 24.

```sh
npm install
npm run dev
npm run build
npm run preview
```

En PowerShell, si `npm.ps1` está bloqueado, usá `npm.cmd` en lugar de `npm`. El resultado está en `dist/`. El hosting debe servir `index.html` para las rutas de la aplicación, permitiendo entrar directamente a una ficha o recargarla. Vite normaliza la ruta real para trabajar desde carpetas vinculadas de OneDrive.

## Estructura de products

| Campo | Tipo y comportamiento |
| --- | --- |
| `id` | UUID generado automáticamente; se usa en `/producto/:id`. |
| `name` | Texto obligatorio y no vacío. |
| `category` | `iphones`, `apple-watch`, `airpods` o `accesorios`. |
| `model` | Texto opcional. |
| `capacity` | Texto opcional: `128 GB`, `42 mm` o modelo compatible. |
| `color` | Texto opcional. |
| `condition` | `Sellado` o `Usado`, respetando mayúsculas. |
| `battery_health` | Entero de 0 a 100 o `NULL`; se muestra solo en usados. |
| `price_usd` | Importe obligatorio no negativo con dos decimales. Precio principal y utilizado para ordenar. |
| `price_ars` | Importe opcional en pesos, no negativo. Se muestra en el detalle si está cargado; no se calcula un tipo de cambio. |
| `description` | Texto opcional. |
| `stock` | Entero no negativo; por defecto 0. |
| `featured` | Booleano; por defecto `false`. |
| `active` | Booleano; por defecto `true`. |
| `image_url` | URL pública o ruta local, por ejemplo `/images/products/mi-foto.webp`. Opcional. |
| `created_at` | Fecha con zona horaria; se completa automáticamente. |
| `updated_at` | Fecha con zona horaria; se actualiza mediante trigger. |

`active = false` oculta el producto en listados y detalle. `stock = 0` conserva la ficha con el mensaje de falta de stock. Los productos destacados aparecen primero y el catálogo público siempre consulta productos activos.

El SQL habilita **RLS**: `anon` solo puede leer productos `active = true`; los usuarios autenticados solo pueden escribir si su `auth.uid()` existe en `public.admin_users`. No se usa `service_role` en React.

## Capa de datos

- `src/lib/supabase.js`: cliente único mediante variables de entorno, con sesión persistente para Supabase Auth.
- `src/services/products.js`: `getProducts()`, `getFeaturedProducts()` y `getProductById(id)`. Consultan activos y propagan errores; un ID inválido o inexistente devuelve `null`.
- `src/services/adminAuth.js`: login, cierre de sesión y verificación contra `admin_users`.
- `src/services/adminProducts.js`: listado, alta, edición, eliminación y subida de imágenes al bucket `product-images`.
- `src/hooks/useProductsResource.js`: carga, errores, reintentos y cancelación al cambiar de ruta o consulta.
- `src/components/ProductsState.jsx`: estados usando las clases visuales existentes.
- `src/data/categories.js`: contenido editorial de las categorías, independiente de los productos reales.

El servicio adapta las columnas a las propiedades de los componentes. El esquema tiene una sola imagen: la galería conserva una vista completa y un acercamiento. Los datos técnicos se arman con modelo, capacidad, condición y color reales; no se mezclan especificaciones de los mocks. El contenido de la caja se consulta por WhatsApp porque la tabla no tiene un campo para él.

## Imágenes, logo y contacto

Los productos usan `products.image_url`: URL pública externa, de Supabase Storage o ruta local. El panel admin sube imágenes al bucket público `product-images`. Si falta la imagen o falla, se usa `public/images/products/placeholder.svg`.

Las imágenes editoriales del hero y de las categorías permanecen en `public/images/products/`. Las categorías se configuran en `src/data/categories.js`; el hero, en `src/components/Hero.jsx`. El enlace del hero lleva a `/iphones`, sin depender de un ID mock. Su imagen actual usa una máscara CSS; al reemplazarla por un PNG/WebP transparente, quitá `mask-image` de `.hero-product` en `src/styles.css`.

Para cambiar el logo, colocá el archivo en `public/images/brand/logo.svg` y configurá `logo: '/images/brand/logo.svg'` en `src/config/store.js`. Debe ser legible en fondos claros y oscuros. El favicon está en `public/images/brand/favicon.svg`.

El WhatsApp de toda la tienda está centralizado en `src/config/store.js` como `5493515944821`. Instagram está centralizado ahí como `mobigo.store`. La consulta de un producto usa sus datos de Supabase.

## Pruebas

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright inicia un servidor aislado en el puerto 5174 con valores ficticios e intercepta respuestas de Supabase. Las pruebas no usan credenciales reales ni modifican una base de datos. Cubren activos/destacados, UUID, campos opcionales, precios en pesos, errores, reintentos, estados vacíos, imágenes, navegación y responsive entre 320 y 1440 px.

El build y las pruebas locales no reemplazan la comprobación de conexión y RLS en tu proyecto después de configurar las variables y ejecutar el SQL.

## Archivos de la segunda etapa

El catálogo público ya no usa datos mock como fallback. Las pruebas mantienen fixtures locales y no escriben en Supabase.

`.gitignore` ya excluye `.env`; se verificó y conservó.

Referencias: [cliente JavaScript de Supabase](https://supabase.com/docs/reference/javascript/initializing), [protección de datos y RLS](https://supabase.com/docs/guides/database/secure-data).
