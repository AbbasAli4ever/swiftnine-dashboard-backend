import type { Currency } from '@app/database/generated/prisma/enums';

export const DASHBOARD_PERIOD_VALUES = [
  'daily',
  'weekly',
  'monthly',
  'yearly',
] as const;

// Placeholder, fixed exchange rates — units of that currency per 1 USD.
// There is no live FX rate source wired up yet; update these manually (or
// swap in a real rate provider) when accuracy matters.
export const EXCHANGE_RATES_TO_USD: Record<Currency, number> = {
  USD: 1,
  PKR: 278,
  HKD: 7.8,
  AED: 3.67,
  EUR: 0.92,
  GBP: 0.79,
  CRYPTO: 1, // not one specific coin — 1:1 placeholder until that's decided
};

export const TOP_CLIENTS_LIMIT = 5;
export const BANK_ACCOUNTS_PER_GROUP_LIMIT = 5;
export const DASHBOARD_SEARCH_RESULT_LIMIT = 5;

export const REVENUE_OVERVIEW_BUCKET_COUNT = {
  daily: 7,
  weekly: 8,
  monthly: 12,
  yearly: 5,
} as const;
