export const MIN_INSTALLMENTS = 1;
export const MAX_INSTALLMENTS = 18;
export const DEFAULT_INSTALLMENTS = 6;

export function normalizeInstallments(value, fallback = DEFAULT_INSTALLMENTS) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.min(MAX_INSTALLMENTS, Math.max(MIN_INSTALLMENTS, parsed));
}

export function normalizeInstallmentSurcharges(value, maxInstallments = DEFAULT_INSTALLMENTS) {
  const limit = normalizeInstallments(maxInstallments);
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const result = {};

  for (let quantity = MIN_INSTALLMENTS; quantity <= limit; quantity += 1) {
    const parsed = Number(source[String(quantity)]);
    result[String(quantity)] = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  return result;
}

export function getInstallmentSurcharge(surcharges, quantity) {
  const parsed = Number(surcharges?.[String(quantity)]);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function usdToArs(priceUsd, dollarBlueSale) {
  const price = Number(priceUsd);
  const rate = Number(dollarBlueSale);
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(rate) || rate <= 0) return null;
  return Math.round(price * rate);
}

export function calculateInstallments(totalArs, maxInstallments, surcharges = {}) {
  const total = Number(totalArs);
  if (!Number.isFinite(total) || total <= 0) return [];

  const quantity = normalizeInstallments(maxInstallments);
  return Array.from({ length: quantity }, (_, index) => {
    const installment = index + 1;
    const surcharge = getInstallmentSurcharge(surcharges, installment);
    const financedTotal = total * (1 + surcharge / 100);
    return {
      quantity: installment,
      surcharge,
      financedTotal: Math.round(financedTotal),
      amount: Math.round(financedTotal / installment),
    };
  });
}

export function formatArs(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  return `$${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(Math.round(amount))} ARS`;
}

export function getProductArsPrice(product, exchangeRate) {
  return usdToArs(product?.price, exchangeRate?.sale);
}

export function getProductInstallments(product, exchangeRate) {
  const priceArs = getProductArsPrice(product, exchangeRate);
  return {
    priceArs,
    installments: calculateInstallments(priceArs, product?.maxInstallments, product?.installmentSurcharges),
  };
}

export function canShowInstallments(product, exchangeRate) {
  return product?.category === 'iphones' && getProductArsPrice(product, exchangeRate) != null;
}
