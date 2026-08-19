import type { Currency } from '@app/database/generated/prisma/enums';

export const DASHBOARD_PERIOD_VALUES = [
  'daily',
  'weekly',
  'monthly',
  'yearly',
] as const;

// Fallback exchange rates — units of that currency per 1 USD. Used until
// the first live fetch from CURRENCY_API_URL succeeds, and again any time
// that fetch fails (a stale/offline rate beats a broken dashboard). CRYPTO
// has no live source (the API is fiat-only) so it always uses this fixed
// 1:1 placeholder.
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
// requests the dashboard makes, not to track real-time movement.
export const EXCHANGE_RATE_CACHE_TTL_MS = 60 * 60 * 1000;

export const TOP_CLIENTS_LIMIT = 5;
export const BANK_ACCOUNTS_PER_GROUP_LIMIT = 4;
export const DASHBOARD_SEARCH_RESULT_LIMIT = 5;

// Caps any accounting-dashboard dateFrom..dateTo span (Reports breakdown,
// Excel export) so it can't be used to scan a workspace's entire history in
// one call. Wide enough to cover a full calendar year (365/366 days) plus
// slack for a "trailing 12 months" query that crosses a year boundary.
export const ACCOUNTING_REPORTS_MAX_RANGE_DAYS = 400;

// Shared by every date-range query DTO in this module (Reports breakdown,
// Excel export) so the format and day-count math can't drift between them.
export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysBetweenDates(dateFrom: string, dateTo: string): number {
  return (
    (Date.parse(`${dateTo}T00:00:00.000Z`) -
      Date.parse(`${dateFrom}T00:00:00.000Z`)) /
    MS_PER_DAY
  );
}

export const REVENUE_OVERVIEW_BUCKET_COUNT = {
  daily: 7,
  weekly: 8,
  monthly: 12,
  yearly: 5,
} as const;
