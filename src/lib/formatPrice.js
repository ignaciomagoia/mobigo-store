export const formatPrice = (price, currency = 'USD') =>
  `${currency} ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(price)}`;
