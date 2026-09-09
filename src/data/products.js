// Referencia temporal de la etapa visual y fixtures para pruebas.
// La tienda utiliza src/services/products.js; no importa este archivo.
export { categories } from './categories.js';

export const products = [
  {
    id: 'iphone-16-pro-128gb', name: 'iPhone 16 Pro', category: 'iphones', capacity: '128 GB', condition: 'Nuevo', color: 'Titanio desierto', colorHex: '#c5ad95', battery: null, price: 1190, currency: 'USD', stock: 4, featured: true, label: 'EL MÁS ELEGIDO',
    image: '/images/products/iphone-16-pro.jpg',
    gallery: [{ src: '/images/products/iphone-16-pro.jpg', alt: 'iPhone 16 Pro en titanio desierto', view: 'full' }, { src: '/images/products/iphone-16-pro.jpg', alt: 'Detalle del diseño y las cámaras del iPhone 16 Pro', view: 'detail' }],
    description: 'Diseño en titanio, una cámara que invita a crear y potencia para acompañarte todos los días. El iPhone 16 Pro es ese upgrade que se siente en cada detalle. Un equipo nuevo, listo para estrenar.',
    features: ['Pantalla Super Retina XDR de 6,3 pulgadas', 'Chip A18 Pro', 'Sistema de cámaras Pro de 48 MP', 'Conector USB-C'],
    includes: 'iPhone y cable de carga USB-C. No incluye adaptador de corriente.',
  },
  {
    id: 'iphone-15-pro-256gb', name: 'iPhone 15 Pro', category: 'iphones', capacity: '256 GB', condition: 'Usado', color: 'Titanio natural', colorHex: '#aaa69b', battery: 92, price: 890, currency: 'USD', stock: 2, featured: true,
    image: '/images/products/iphone-15-pro.jpg',
    gallery: [{ src: '/images/products/iphone-15-pro.jpg', alt: 'iPhone 15 Pro en titanio natural', view: 'full' }, { src: '/images/products/iphone-15-pro.jpg', alt: 'Detalle del iPhone 15 Pro', view: 'detail' }],
    description: 'Toda la experiencia Pro, con espacio para tus fotos, tus ideas y mucho más. Este equipo usado fue seleccionado y revisado para que elijas con tranquilidad. Su estado y batería se confirman antes de la compra.',
    features: ['Pantalla Super Retina XDR de 6,1 pulgadas', 'Chip A17 Pro', 'Sistema de cámaras Pro de 48 MP', 'Conector USB-C'],
    includes: 'Equipo y cable de carga compatible.',
  },
  {
    id: 'iphone-14-128gb', name: 'iPhone 14', category: 'iphones', capacity: '128 GB', condition: 'Usado', color: 'Azul', colorHex: '#a9c5db', battery: 90, price: 540, currency: 'USD', stock: 3, featured: true,
    image: '/images/products/iphone-14.jpg',
    gallery: [{ src: '/images/products/iphone-14.jpg', alt: 'iPhone 14 azul', view: 'full' }, { src: '/images/products/iphone-14.jpg', alt: 'Detalle del iPhone 14 azul', view: 'detail' }],
    description: 'Un clásico que tiene todo lo que necesitás. Grandes fotos, una pantalla brillante y un diseño que siempre queda bien. Seleccionado y revisado por MobiGo para acompañarte en tu día a día.',
    features: ['Pantalla Super Retina XDR de 6,1 pulgadas', 'Chip A15 Bionic', 'Sistema de cámara dual de 12 MP', 'Conector Lightning'],
    includes: 'Equipo y cable de carga compatible.',
  },
  {
    id: 'airpods-max', name: 'AirPods Max', category: 'airpods', capacity: null, condition: 'Nuevo', color: 'Medianoche', colorHex: '#424b51', battery: null, price: 590, currency: 'USD', stock: 3, featured: true,
    image: '/images/products/airpods-max.jpg',
    gallery: [{ src: '/images/products/airpods-max.jpg', alt: 'AirPods Max en color medianoche', view: 'full' }, { src: '/images/products/airpods-max.jpg', alt: 'Detalle de las almohadillas de AirPods Max', view: 'detail' }],
    description: 'Tu música, en otra dimensión. Sumergite en lo que más te gusta con sonido envolvente, cancelación de ruido y un diseño pensado para disfrutar cada momento.',
    features: ['Cancelación activa de ruido', 'Audio espacial personalizado', 'Diseño circumaural', 'Carga por USB-C'],
    includes: 'AirPods Max, Smart Case y cable de carga USB-C.',
  },
  {
    id: 'apple-watch-series-11', name: 'Apple Watch Series 11', category: 'apple-watch', capacity: '42 mm', condition: 'Nuevo', color: 'Oro rosa', colorHex: '#d6b6aa', battery: null, price: 490, currency: 'USD', stock: 2, featured: false,
    image: '/images/products/apple-watch.jpg',
    gallery: [{ src: '/images/products/apple-watch.jpg', alt: 'Apple Watch Series 11', view: 'full' }, { src: '/images/products/apple-watch.jpg', alt: 'Detalle del Apple Watch Series 11', view: 'detail' }],
    description: 'Un compañero para tus días en movimiento. Tus notificaciones, tus entrenamientos y tu estilo, siempre a mano.',
    features: ['Caja de aluminio de 42 mm', 'Conectividad GPS', 'Registro de actividad y entrenamientos', 'Correa deportiva'],
    includes: 'Apple Watch, correa deportiva y cable de carga magnética.',
  },
  {
    id: 'funda-magsafe-iphone-17', name: 'Funda con MagSafe', category: 'accesorios', capacity: 'iPhone 17', condition: 'Nuevo', color: 'Lavanda', colorHex: '#b3a8d9', battery: null, price: 49, currency: 'USD', stock: 8, featured: false,
    image: '/images/products/case.jpg',
    gallery: [{ src: '/images/products/case.jpg', alt: 'Funda de silicona con MagSafe en color lavanda', view: 'full' }, { src: '/images/products/case.jpg', alt: 'Detalle de la funda con MagSafe', view: 'detail' }],
    description: 'Protección que se siente tan bien como se ve. Un acabado suave, un ajuste preciso y un toque de color para hacer tu iPhone más tuyo.',
    features: ['Compatible con iPhone 17', 'Silicona de tacto suave', 'Compatible con MagSafe', 'Interior suave'],
    includes: 'Una funda de silicona. No incluye teléfono.',
  },
];

export const getProductById = (id) => products.find((product) => product.id === id);
export const formatPrice = (price, currency = 'USD') => `${currency} ${new Intl.NumberFormat('es-AR').format(price)}`;
