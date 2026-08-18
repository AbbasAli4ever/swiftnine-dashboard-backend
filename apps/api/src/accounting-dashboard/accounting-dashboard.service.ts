import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type {
  AccountType,
  Currency,
} from '@app/database/generated/prisma/enums';
import {
  BANK_ACCOUNTS_PER_GROUP_LIMIT,
  DASHBOARD_SEARCH_RESULT_LIMIT,
  EXCHANGE_RATES_TO_USD,
  REVENUE_OVERVIEW_BUCKET_COUNT,
  TOP_CLIENTS_LIMIT,
} from './accounting-dashboard.constants';
import type { DashboardPeriod } from './dto/dashboard-overview-query.dto';
import { BANK_ACCOUNT_SELECT } from '../bank-accounts/bank-account.constants';
import { TRANSACTION_SELECT } from '../transactions/transaction.constants';

export type CurrencyTotal = { currency: Currency; total: number };

export type BalanceByAccountType = {
  accountType: AccountType;
  totals: CurrencyTotal[];
  accountCount: number;
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
};

export type BankAccountBalanceItem = {
  id: string;
  bankName: string;
  accountType: AccountType;
  currencyType: Currency;
  amount: number;
  amountUsd: number;
};

export type TransactionExportRow = {
  id: string;
  refId: string;
  saleDate: Date;
  clientName: string;
  bankAccount: { id: string; bankName: string; logoUrl: string | null };
  currency: Currency;
  saleAmount: number;
  description: string | null;
};

export type DailyExportData = {
  date: string;
  salesSummary: { revenueUsd: number; salesCount: number; avgSaleUsd: number };
  balancesByAccount: BankAccountBalanceItem[];
  revenueByCurrency: CurrencyRevenueItem[];
  revenueByBankAccount: BankAccountRevenueItem[];
  transactions: TransactionExportRow[];
};

function toUsd(amount: number, currency: Currency): number {
  return amount / EXCHANGE_RATES_TO_USD[currency];
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return round2(((current - previous) / previous) * 100);
}

type DateRange = { gte: Date; lt?: Date };

@Injectable()
export class AccountingDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(
    workspaceId: string,
    period: DashboardPeriod,
  ): Promise<DashboardOverview> {
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
      this.getRevenueByBankAccount(workspaceId),
      this.getRevenueByCurrency(workspaceId),
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
  // one generic range covers all three Reports screens.
  async getReportsBreakdown(
    workspaceId: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<ReportsBreakdown> {
    const range = this.utcDayRange(dateFrom, dateTo);
    const [revenueByBankAccount, revenueByCurrency, topClients] =
      await Promise.all([
        this.getRevenueByBankAccount(workspaceId, range),
        this.getRevenueByCurrency(workspaceId, range),
        this.getTopClientsByRevenue(workspaceId, range),
      ]);

    return {
      dateFrom,
      dateTo,
      revenueByBankAccount,
      revenueByCurrency,
      topClients,
    };
  }

  // Gathers everything the Excel export workbook needs for one date, reusing
  // the same range-aware breakdowns getReportsBreakdown uses rather than
  // re-querying. Balances are current-only (same caveat getDailyReport
  // already carries) — no snapshot table exists to answer "as of `date`".
  async getDailyExportData(
    workspaceId: string,
    date: string,
  ): Promise<DailyExportData> {
    const range = this.utcDayRange(date, date);
    const [
      revenueUsd,
      salesCount,
      balancesByAccount,
      revenueByCurrency,
      revenueByBankAccount,
      transactions,
    ] = await Promise.all([
      this.sumRevenueUsd(workspaceId, range),
      this.prisma.transaction.count({
        where: { workspaceId, saleDate: range },
      }),
      this.getAllBankAccountBalances(workspaceId),
      this.getRevenueByCurrency(workspaceId, range),
      this.getRevenueByBankAccount(workspaceId, range),
      this.getTransactionsForRange(workspaceId, range),
    ]);

    const roundedRevenueUsd = round2(revenueUsd);
    const avgSaleUsd =
      salesCount > 0 ? round2(roundedRevenueUsd / salesCount) : 0;

    return {
      date,
      salesSummary: {
        revenueUsd: roundedRevenueUsd,
        salesCount,
        avgSaleUsd,
      },
      // Zero-filled for every currency actually in use by a bank account in
      // this workspace — getRevenueByCurrency itself only returns
      // currencies with activity in range (fine for /overview and
      // /reports/breakdown, which already document that), but a printed
      // spreadsheet reads as incomplete if PKR silently vanishes on a day
      // with only USD sales while an HBL/PKR account still exists.
      revenueByCurrency: this.fillMissingCurrencies(
        revenueByCurrency,
        balancesByAccount,
      ),
      balancesByAccount,
      revenueByBankAccount,
      transactions,
    };
  }

  // Adds a zero-value row for every currency that has a bank account in
  // this workspace but no revenue in range — export-only; the shared
  // getRevenueByCurrency stays as-is for /overview and /reports/breakdown,
  // which already document "no activity in range → absent, not zeroed."
  private fillMissingCurrencies(
    revenueByCurrency: CurrencyRevenueItem[],
    balancesByAccount: BankAccountBalanceItem[],
  ): CurrencyRevenueItem[] {
    const present = new Set(revenueByCurrency.map((item) => item.currency));
    const missing = [
      ...new Set(balancesByAccount.map((account) => account.currencyType)),
    ].filter((currency) => !present.has(currency));

    return [
      ...revenueByCurrency,
      ...missing.map((currency) => ({
        currency,
        total: 0,
        totalUsd: 0,
        percent: 0,
      })),
    ];
  }

  // Every bank account's current balance, uncapped — unlike
  // getBankAccountsByType, which caps at BANK_ACCOUNTS_PER_GROUP_LIMIT per
  // type for the Overview UI panel. An export must list every account.
  private async getAllBankAccountBalances(
    workspaceId: string,
  ): Promise<BankAccountBalanceItem[]> {
    const accounts = await this.prisma.bankAccount.findMany({
      where: { workspaceId },
      select: BANK_ACCOUNT_SELECT,
      orderBy: [{ accountType: 'asc' }, { amount: 'desc' }],
    });

    return accounts.map((account) => {
      const amount = Number(account.amount);
      return {
        id: account.id,
        bankName: account.bankName,
        accountType: account.accountType,
        currencyType: account.currencyType,
        amount: round2(amount),
        amountUsd: round2(toUsd(amount, account.currencyType)),
      };
    });
  }

  // Per-transaction detail for the export's Transactions sheet. Distinct
  // from getDailyReport's clientPayments, which omits refId/description —
  // fine for the dashboard UI, not enough for an accounting export.
  private async getTransactionsForRange(
    workspaceId: string,
    range: DateRange,
  ): Promise<TransactionExportRow[]> {
    const rows = await this.prisma.transaction.findMany({
      where: { workspaceId, saleDate: range },
      select: TRANSACTION_SELECT,
      orderBy: { saleDate: 'asc' },
    });

    return rows.map((row) => ({
      id: row.id,
      refId: row.refId,
      saleDate: row.saleDate,
      clientName: row.clientName,
      bankAccount: row.bankAccount,
      currency: row.currency,
      saleAmount: Number(row.saleAmount),
      description: row.description,
    }));
  }

  // UTC day-boundary range covering every day from dateFrom through dateTo
  // inclusive — matches getDailyReport's and getMonthlyBreakdownForYear's
  // UTC convention, not getRevenueSummary's legacy local-time one.
  private utcDayRange(dateFrom: string, dateTo: string): DateRange {
    const lt = new Date(`${dateTo}T00:00:00.000Z`);
    lt.setUTCDate(lt.getUTCDate() + 1);
    return { gte: new Date(`${dateFrom}T00:00:00.000Z`), lt };
  }

  private async getBalances(workspaceId: string): Promise<BalanceSummary> {
    const grouped = await this.prisma.bankAccount.groupBy({
      by: ['accountType', 'currencyType'],
      where: { workspaceId },
      _sum: { amount: true },
      _count: true,
    });

    const byType = new Map<
      AccountType,
      { totals: CurrencyTotal[]; accountCount: number }
    >();
    let totalBalanceUsd = 0;

    for (const row of grouped) {
      const amount = Number(row._sum.amount ?? 0);
      totalBalanceUsd += toUsd(amount, row.currencyType);

      const bucket = byType.get(row.accountType) ?? {
        totals: [],
        accountCount: 0,
      };
      bucket.totals.push({ currency: row.currencyType, total: amount });
      bucket.accountCount += row._count;
      byType.set(row.accountType, bucket);
    }

    return {
      byAccountType: Array.from(byType, ([accountType, bucket]) => ({
        accountType,
        ...bucket,
      })),
      totalBalanceUsd: round2(totalBalanceUsd),
      exchangeRatesToUsd: EXCHANGE_RATES_TO_USD,
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
      (sum, row) => sum + toUsd(Number(row._sum.saleAmount ?? 0), row.currency),
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
      const amountUsd = toUsd(Number(row.total ?? 0), row.currency);
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

  // Mirrors the boundaries the old JS-bucketing loop used to produce, so
  // switching to SQL-side grouping doesn't change any bucket's meaning —
  // including "weekly", which is a rolling 7-day window ending today, not
  // a calendar week.
  private getBucketConfig(
    period: DashboardPeriod,
    now: Date,
  ): { firstStart: Date; lastStart: Date; intervalSql: string } {
    const count = REVENUE_OVERVIEW_BUCKET_COUNT[period];
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    if (period === 'daily') {
      const lastStart = todayStart;
      const firstStart = new Date(lastStart);
      firstStart.setDate(firstStart.getDate() - (count - 1));
      return { firstStart, lastStart, intervalSql: '1 day' };
    }
    if (period === 'weekly') {
      const lastStart = new Date(todayStart);
      lastStart.setDate(lastStart.getDate() - 7);
      const firstStart = new Date(lastStart);
      firstStart.setDate(firstStart.getDate() - (count - 1) * 7);
      return { firstStart, lastStart, intervalSql: '7 days' };
    }
    if (period === 'monthly') {
      const lastStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstStart = new Date(
        now.getFullYear(),
        now.getMonth() - (count - 1),
        1,
      );
      return { firstStart, lastStart, intervalSql: '1 month' };
    }
    const lastStart = new Date(now.getFullYear(), 0, 1);
    const firstStart = new Date(now.getFullYear() - (count - 1), 0, 1);
    return { firstStart, lastStart, intervalSql: '1 year' };
  }

  private formatBucketLabel(period: DashboardPeriod, start: Date): string {
    if (period === 'monthly') return this.formatMonth(start);
    if (period === 'yearly') return String(start.getFullYear());
    return this.formatDay(start);
  }

  private formatDay(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private formatMonth(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  // International bank accounts only, ranked by balance (USD-converted so
  // accounts in different currencies are comparable on one list) — this is
  // the direct replacement for the old revenue-by-payment-platform
  // breakdown, since each international account already IS what used to
  // be a "platform" (a Whop account, a Slash account, ...). Local accounts
  // have their own panel (`bankAccounts.local`) and aren't part of this list.
  // All-time revenue (no saleDate filter) per bank account, across LOCAL and
  // INTERNATIONAL alike. Distinct from the account's balance: balance is
  // BankAccount.amount, which transactions increment but which also carries
  // any starting balance and keeps only the net of edited sales.
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
  ): Promise<BankAccountRevenueItem[]> {
    const [accounts, grouped] = await Promise.all([
      this.prisma.bankAccount.findMany({
        where: { workspaceId },
        select: {
          id: true,
          bankName: true,
          accountType: true,
          currencyType: true,
        },
      }),
      this.prisma.transaction.groupBy({
        by: ['bankAccountId', 'currency'],
        where: { workspaceId, ...(range && { saleDate: range }) },
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
      bucket.totalUsd += toUsd(amount, row.currency);
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

  // All-time revenue grouped by the transaction's own currency. `total` is the
  // native sum in that currency; `percent` is its share of the USD grand total.
  private async getRevenueByCurrency(
    workspaceId: string,
    range?: DateRange,
  ): Promise<CurrencyRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['currency'],
      where: { workspaceId, ...(range && { saleDate: range }) },
      _sum: { saleAmount: true },
    });

    const items = grouped.map((row) => {
      const total = Number(row._sum.saleAmount ?? 0);
      return {
        currency: row.currency,
        total,
        totalUsd: toUsd(total, row.currency),
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
  ): Promise<TopClientRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['clientId', 'currency'],
      where: { workspaceId, ...(range && { saleDate: range }) },
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
      bucket.totalUsd += toUsd(amount, row.currency);
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
