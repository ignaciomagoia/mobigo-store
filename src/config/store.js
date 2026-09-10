const mobigoWhatsappNumber = '5493515944821';
const mobigoInstagramUsername = 'mobigo.store';

export const store = {
  name: 'MobiGo Store',
  whatsappNumber: mobigoWhatsappNumber,
  instagramUsername: mobigoInstagramUsername,
  // Si agregás un logo, colocá aquí su ruta: '/images/brand/logo.svg'.
  logo: null,
};

export function whatsappUrl(message) {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
