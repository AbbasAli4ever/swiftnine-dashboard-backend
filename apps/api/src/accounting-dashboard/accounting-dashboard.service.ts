import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import type {
  AccountType,
  Currency,
  PaymentPlatform,
} from '@app/database/generated/prisma/enums';
import {
  BANK_ACCOUNTS_PER_GROUP_LIMIT,
  DASHBOARD_SEARCH_RESULT_LIMIT,
  EXCHANGE_RATES_TO_USD,
  REVENUE_OVERVIEW_BUCKET_COUNT,
  TOP_CLIENTS_LIMIT,
} from './accounting-dashboard.constants';
import type { DashboardPeriod } from './dto/dashboard-overview-query.dto';

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

export type PlatformRevenueItem = {
  paymentPlatform: PaymentPlatform;
  totalUsd: number;
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
  paymentPlatform: PaymentPlatform;
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
  revenueByPaymentPlatform: PlatformRevenueItem[];
  revenueByCurrency: CurrencyRevenueItem[];
  bankAccounts: BankAccountsByType;
  topClients: TopClientItem[];
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
      revenueByPaymentPlatform,
      revenueByCurrency,
      bankAccounts,
      topClients,
    ] = await Promise.all([
      this.getBalances(workspaceId),
      this.getRevenueSummary(workspaceId),
      this.getRevenueOverview(workspaceId, period),
      this.getRevenueByPaymentPlatform(workspaceId),
      this.getRevenueByCurrency(workspaceId),
      this.getBankAccountsByType(workspaceId),
      this.getTopClients(workspaceId),
    ]);

    return {
      balances,
      revenueSummary,
      revenueOverview: { period, points: revenueOverviewPoints },
      revenueByPaymentPlatform,
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
          paymentPlatform: true,
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
        paymentPlatform: t.paymentPlatform,
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

  private async getBalances(workspaceId: string): Promise<BalanceSummary> {
    const grouped = await this.prisma.bankAccount.groupBy({
      by: ['accountType', 'currencyType'],
      where: { workspaceId },
      _sum: { amount: true },
      _count: true,
    });

    console.log(
      'GROUPED ARE',
      await this.prisma.bankAccount.groupBy({
        by: ['accountType', 'currencyType'],
        where: { workspaceId },
        _sum: { amount: true },
        _count: true,
      }),
    );

    const byType = new Map<
      AccountType,
      { totals: CurrencyTotal[]; accountCount: number }
    >();
    let totalBalanceUsd = 0;

    for (const row of grouped) {
      console.log('SINGLE ROW IS ', row);
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

  private async getRevenueByPaymentPlatform(
    workspaceId: string,
  ): Promise<PlatformRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['paymentPlatform', 'currency'],
      where: { workspaceId },
      _sum: { saleAmount: true },
    });

    const totals = new Map<PaymentPlatform, number>();
    for (const row of grouped) {
      const amountUsd = toUsd(Number(row._sum.saleAmount ?? 0), row.currency);
      totals.set(
        row.paymentPlatform,
        (totals.get(row.paymentPlatform) ?? 0) + amountUsd,
      );
    }
    console.log('MPA IS ', totals);
    console.log(
      'MAP CONVERSION ',
      Array.from(totals, ([paymentPlatform, totalUsd]) => ({
        paymentPlatform,
        totalUsd: round2(totalUsd),
      })).sort((a, b) => b.totalUsd - a.totalUsd),
    );
    return Array.from(totals, ([paymentPlatform, totalUsd]) => ({
      paymentPlatform,
      totalUsd: round2(totalUsd),
    })).sort((a, b) => b.totalUsd - a.totalUsd);
  }

  private async getRevenueByCurrency(
    workspaceId: string,
  ): Promise<CurrencyRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['currency'],
      where: { workspaceId },
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
