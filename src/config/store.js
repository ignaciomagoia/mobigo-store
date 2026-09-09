export const store = {
  name: 'MobiGo Store',
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  instagramUsername: (import.meta.env.VITE_INSTAGRAM_USERNAME || '').replace(/^@/, ''),
  // Si agregás un logo, colocá aquí su ruta: '/images/brand/logo.svg'.
  logo: null,
};

export function whatsappUrl(message) {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
