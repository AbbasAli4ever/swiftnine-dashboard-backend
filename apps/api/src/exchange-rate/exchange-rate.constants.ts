import type { Currency } from '@app/database/generated/prisma/enums';

// Fallback exchange rates — units of that currency per 1 USD. Used until the
// first live fetch from CURRENCY_API_URL succeeds, and again any time that
// fetch fails (a stale/offline rate beats a broken feature). CRYPTO has no
// live source (the API is fiat-only) so it always uses this fixed 1:1
// placeholder.
export const EXCHANGE_RATES_TO_USD: Record<Currency, number> = {
  USD: 1,
  PKR: 278,
  HKD: 7.8,
  AED: 3.67,
  EUR: 0.92,
  GBP: 0.79,
  CRYPTO: 1, // not one specific coin — 1:1 placeholder until that's decided
};

// Free, no-key-required, daily-updated FX rates — base currency is USD, so
// `usd.<code>` is already "units of <code> per 1 USD", the same convention
// EXCHANGE_RATES_TO_USD uses. https://github.com/fawazahmed0/exchange-api
export const CURRENCY_API_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

// How long a fetched rate set is trusted before refetching. This data only
// updates daily upstream, so an hour is just to bound how many outbound
// requests get made, not to track real-time movement.
export const EXCHANGE_RATE_CACHE_TTL_MS = 60 * 60 * 1000;
