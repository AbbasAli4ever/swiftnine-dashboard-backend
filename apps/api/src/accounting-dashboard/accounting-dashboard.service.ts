import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type {
  AccountType,
  Currency,
  PaymentPlatform,
} from '@app/database/generated/prisma/enums';
import {
  BANK_ACCOUNTS_PER_GROUP_LIMIT,
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

  async getOverview(period: DashboardPeriod): Promise<DashboardOverview> {
    const [
      balances,
      revenueSummary,
      revenueOverviewPoints,
      revenueByPaymentPlatform,
      revenueByCurrency,
      bankAccounts,
      topClients,
    ] = await Promise.all([
      this.getBalances(),
      this.getRevenueSummary(),
      this.getRevenueOverview(period),
      this.getRevenueByPaymentPlatform(),
      this.getRevenueByCurrency(),
      this.getBankAccountsByType(),
      this.getTopClients(),
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

  private async getBalances(): Promise<BalanceSummary> {
    const grouped = await this.prisma.bankAccount.groupBy({
      by: ['accountType', 'currencyType'],
      _sum: { amount: true },
      _count: true,
    });

    console.log("GROUPED ARE", await this.prisma.bankAccount.groupBy({
      by: ['accountType', 'currencyType'],
      _sum: { amount: true },
      _count: true,
    }))

    const byType = new Map<
      AccountType,
      { totals: CurrencyTotal[]; accountCount: number }
    >();
    let totalBalanceUsd = 0;

    for (const row of grouped) {
      console.log("SINGLE ROW IS ", row)
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

  private async getRevenueSummary(): Promise<RevenueSummary> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
      this.sumRevenueUsd({ gte: startOfToday }),
      this.sumRevenueUsd({ gte: startOfYesterday, lt: startOfToday }),
      this.sumRevenueUsd({ gte: startOfMonth }),
      this.sumRevenueUsd({ gte: startOfLastMonth, lt: startOfMonth }),
      this.sumRevenueUsd({ gte: startOfYear }),
      this.sumRevenueUsd({ gte: startOfLastYear, lt: startOfYear }),
      this.prisma.transaction.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.transaction.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
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

  private async sumRevenueUsd(range: DateRange): Promise<number> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['currency'],
      where: { createdAt: range },
      _sum: { saleAmount: true },
    });

    return grouped.reduce(
      (sum, row) => sum + toUsd(Number(row._sum.saleAmount ?? 0), row.currency),
      0,
    );
  }

  private async getRevenueOverview(
    period: DashboardPeriod,
  ): Promise<RevenueOverviewPoint[]> {
    const now = new Date();
    const buckets = this.buildBuckets(period, now);

    const transactions = await this.prisma.transaction.findMany({
      where: { createdAt: { gte: buckets[0].start } },
      select: { saleAmount: true, currency: true, createdAt: true },
    });

    return buckets.map(({ label, start, end }) => {
      const totalUsd = transactions
        .filter((t) => t.createdAt >= start && t.createdAt < end)
        .reduce((sum, t) => sum + toUsd(Number(t.saleAmount), t.currency), 0);
      return { label, totalUsd: round2(totalUsd) };
    });
  }

  private buildBuckets(
    period: DashboardPeriod,
    now: Date,
  ): { label: string; start: Date; end: Date }[] {
    const count = REVENUE_OVERVIEW_BUCKET_COUNT[period];
    const buckets: { label: string; start: Date; end: Date }[] = [];

    for (let i = count - 1; i >= 0; i--) {
      if (period === 'daily') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
        buckets.push({ label: this.formatDay(start), start, end });
      } else if (period === 'weekly') {
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7);
        const start = new Date(end);
        start.setDate(start.getDate() - 7);
        buckets.push({ label: this.formatDay(start), start, end });
      } else if (period === 'monthly') {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        buckets.push({ label: this.formatMonth(start), start, end });
      } else {
        const start = new Date(now.getFullYear() - i, 0, 1);
        const end = new Date(now.getFullYear() - i + 1, 0, 1);
        buckets.push({ label: String(start.getFullYear()), start, end });
      }
    }

    return buckets;
  }

  private formatDay(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private formatMonth(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private async getRevenueByPaymentPlatform(): Promise<PlatformRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['paymentPlatform', 'currency'],
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
    console.log("MPA IS ", totals)
    console.log("MAP CONVERSION ", Array.from(totals, ([paymentPlatform, totalUsd]) => ({
      paymentPlatform,
      totalUsd: round2(totalUsd),
    })).sort((a, b) => b.totalUsd - a.totalUsd))
    return Array.from(totals, ([paymentPlatform, totalUsd]) => ({
      paymentPlatform,
      totalUsd: round2(totalUsd),
    })).sort((a, b) => b.totalUsd - a.totalUsd);
  }

  private async getRevenueByCurrency(): Promise<CurrencyRevenueItem[]> {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['currency'],
      _sum: { saleAmount: true },
    });

    const items = grouped.map((row) => {
      const total = Number(row._sum.saleAmount ?? 0);
      return { currency: row.currency, total, totalUsd: toUsd(total, row.currency) };
    });

    const grandTotalUsd = items.reduce((sum, item) => sum + item.totalUsd, 0);

    return items
      .map((item) => ({
        currency: item.currency,
        total: round2(item.total),
        totalUsd: round2(item.totalUsd),
        percent: grandTotalUsd > 0 ? round2((item.totalUsd / grandTotalUsd) * 100) : 0,
      }))
      .sort((a, b) => b.totalUsd - a.totalUsd);
  }

  private async getBankAccountsByType(): Promise<BankAccountsByType> {
    const select = {
      id: true,
      bankName: true,
      amount: true,
      currencyType: true,
    } as const;

    const [local, international] = await Promise.all([
      this.prisma.bankAccount.findMany({
        where: { accountType: 'LOCAL' },
        select,
        orderBy: { amount: 'desc' },
        take: BANK_ACCOUNTS_PER_GROUP_LIMIT,
      }),
      this.prisma.bankAccount.findMany({
        where: { accountType: 'INTERNATIONAL' },
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

    return { local: local.map(toItem), international: international.map(toItem) };
  }

  private async getTopClients(): Promise<TopClientItem[]> {
    const clients = await this.prisma.clients.findMany({
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
}
