import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type {
  AccountType,
  Currency,
} from '@app/database/generated/prisma/enums';
import {
  BANK_ACCOUNTS_PER_GROUP_LIMIT,
  CURRENCY_API_URL,
  DASHBOARD_SEARCH_RESULT_LIMIT,
  EXCHANGE_RATES_TO_USD,
  EXCHANGE_RATE_CACHE_TTL_MS,
  REVENUE_OVERVIEW_BUCKET_COUNT,
  TOP_CLIENTS_LIMIT,
} from './accounting-dashboard.constants';
import type { DashboardPeriod } from './dto/dashboard-overview-query.dto';
import {
  CURRENCY_VALUES,
  TRANSACTION_SELECT,
} from '../transactions/transaction.constants';

export type CurrencyTotal = { currency: Currency; total: number };

export type BalanceByAccountType = {
  accountType: AccountType;
  totals: CurrencyTotal[];
  accountCount: number;
  // Every currency in `totals` summed into one USD figure — e.g. the
  // "International Balance" card, where INTERNATIONAL accounts may span
  // USD/AED/GBP/etc. and the UI wants one number, not a per-currency list.
  totalUsd: number;
};

export type BalanceSummary = {
  byAccountType: BalanceByAccountType[];
  totalBalanceUsd: number;
  exchangeRatesToUsd: Record<Currency, number>;
};

export type RevenueMetric = { totalUsd: number; changePercent: number };

export type RevenueSummary = {
  today: RevenueMetric;
  thisMonth: RevenueMetric;
  thisYear: RevenueMetric;
  totalSales: { count: number; changePercent: number };
};

export type RevenueOverviewPoint = { label: string; totalUsd: number };

export type RevenueOverview = {
  period: DashboardPeriod;
  points: RevenueOverviewPoint[];
};

export type BankAccountRevenueItem = {
  id: string;
  bankName: string;
  accountType: AccountType;
  currencyType: Currency;
  totalRevenue: number | null;
  totalRevenueUsd: number;
  salesCount: number;
};

export type CurrencyRevenueItem = {
  currency: Currency;
  total: number;
  totalUsd: number;
  percent: number;
};

export type BankAccountItem = {
  id: string;
  bankName: string;
  amount: number;
  currencyType: Currency;
};

export type BankAccountsByType = {
  local: BankAccountItem[];
  international: BankAccountItem[];
};

export type TopClientItem = {
  id: string;
  clientName: string;
  totalRevenue: number;
  currencyType: Currency | null;
};

export type TopClientRevenueItem = {
  id: string;
  clientName: string;
  totalRevenue: number | null;
  totalRevenueUsd: number;
  salesCount: number;
  currencyType: Currency | null;
};

export type DashboardSearchClientItem = {
  id: string;
  clientName: string;
  totalRevenue: number;
  currencyType: Currency | null;
};

export type DashboardSearchTransactionItem = {
  id: string;
  refId: string;
  clientName: string;
  saleAmount: number;
  currency: Currency;
  saleDate: Date;
  description: string | null;
};

export type DashboardSearchResult = {
  clients: DashboardSearchClientItem[];
  transactions: DashboardSearchTransactionItem[];
};

export type DailyReportClientPayment = {
  id: string;
  clientName: string;
  saleAmount: number;
  currency: Currency;
  bankAccount: { id: string; bankName: string; logoUrl: string | null };
};

export type DailyReport = {
  date: string;
  revenueUsd: number;
  salesCount: number;
  balances: BalanceSummary;
  clientPayments: DailyReportClientPayment[];
};

export type MonthlyBreakdown = {
  year: number;
  points: RevenueOverviewPoint[];
};

export type DashboardOverview = {
  balances: BalanceSummary;
  revenueSummary: RevenueSummary;
  revenueOverview: RevenueOverview;
  revenueByBankAccount: BankAccountRevenueItem[];
  revenueByCurrency: CurrencyRevenueItem[];
  bankAccounts: BankAccountsByType;
  topClients: TopClientItem[];
};

export type ReportsBreakdown = {
  dateFrom: string;
  dateTo: string;
  revenueByBankAccount: BankAccountRevenueItem[];
  revenueByCurrency: CurrencyRevenueItem[];
  topClients: TopClientRevenueItem[];
  // Current balances (not scoped to [dateFrom, dateTo] — same "current, not
  // as of the period" caveat getDailyReport/export already carry), narrowed
  // to whichever accounts match bankAccountId/accountType/currency. clientId
  // has no effect here — an account isn't tied to one client.
  balances: BalanceSummary;
};

export type TransactionExportRow = {
  id: string;
  refId: string;
  saleDate: Date;
  clientName: string;
  bankAccount: { id: string; bankName: string; logoUrl: string | null };
  currency: Currency;
  saleAmount: number;
  saleAmountUsd: number;
  description: string | null;
};

// Mirrors the Reports table exactly (Date, Revenue, Currency, Client, Bank) —
// one row per matching transaction, no separate summary/balance sheets.
export type AccountingExportData = {
  dateFrom: string;
  dateTo: string;
  transactions: TransactionExportRow[];
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return round2(((current - previous) / previous) * 100);
}

type DateRange = { gte: Date; lt?: Date };

// Extra filters layered on top of a date range — shared by /reports/export
// and /reports/breakdown. currency/accountType accept multiple values (same
// comma-separated pattern as GET /transactions); clientId/bankAccountId
// stay single-valued, also matching /transactions. Every other caller of
// the methods that accept this (getRevenueByBankAccount, getRevenueByCurrency,
// getTransactionsForRange, getBalances) passes undefined, so their existing
// all-time/date-only behavior is unaffected.
type ReportFilters = {
  clientId?: string;
  bankAccountId?: string;
  accountType?: AccountType[];
  currency?: Currency[];
};

@Injectable()
export class AccountingDashboardService {
  private readonly logger = new Logger(AccountingDashboardService.name);
  // Live-fetched, falls back to (and starts as) the static placeholder map.
  // Refreshed by refreshExchangeRates(), currently called only from
  // getOverview() — the Pakistan/International/Total balance cards are the
  // one place accuracy was explicitly asked for. Every other caller of
  // toUsd() uses whatever is currently cached here.
  private exchangeRates: Record<Currency, number> = {
    ...EXCHANGE_RATES_TO_USD,
  };
  private exchangeRatesFetchedAt = 0;

  constructor(private readonly prisma: PrismaService) {}

  // Fetches live USD-base rates and merges them over the current map — one
  // network call, cached for EXCHANGE_RATE_CACHE_TTL_MS. Never throws: on
  // any failure (network, non-200, malformed body) it logs a warning and
  // leaves the existing rates (live-but-stale, or the static fallback)
  // exactly as they were, so a flaky third-party API can never break the
  // dashboard. CRYPTO has no entry in the response, so it always keeps the
  // static fallback.
  private async refreshExchangeRates(): Promise<void> {
    if (Date.now() - this.exchangeRatesFetchedAt < EXCHANGE_RATE_CACHE_TTL_MS) {
      return;
    }
    try {
      const response = await fetch(CURRENCY_API_URL);
      if (!response.ok) {
        throw new Error(`Currency API responded with ${response.status}`);
      }
      const body = (await response.json()) as { usd?: Record<string, number> };
      if (!body.usd) throw new Error('Currency API response missing `usd`');

      const next = { ...this.exchangeRates };
      for (const currency of CURRENCY_VALUES) {
        const rate = body.usd[currency.toLowerCase()];
        if (typeof rate === 'number' && rate > 0) next[currency] = rate;
      }
      this.exchangeRates = next;
      this.exchangeRatesFetchedAt = Date.now();
    } catch (error) {
      this.logger.warn(
        `Falling back to cached exchange rates — ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private toUsd(amount: number, currency: Currency): number {
    return amount / this.exchangeRates[currency];
  }

  async getOverview(
    workspaceId: string,
    period: DashboardPeriod,
  ): Promise<DashboardOverview> {
    await this.refreshExchangeRates();
    const currentPeriodRange = this.getCurrentPeriodRange(period, new Date());
    const [
      balances,
      revenueSummary,
      revenueOverviewPoints,
      revenueByBankAccount,
      revenueByCurrency,
      bankAccounts,
      topClients,
    ] = await Promise.all([
      this.getBalances(workspaceId),
      this.getRevenueSummary(workspaceId),
      this.getRevenueOverview(workspaceId, period),
      this.getRevenueByBankAccount(workspaceId, currentPeriodRange),
      this.getRevenueByCurrency(workspaceId, currentPeriodRange),
      this.getBankAccountsByType(workspaceId),
      this.getTopClients(workspaceId),
    ]);

    return {
      balances,
      revenueSummary,
      revenueOverview: { period, points: revenueOverviewPoints },
      revenueByBankAccount,
      revenueByCurrency,
      bankAccounts,
      topClients,
    };
  }

  async getDailyReport(
    workspaceId: string,
    date: string,
  ): Promise<DailyReport> {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const nextDayStart = new Date(dayStart);
    nextDayStart.setUTCDate(nextDayStart.getUTCDate() + 1);
    const range = { gte: dayStart, lt: nextDayStart };

    const [revenueUsd, salesCount, balances, transactions] = await Promise.all([
      this.sumRevenueUsd(workspaceId, range),
      this.prisma.transaction.count({
        where: { workspaceId, saleDate: range },
      }),
      this.getBalances(workspaceId),
      this.prisma.transaction.findMany({
        where: { workspaceId, saleDate: range },
        select: {
          id: true,
          clientName: true,
          saleAmount: true,
          currency: true,
          bankAccount: { select: { id: true, bankName: true, logoUrl: true } },
        },
        orderBy: { saleDate: 'desc' },
      }),
    ]);

    return {
      date,
      revenueUsd: round2(revenueUsd),
      salesCount,
      balances,
      clientPayments: transactions.map((t) => ({
        id: t.id,
        clientName: t.clientName,
        saleAmount: Number(t.saleAmount),
        currency: t.currency,
        bankAccount: t.bankAccount,
      })),
    };
  }

  // period=yearly on /overview buckets by year (5 yearly totals) — this is
  // the Jan-Dec-of-one-specific-year view instead, reusing the same
  // generate_series technique as getRevenueOverview with fixed bounds.
  //
  // Boundaries are built with Date.UTC, not `new Date(year, month, day)`.
  // The latter constructs local midnight, which on a UTC+5 host serializes
  // to the *previous* day at 19:00 UTC once it crosses the query boundary —
  // shifting every generate_series bucket by a day and drifting the month
  // labels (confirmed live: Jan 1 local came out as Dec 31 19:00 UTC).
  // Date.UTC pins the wall-clock digits sent to Postgres to exactly
  // Jan 1/Dec 1, regardless of the host's timezone.
  async getMonthlyBreakdownForYear(
    workspaceId: string,
    year: number,
  ): Promise<MonthlyBreakdown> {
    const firstStart = new Date(Date.UTC(year, 0, 1));
    const lastStart = new Date(Date.UTC(year, 11, 1));

    const rows = await this.queryBucketedRevenue(
      workspaceId,
      firstStart,
      lastStart,
      '1 month',
    );
    const points = this.aggregateBucketRows(rows, (start) =>
      this.formatMonth(start),
    );

    return { year, points };
  }

  // Reports (not Overview) entry point: every breakdown below scoped to a
  // caller-supplied [dateFrom, dateTo] instead of all-time. dateFrom/dateTo
  // may be the same day (a daily report), a full month, or a full year —
  // one generic range covers all three Reports screens. filters are the
  // same clientId/bankAccountId/accountType/currency set as GET /transactions
  // and the Excel export, so the page's filter bar scopes revenue/top-clients
  // AND the balance cards, not just the date range. balances (current, not
  // period-scoped) only honor bankAccountId/accountType/currency — clientId
  // has no effect there, same as everywhere else balances are filtered.
  async getReportsBreakdown(
    workspaceId: string,
    dateFrom: string,
    dateTo: string,
    filters?: ReportFilters,
  ): Promise<ReportsBreakdown> {
    const range = this.utcDayRange(dateFrom, dateTo);
    const [revenueByBankAccount, revenueByCurrency, topClients, balances] =
      await Promise.all([
        this.getRevenueByBankAccount(workspaceId, range, filters),
        this.getRevenueByCurrency(workspaceId, range, filters),
        this.getTopClientsByRevenue(workspaceId, range, filters),
        this.getBalances(workspaceId, filters),
      ]);

    return {
      dateFrom,
      dateTo,
      revenueByBankAccount,
      revenueByCurrency,
      topClients,
      balances,
    };
  }

  // Gathers what the Excel export needs for [dateFrom, dateTo]: exactly the
  // rows the Reports table itself shows for the same filters (or today, by
  // default) — a straight table export, not a separate multi-sheet report.
  async getExportData(
    workspaceId: string,
    dateFrom: string,
    dateTo: string,
    filters?: ReportFilters,
  ): Promise<AccountingExportData> {
    const range = this.utcDayRange(dateFrom, dateTo);
    const transactions = await this.getTransactionsForRange(
      workspaceId,
      range,
      filters,
    );
    return { dateFrom, dateTo, transactions };
  }

  // Transaction-side filters. accountType lives on the related BankAccount,
  // hence the nested filter rather than a plain column match. currency and
  // accountType accept multiple values (`{ in: [...] }`) — clientId and
  // bankAccountId stay single-valued, matching GET /transactions.
  private transactionFilterWhere(
    filters?: ReportFilters,
  ): Prisma.TransactionWhereInput {
    if (!filters) return {};
    return {
      ...(filters.clientId && { clientId: filters.clientId }),
      ...(filters.bankAccountId && { bankAccountId: filters.bankAccountId }),
      ...(filters.currency?.length && { currency: { in: filters.currency } }),
      ...(filters.accountType?.length && {
        bankAccount: { accountType: { in: filters.accountType } },
      }),
    };
  }

  // BankAccount-side filters — same ReportFilters, but clientId doesn't
  // apply (an account isn't tied to one client) and bankAccountId narrows
  // by the account's own id rather than a transaction's foreign key.
  private bankAccountFilterWhere(
    filters?: ReportFilters,
  ): Prisma.BankAccountWhereInput {
    if (!filters) return {};
    return {
      ...(filters.bankAccountId && { id: filters.bankAccountId }),
      ...(filters.accountType?.length && {
        accountType: { in: filters.accountType },
      }),
      ...(filters.currency?.length && {
        currencyType: { in: filters.currency },
      }),
    };
  }

  // Per-transaction detail for the export table. Distinct from
  // getDailyReport's clientPayments, which omits refId/description — fine
  // for the dashboard UI, not enough for an accounting export.
  private async getTransactionsForRange(
    workspaceId: string,
    range: DateRange,
    filters?: ReportFilters,
  ): Promise<TransactionExportRow[]> {
    const rows = await this.prisma.transaction.findMany({
      where: {
        workspaceId,
        saleDate: range,
        ...this.transactionFilterWhere(filters),
      },
      select: TRANSACTION_SELECT,
      orderBy: { saleDate: 'asc' },
    });

    return rows.map((row) => {
      const saleAmount = Number(row.saleAmount);
      return {
        id: row.id,
        refId: row.refId,
        saleDate: row.saleDate,
        clientName: row.clientName,
        bankAccount: row.bankAccount,
        currency: row.currency,
        saleAmount,
        saleAmountUsd: round2(this.toUsd(saleAmount, row.currency)),
        description: row.description,
      };
    });
  }

  // UTC day-boundary range covering every day from dateFrom through dateTo
  // inclusive — matches getDailyReport's and getMonthlyBreakdownForYear's
  // UTC convention, not getRevenueSummary's legacy local-time one.
  private utcDayRange(dateFrom: string, dateTo: string): DateRange {
    const lt = new Date(`${dateTo}T00:00:00.000Z`);
    lt.setUTCDate(lt.getUTCDate() + 1);
    return { gte: new Date(`${dateFrom}T00:00:00.000Z`), lt };
  }

  // The "current" window for `period`, used to scope Overview's
  // revenueByBankAccount panel — distinct from getBucketConfig's N-bucket
  // trailing window, which drives the revenueOverview chart instead.
  // "weekly" is a rolling 7-day window ending today, matching
  // getBucketConfig's own documented definition of "weekly" — not a
  // calendar week, which would need a start-of-week decision this codebase
  // doesn't otherwise make. "monthly"/"yearly" are calendar month-to-date /
  // year-to-date, matching getRevenueSummary's existing thisMonth/thisYear
  // concept. All boundaries are UTC, matching this file's newer methods.
  private getCurrentPeriodRange(period: DashboardPeriod, now: Date): DateRange {
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    if (period === 'daily') {
      return { gte: todayStart, lt: tomorrowStart };
    }
    if (period === 'weekly') {
      const weekStart = new Date(todayStart);
      weekStart.setUTCDate(weekStart.getUTCDate() - 6);
      return { gte: weekStart, lt: tomorrowStart };
    }
    if (period === 'monthly') {
      const monthStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );
      return { gte: monthStart, lt: tomorrowStart };
    }
    const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    return { gte: yearStart, lt: tomorrowStart };
  }

  // filters narrows which accounts get summed — bankAccountId/accountType/
  // currency only (clientId doesn't apply to a BankAccount). /overview and
  // getDailyReport pass undefined, so they stay workspace-wide; only
  // getReportsBreakdown passes real filters.
  private async getBalances(
    workspaceId: string,
    filters?: ReportFilters,
  ): Promise<BalanceSummary> {
    const grouped = await this.prisma.bankAccount.groupBy({
      by: ['accountType', 'currencyType'],
      where: { workspaceId, ...this.bankAccountFilterWhere(filters) },
      _sum: { amount: true },
      _count: true,
    });

    const byType = new Map<
      AccountType,
      { totals: CurrencyTotal[]; accountCount: number; totalUsd: number }
    >();
    let totalBalanceUsd = 0;

    for (const row of grouped) {
      const amount = Number(row._sum.amount ?? 0);
      const amountUsd = this.toUsd(amount, row.currencyType);
      totalBalanceUsd += amountUsd;

      const bucket = byType.get(row.accountType) ?? {
        totals: [],
        accountCount: 0,
        totalUsd: 0,
      };
      bucket.totals.push({ currency: row.currencyType, total: amount });
      bucket.accountCount += row._count;
      bucket.totalUsd += amountUsd;
      byType.set(row.accountType, bucket);
    }

    return {
      // totalUsd sums every currency within this account type into one USD
      // figure — e.g. the "International Balance" card, where INTERNATIONAL
      // accounts may span USD/AED/GBP/etc. `totals` (native, per currency)
      // stays for anywhere that wants the un-converted breakdown.
      byAccountType: Array.from(byType, ([accountType, bucket]) => ({
        accountType,
        totals: bucket.totals,
        accountCount: bucket.accountCount,
        totalUsd: round2(bucket.totalUsd),
      })),
      totalBalanceUsd: round2(totalBalanceUsd),
      exchangeRatesToUsd: this.exchangeRates,
    };
  }

  private async getRevenueSummary(
    workspaceId: string,
  ): Promise<RevenueSummary> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);

    const [
      todayTotal,
      yesterdayTotal,
      monthTotal,
      lastMonthTotal,
      yearTotal,
      lastYearTotal,
      salesThisMonth,
      salesLastMonth,
    ] = await Promise.all([
      this.sumRevenueUsd(workspaceId, { gte: startOfToday }),
      this.sumRevenueUsd(workspaceId, {
        gte: startOfYesterday,
        lt: startOfToday,
      }),
      this.sumRevenueUsd(workspaceId, { gte: startOfMonth }),
      this.sumRevenueUsd(workspaceId, {
        gte: startOfLastMonth,
        lt: startOfMonth,
      }),
      this.sumRevenueUsd(workspaceId, { gte: startOfYear }),
      this.sumRevenueUsd(workspaceId, {
        gte: startOfLastYear,
        lt: startOfYear,
      }),
      this.prisma.transaction.count({
        where: { workspaceId, saleDate: { gte: startOfMonth } },
      }),
      this.prisma.transaction.count({
        where: {
          workspaceId,
          saleDate: { gte: startOfLastMonth, lt: startOfMonth },
        },
      }),
    ]);

    return {
      today: {
        totalUsd: round2(todayTotal),
        changePercent: percentChange(todayTotal, yesterdayTotal),
      },
      thisMonth: {
        totalUsd: round2(monthTotal),
        changePercent: percentChange(monthTotal, lastMonthTotal),
      },
      thisYear: {
        totalUsd: round2(yearTotal),
        changePercent: percentChange(yearTotal, lastYearTotal),
      },
      totalSales: {
        count: salesThisMonth,
        changePercent: percentChange(salesThisMonth, salesLastMonth),
      },
    };
  }

  private async sumRevenueUsd(
    workspaceId: string,
    range: DateRange,
  ): Promise<number> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['currency'],
      where: { workspaceId, saleDate: range },
      _sum: { saleAmount: true },
    });

    return grouped.reduce(
      (sum, row) =>
        sum + this.toUsd(Number(row._sum.saleAmount ?? 0), row.currency),
      0,
    );
  }

  // Buckets the revenue time series in Postgres via generate_series + a
  // LEFT JOIN, instead of pulling every matching Transaction row into
  // memory and bucketing in JS — only ~(bucket count * currency count)
  // rows ever cross into Node. Currency->USD conversion stays here in JS
  // so EXCHANGE_RATES_TO_USD isn't duplicated into the SQL string.
  private async getRevenueOverview(
    workspaceId: string,
    period: DashboardPeriod,
  ): Promise<RevenueOverviewPoint[]> {
    const { firstStart, lastStart, intervalSql } = this.getBucketConfig(
      period,
      new Date(),
    );
    const rows = await this.queryBucketedRevenue(
      workspaceId,
      firstStart,
      lastStart,
      intervalSql,
    );
    return this.aggregateBucketRows(rows, (start) =>
      this.formatBucketLabel(period, start),
    );
  }

  private async queryBucketedRevenue(
    workspaceId: string,
    firstStart: Date,
    lastStart: Date,
    intervalSql: string,
  ): Promise<
    {
      bucketStart: Date;
      currency: Currency | null;
      total: Prisma.Decimal | null;
    }[]
  > {
    return this.prisma.$queryRaw<
      {
        bucketStart: Date;
        currency: Currency | null;
        total: Prisma.Decimal | null;
      }[]
    >`
      SELECT gs.bucket_start AS "bucketStart", t.currency, SUM(t."saleAmount") AS total
      FROM generate_series(
        ${firstStart}::timestamp,
        ${lastStart}::timestamp,
        ${intervalSql}::interval
      ) AS gs(bucket_start)
      LEFT JOIN "Transaction" t
        ON t."saleDate" >= gs.bucket_start
        AND t."saleDate" < gs.bucket_start + ${intervalSql}::interval
        AND t."workspace_id" = ${workspaceId}
      GROUP BY gs.bucket_start, t.currency
      ORDER BY gs.bucket_start
    `;
  }

  private aggregateBucketRows(
    rows: {
      bucketStart: Date;
      currency: Currency | null;
      total: Prisma.Decimal | null;
    }[],
    labelFor: (start: Date) => string,
  ): RevenueOverviewPoint[] {
    const totalsByBucket = new Map<number, number>();
    for (const row of rows) {
      if (!row.currency) continue;
      const key = row.bucketStart.getTime();
      const amountUsd = this.toUsd(Number(row.total ?? 0), row.currency);
      totalsByBucket.set(key, (totalsByBucket.get(key) ?? 0) + amountUsd);
    }

    const bucketStarts = Array.from(
      new Set(rows.map((row) => row.bucketStart.getTime())),
    ).sort((a, b) => a - b);

    return bucketStarts.map((time) => {
      const start = new Date(time);
      return {
        label: labelFor(start),
        totalUsd: round2(totalsByBucket.get(time) ?? 0),
      };
    });
  }

  // Bucket boundaries for the revenue time series. "weekly" is a rolling
  // 7-day window, not a calendar week — preserved from the original
  // JS-bucketing implementation this replaced.
  //
  // Every boundary is built with Date.UTC, never `new Date(y, m, d)`. Two
  // bugs came from the local-time version, and both only reproduce on a
  // host whose offset isn't UTC (found live on UTC+5):
  //
  //   1. `new Date(2026, 7, 1)` is local midnight, which serializes to
  //      2026-07-31T19:00:00Z — the *previous* month's last day. So the
  //      generate_series anchor wasn't a month start at all.
  //   2. Postgres clamps `+ 1 month` to the shorter month's last day, and
  //      keeps clamping from there. Anchored on a day-31 timestamp, the
  //      steps drifted 31 -> 30 -> 30 -> ... -> 28 -> 28, so buckets stopped
  //      lining up with months entirely: labels came out duplicated
  //      (2025-10 twice), months went missing (2025-11, 2026-02), the
  //      current month never appeared, and each bucket's window straddled
  //      two real months so the sums were wrong too.
  //
  // Anchoring on day 1 in UTC fixes both: day 1 exists in every month, so
  // Postgres never clamps, and the anchor is a true month start.
  private getBucketConfig(
    period: DashboardPeriod,
    now: Date,
  ): { firstStart: Date; lastStart: Date; intervalSql: string } {
    const count = REVENUE_OVERVIEW_BUCKET_COUNT[period];
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    if (period === 'daily') {
      const lastStart = todayStart;
      const firstStart = new Date(lastStart);
      firstStart.setUTCDate(firstStart.getUTCDate() - (count - 1));
      return { firstStart, lastStart, intervalSql: '1 day' };
    }
    if (period === 'weekly') {
      const lastStart = new Date(todayStart);
      lastStart.setUTCDate(lastStart.getUTCDate() - 7);
      const firstStart = new Date(lastStart);
      firstStart.setUTCDate(firstStart.getUTCDate() - (count - 1) * 7);
      return { firstStart, lastStart, intervalSql: '7 days' };
    }
    if (period === 'monthly') {
      const lastStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );
      // Date.UTC normalises a negative month index, so a 12-bucket window
      // in January correctly rolls back into the previous year.
      const firstStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1), 1),
      );
      return { firstStart, lastStart, intervalSql: '1 month' };
    }
    const lastStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const firstStart = new Date(
      Date.UTC(now.getUTCFullYear() - (count - 1), 0, 1),
    );
    return { firstStart, lastStart, intervalSql: '1 year' };
  }

  // Labels read the bucket start in UTC, matching how the boundaries above
  // (and getMonthlyBreakdownForYear's) are constructed. Using local getters
  // here re-introduces the same class of drift on any non-UTC host — and on
  // a negative-offset host it would shift every label back a month even
  // when the boundaries themselves are correct.
  private formatBucketLabel(period: DashboardPeriod, start: Date): string {
    if (period === 'monthly') return this.formatMonth(start);
    if (period === 'yearly') return String(start.getUTCFullYear());
    return this.formatDay(start);
  }

  private formatDay(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private formatMonth(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  // Revenue per bank account, across LOCAL and INTERNATIONAL alike — this is
  // the direct replacement for the old revenue-by-payment-platform
  // breakdown, since each international account already IS what used to
  // be a "platform" (a Whop account, a Slash account, ...). Local accounts
  // also have their own current-balance panel (`bankAccounts.local`),
  // separate from this revenue view.
  //
  // Scope depends on the caller: `/overview` passes getCurrentPeriodRange's
  // window (today/trailing-7-days/month-to-date/year-to-date, driven by its
  // `period` query param) — no longer all-time. `/reports/breakdown` and the
  // Excel export pass an explicit dateFrom/dateTo instead. Distinct from the
  // account's balance either way: balance is BankAccount.amount, which
  // transactions no longer touch at all (see the balance-decoupling
  // follow-up) and which only ever changes via a manual PATCH.
  //
  // Grouped by [bankAccountId, currency] rather than bankAccountId alone
  // because Transaction.currency is its own column. TransactionService's
  // assertCurrencyMatches currently forces it to equal the account's
  // currencyType, so in practice there's one group per account — but the
  // schema doesn't guarantee that, and grouping this way stays correct if
  // that rule is ever relaxed (each group converts at its own rate).
  //
  // Accounts with no transactions are included at 0 so the panel lists every
  // account, matching how it renders today.
  private async getRevenueByBankAccount(
    workspaceId: string,
    range?: DateRange,
    filters?: ReportFilters,
  ): Promise<BankAccountRevenueItem[]> {
    const [accounts, grouped] = await Promise.all([
      this.prisma.bankAccount.findMany({
        where: { workspaceId, ...this.bankAccountFilterWhere(filters) },
        select: {
          id: true,
          bankName: true,
          accountType: true,
          currencyType: true,
        },
      }),
      this.prisma.transaction.groupBy({
        by: ['bankAccountId', 'currency'],
        where: {
          workspaceId,
          ...(range && { saleDate: range }),
          ...this.transactionFilterWhere(filters),
        },
        _sum: { saleAmount: true },
        _count: true,
      }),
    ]);

    const totals = new Map<
      string,
      { totalUsd: number; salesCount: number; native: Map<Currency, number> }
    >();
    for (const row of grouped) {
      const bucket = totals.get(row.bankAccountId) ?? {
        totalUsd: 0,
        salesCount: 0,
        native: new Map<Currency, number>(),
      };
      const amount = Number(row._sum.saleAmount ?? 0);
      bucket.totalUsd += this.toUsd(amount, row.currency);
      bucket.salesCount += row._count;
      bucket.native.set(
        row.currency,
        (bucket.native.get(row.currency) ?? 0) + amount,
      );
      totals.set(row.bankAccountId, bucket);
    }

    return accounts
      .map((account) => {
        const bucket = totals.get(account.id);
        // Native total is only meaningful while every sale on the account
        // shares one currency (the invariant assertCurrencyMatches enforces).
        // If that ever stops holding, send null rather than a figure that
        // silently adds unlike currencies together.
        const nativeTotal =
          !bucket || bucket.native.size === 0
            ? 0
            : bucket.native.size === 1
              ? (bucket.native.get(account.currencyType) ?? null)
              : null;

        return {
          id: account.id,
          bankName: account.bankName,
          accountType: account.accountType,
          currencyType: account.currencyType,
          totalRevenue: nativeTotal === null ? null : round2(nativeTotal),
          totalRevenueUsd: round2(bucket?.totalUsd ?? 0),
          salesCount: bucket?.salesCount ?? 0,
        };
      })
      .sort((a, b) => b.totalRevenueUsd - a.totalRevenueUsd);
  }

  // Revenue grouped by the transaction's own currency. `total` is the
  // native sum in that currency; `percent` is its share of the USD grand
  // total. Scope depends on the caller, same as getRevenueByBankAccount:
  // `/overview` passes getCurrentPeriodRange's window; `/reports/breakdown`
  // and the Excel export pass an explicit dateFrom/dateTo; no range means
  // all-time (no caller does this anymore, but the signature stays
  // optional for flexibility).
  private async getRevenueByCurrency(
    workspaceId: string,
    range?: DateRange,
    filters?: ReportFilters,
  ): Promise<CurrencyRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['currency'],
      where: {
        workspaceId,
        ...(range && { saleDate: range }),
        ...this.transactionFilterWhere(filters),
      },
      _sum: { saleAmount: true },
    });

    const items = grouped.map((row) => {
      const total = Number(row._sum.saleAmount ?? 0);
      return {
        currency: row.currency,
        total,
        totalUsd: this.toUsd(total, row.currency),
      };
    });

    const grandTotalUsd = items.reduce((sum, item) => sum + item.totalUsd, 0);

    return items
      .map((item) => ({
        currency: item.currency,
        total: round2(item.total),
        totalUsd: round2(item.totalUsd),
        percent:
          grandTotalUsd > 0 ? round2((item.totalUsd / grandTotalUsd) * 100) : 0,
      }))
      .sort((a, b) => b.totalUsd - a.totalUsd);
  }

  private async getBankAccountsByType(
    workspaceId: string,
  ): Promise<BankAccountsByType> {
    const select = {
      id: true,
      bankName: true,
      amount: true,
      currencyType: true,
    } as const;

    const [local, international] = await Promise.all([
      this.prisma.bankAccount.findMany({
        where: { workspaceId, accountType: 'LOCAL' },
        select,
        orderBy: { amount: 'desc' },
        take: BANK_ACCOUNTS_PER_GROUP_LIMIT,
      }),
      this.prisma.bankAccount.findMany({
        where: { workspaceId, accountType: 'INTERNATIONAL' },
        select,
        orderBy: { amount: 'desc' },
        take: BANK_ACCOUNTS_PER_GROUP_LIMIT,
      }),
    ]);

    const toItem = (row: (typeof local)[number]): BankAccountItem => ({
      id: row.id,
      bankName: row.bankName,
      amount: Number(row.amount),
      currencyType: row.currencyType,
    });

    return {
      local: local.map(toItem),
      international: international.map(toItem),
    };
  }

  private async getTopClients(workspaceId: string): Promise<TopClientItem[]> {
    const clients = await this.prisma.clients.findMany({
      where: { workspaceId },
      select: {
        id: true,
        clientName: true,
        totalRevenue: true,
        currencyType: true,
      },
      orderBy: { totalRevenue: 'desc' },
      take: TOP_CLIENTS_LIMIT,
    });

    return clients.map((client) => ({
      id: client.id,
      clientName: client.clientName,
      totalRevenue: Number(client.totalRevenue),
      currencyType: client.currencyType,
    }));
  }

  // Reports-only ranking by summed Transaction.saleAmount, scoped to `range`
  // — distinct from getTopClients (Overview), which ranks by the hand-entered
  // Clients.totalRevenue field and has no date column to range against.
  // Unlike getRevenueByBankAccount's fixed, zero-filled account list,
  // clients with no sales in range are simply absent rather than zero-filled
  // — a "top N" list padded with zero-revenue clients isn't meaningful the
  // same way a fixed account list is.
  private async getTopClientsByRevenue(
    workspaceId: string,
    range?: DateRange,
    filters?: ReportFilters,
  ): Promise<TopClientRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['clientId', 'currency'],
      where: {
        workspaceId,
        ...(range && { saleDate: range }),
        ...this.transactionFilterWhere(filters),
      },
      _sum: { saleAmount: true },
      _count: true,
    });
    if (grouped.length === 0) return [];

    const clientIds = [...new Set(grouped.map((row) => row.clientId))];
    const clients = await this.prisma.clients.findMany({
      where: { id: { in: clientIds } },
      select: { id: true, clientName: true },
    });
    const nameById = new Map(clients.map((c) => [c.id, c.clientName]));

    const totals = new Map<
      string,
      { totalUsd: number; salesCount: number; native: Map<Currency, number> }
    >();
    for (const row of grouped) {
      const bucket = totals.get(row.clientId) ?? {
        totalUsd: 0,
        salesCount: 0,
        native: new Map<Currency, number>(),
      };
      const amount = Number(row._sum.saleAmount ?? 0);
      bucket.totalUsd += this.toUsd(amount, row.currency);
      bucket.salesCount += row._count;
      bucket.native.set(
        row.currency,
        (bucket.native.get(row.currency) ?? 0) + amount,
      );
      totals.set(row.clientId, bucket);
    }

    return Array.from(totals, ([clientId, bucket]) => {
      const nativeCurrencies = [...bucket.native.keys()];
      const nativeTotal =
        nativeCurrencies.length === 1
          ? (bucket.native.get(nativeCurrencies[0]) ?? null)
          : null;

      return {
        id: clientId,
        clientName: nameById.get(clientId) ?? '',
        totalRevenue: nativeTotal === null ? null : round2(nativeTotal),
        totalRevenueUsd: round2(bucket.totalUsd),
        salesCount: bucket.salesCount,
        currencyType:
          nativeCurrencies.length === 1 ? nativeCurrencies[0] : null,
      };
    })
      .sort((a, b) => b.totalRevenueUsd - a.totalRevenueUsd)
      .slice(0, TOP_CLIENTS_LIMIT);
  }

  // Global search bar on the dashboard — matches client name, and
  // transaction reference/client name/description, each capped and
  // returned separately so the frontend can label and link them.
  async search(workspaceId: string, q: string): Promise<DashboardSearchResult> {
    const tokens = q.split(/\s+/).filter(Boolean);

    const [clients, transactions] = await Promise.all([
      this.prisma.clients.findMany({
        where: {
          workspaceId,
          AND: tokens.map((token) => ({
            clientName: { contains: token, mode: 'insensitive' as const },
          })),
        },
        select: {
          id: true,
          clientName: true,
          totalRevenue: true,
          currencyType: true,
        },
        orderBy: { clientName: 'asc' },
        take: DASHBOARD_SEARCH_RESULT_LIMIT,
      }),
      this.prisma.transaction.findMany({
        where: {
          workspaceId,
          OR: [
            { refId: { contains: q, mode: 'insensitive' } },
            { clientName: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          refId: true,
          clientName: true,
          saleAmount: true,
          currency: true,
          saleDate: true,
          description: true,
        },
        orderBy: { saleDate: 'desc' },
        take: DASHBOARD_SEARCH_RESULT_LIMIT,
      }),
    ]);

    return {
      clients: clients.map((client) => ({
        ...client,
        totalRevenue: Number(client.totalRevenue),
      })),
      transactions: transactions.map((transaction) => ({
        ...transaction,
        saleAmount: Number(transaction.saleAmount),
      })),
    };
  }
}
