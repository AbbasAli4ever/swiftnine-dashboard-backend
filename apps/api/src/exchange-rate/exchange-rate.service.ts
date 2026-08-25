import { Injectable, Logger } from '@nestjs/common';
import type { Currency } from '@app/database/generated/prisma/enums';
import { CURRENCY_VALUES } from '../transactions/transaction.constants';
import {
  CURRENCY_API_URL,
  EXCHANGE_RATES_TO_USD,
  EXCHANGE_RATE_CACHE_TTL_MS,
} from './exchange-rate.constants';

// Shared by every feature that converts between currencies (currently
// AccountingDashboardService's balance/revenue figures and ClientsService's
// totalRevenueUsd) — extracted so there's exactly one live-fetch, one cache,
// and one fallback policy, rather than each caller running its own and
// silently disagreeing.
@Injectable()
export class ExchangeRateService {
  private readonly logger = new Logger(ExchangeRateService.name);
  // Live-fetched, falls back to (and starts as) the static placeholder map.
  private rates: Record<Currency, number> = { ...EXCHANGE_RATES_TO_USD };
  private fetchedAt = 0;

  // Fetches live USD-base rates and merges them over the current map — one
  // network call, cached for EXCHANGE_RATE_CACHE_TTL_MS. Never throws: on any
  // failure (network, non-200, malformed body) it logs a warning and leaves
  // the existing rates (live-but-stale, or the static fallback) exactly as
  // they were, so a flaky third-party API can never break a caller. CRYPTO
  // has no entry in the response, so it always keeps the static fallback.
  //
  // Callers refresh before reading rather than this service polling itself,
  // so a feature that's never hit never makes an outbound call for no
  // reason — the cost of a live rate is paid by whoever actually needs one.
  async refresh(): Promise<void> {
    if (Date.now() - this.fetchedAt < EXCHANGE_RATE_CACHE_TTL_MS) {
      return;
    }
    try {
      const response = await fetch(CURRENCY_API_URL);
      if (!response.ok) {
        throw new Error(`Currency API responded with ${response.status}`);
      }
      const body = (await response.json()) as { usd?: Record<string, number> };
      if (!body.usd) throw new Error('Currency API response missing `usd`');

      const next = { ...this.rates };
      for (const currency of CURRENCY_VALUES) {
        const rate = body.usd[currency.toLowerCase()];
        if (typeof rate === 'number' && rate > 0) next[currency] = rate;
      }
      this.rates = next;
      this.fetchedAt = Date.now();
    } catch (error) {
      this.logger.warn(
        `Falling back to cached exchange rates — ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  toUsd(amount: number, currency: Currency): number {
    return amount / this.rates[currency];
  }

  // Snapshot of whatever's currently cached — for responses that display the
  // rate table itself (e.g. the balance summary's "converted at X/USD"
  // caption), not for converting amounts (use toUsd for that).
  getRates(): Record<Currency, number> {
    return this.rates;
  }
}
