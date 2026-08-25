export const DASHBOARD_PERIOD_VALUES = [
  'daily',
  'weekly',
  'monthly',
  'yearly',
] as const;

// Exchange-rate constants (EXCHANGE_RATES_TO_USD, CURRENCY_API_URL,
// EXCHANGE_RATE_CACHE_TTL_MS) moved to ../exchange-rate/exchange-rate.constants
// — ClientsService needed live rates too, so the fetch/cache logic became
// ExchangeRateService, shared rather than duplicated per feature.

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
