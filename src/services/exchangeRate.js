const DOLAR_API_BLUE_URL = 'https://dolarapi.com/v1/dolares/blue';
export const EXCHANGE_RATE_CACHE_TTL_MS = 5 * 60 * 1000;

let cachedBlueRate = null;
let pendingBlueRateRequest = null;

function isCacheValid(rate) {
  return rate && Date.now() - rate.fetchedAt < EXCHANGE_RATE_CACHE_TTL_MS;
}

function parseBlueRate(data) {
  const sale = Number(data?.venta);
  if (!Number.isFinite(sale) || sale <= 0) {
    throw new Error('La cotización recibida no es válida.');
  }

  return {
    provider: 'DolarAPI',
    kind: 'blue',
    sale,
    updatedAt: data?.fechaActualizacion || null,
    fetchedAt: Date.now(),
  };
}

export async function getBlueDollarRate({ force = false } = {}) {
  if (!force && isCacheValid(cachedBlueRate)) return cachedBlueRate;
  if (!force && pendingBlueRateRequest) return pendingBlueRateRequest;

  pendingBlueRateRequest = fetch(DOLAR_API_BLUE_URL, {
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('No pudimos obtener la cotización del dólar Blue.');
      }

      const data = await response.json();
      cachedBlueRate = parseBlueRate(data);
      return cachedBlueRate;
    })
    .finally(() => {
      pendingBlueRateRequest = null;
    });

  return pendingBlueRateRequest;
}

export function clearBlueDollarRateCache() {
  cachedBlueRate = null;
  pendingBlueRateRequest = null;
}
