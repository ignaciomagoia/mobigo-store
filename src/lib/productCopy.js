import { formatPrice } from './formatPrice';

export function normalizeCondition(condition) {
  return condition === 'Nuevo' ? 'Sellado' : condition;
}

export function productDisplayName(product) {
  const capacity = product.capacity && !product.name.includes(product.capacity) ? ` ${product.capacity}` : '';
  return `${product.name}${capacity}`.trim();
}

export function productInquiryMessage(product) {
  const color = product.color && product.color !== 'Consultar color' ? `, color ${product.color}` : '';
  return `Hola, quiero consultar por el ${productDisplayName(product)}${color}, publicado a ${formatPrice(product.price, product.currency)}.`;
}
