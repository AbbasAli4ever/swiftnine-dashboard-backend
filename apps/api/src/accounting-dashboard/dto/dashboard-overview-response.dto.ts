import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';
import { ACCOUNT_TYPE_VALUES } from '../../bank-accounts/bank-account.constants';
import { DASHBOARD_PERIOD_VALUES } from '../accounting-dashboard.constants';

class CurrencyTotalDto {
  @ApiProperty({ enum: CURRENCY_VALUES, example: 'PKR' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: 8165000 })
  total!: number;
}

class BalanceByAccountTypeDto {
  @ApiProperty({ enum: ACCOUNT_TYPE_VALUES, example: 'LOCAL' })
  accountType!: (typeof ACCOUNT_TYPE_VALUES)[number];

  @ApiProperty({ type: [CurrencyTotalDto] })
  totals!: CurrencyTotalDto[];

  @ApiProperty({
    example: 10,
    description: 'Number of bank accounts of this type',
  })
  accountCount!: number;

  @ApiProperty({
    example: 102500,
    description:
      'Every currency in `totals` converted and summed into one USD figure — e.g. the International Balance card, where INTERNATIONAL accounts may span USD/AED/GBP/etc. and the UI wants one number, not the per-currency `totals` list.',
  })
  totalUsd!: number;
}

export class BalanceSummaryDto {
  @ApiProperty({ type: [BalanceByAccountTypeDto] })
  byAccountType!: BalanceByAccountTypeDto[];

  @ApiProperty({ example: 131893.09 })
  totalBalanceUsd!: number;

  @ApiProperty({
    example: { USD: 1, PKR: 278, HKD: 7.8 },
    description:
      'Exchange rates used to convert every currency into totalBalanceUsd (units of that currency per 1 USD). Live-fetched and cached for up to an hour; falls back to a fixed placeholder map if the live source is unreachable.',
  })
  exchangeRatesToUsd!: Record<string, number>;
}

class RevenueMetricDto {
  @ApiProperty({ example: 7400 })
  totalUsd!: number;

  @ApiProperty({
    example: 18,
    description: 'Percent change vs. the prior comparable period',
  })
  changePercent!: number;
}

class TotalSalesMetricDto {
  @ApiProperty({ example: 84 })
  count!: number;

  @ApiProperty({ example: -15 })
  changePercent!: number;
}

class RevenueSummaryDto {
  @ApiProperty({ type: RevenueMetricDto })
  today!: RevenueMetricDto;

  @ApiProperty({ type: RevenueMetricDto })
  thisMonth!: RevenueMetricDto;

  @ApiProperty({ type: RevenueMetricDto })
  thisYear!: RevenueMetricDto;

  @ApiProperty({ type: TotalSalesMetricDto })
  totalSales!: TotalSalesMetricDto;
}

export class RevenueOverviewPointDto {
  @ApiProperty({
    example: '2026-07-27',
    description:
      'Bucket label — a date, week-start, "YYYY-MM", or year, depending on period',
  })
  label!: string;

  @ApiProperty({ example: 4200 })
  totalUsd!: number;
}

class RevenueOverviewDto {
  @ApiProperty({ enum: DASHBOARD_PERIOD_VALUES, example: 'daily' })
  period!: (typeof DASHBOARD_PERIOD_VALUES)[number];

  @ApiProperty({ type: [RevenueOverviewPointDto] })
  points!: RevenueOverviewPointDto[];
}

export class BankAccountRevenueItemDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Whop' })
  bankName!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/logos/whop.png',
    nullable: true,
    description: 'Bank/platform logo, if one was uploaded for this account',
  })
  logoUrl!: string | null;

  @ApiProperty({ enum: ACCOUNT_TYPE_VALUES, example: 'INTERNATIONAL' })
  accountType!: (typeof ACCOUNT_TYPE_VALUES)[number];

  @ApiProperty({
    enum: CURRENCY_VALUES,
    example: 'USD',
    description:
      "The account's own declared currency (its balance's unit) — not necessarily the currency of every transaction routed through it; a transaction's currency doesn't have to match its bank account's currencyType.",
  })
  currencyType!: (typeof CURRENCY_VALUES)[number];

  @ApiPropertyOptional({
    example: 28400,
    nullable: true,
    description:
      "All-time revenue in the account's own declared currency. Null whenever that isn't unambiguous — the account has sales in more than one currency, or its only sales are in a currency other than its own currencyType — since summing or mislabeling those natively would be meaningless. Use totalRevenueUsd instead in that case.",
  })
  totalRevenue!: number | null;

  @ApiProperty({
    example: 28400,
    description: 'All-time revenue routed through this account, in USD',
  })
  totalRevenueUsd!: number;

  @ApiProperty({
    example: 34,
    description: 'All-time number of sales booked against this account',
  })
  salesCount!: number;
}

export class CurrencyRevenueItemDto {
  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({
    example: 152400,
    description: "All-time revenue in the currency's own units (not converted)",
  })
  total!: number;

  @ApiProperty({ example: 152400 })
  totalUsd!: number;

  @ApiProperty({
    example: 42,
    description: 'Share of all-time revenue (by USD value)',
  })
  percent!: number;
}

class BankAccountItemDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'HBL' })
  bankName!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/logos/hbl.png',
    nullable: true,
    description: 'Bank/platform logo, if one was uploaded for this account',
  })
  logoUrl!: string | null;

  @ApiProperty({ example: 1250000 })
  amount!: number;

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'PKR' })
  currencyType!: (typeof CURRENCY_VALUES)[number];
}

class BankAccountsByTypeDto {
  @ApiProperty({ type: [BankAccountItemDto] })
  local!: BankAccountItemDto[];

  @ApiProperty({ type: [BankAccountItemDto] })
  international!: BankAccountItemDto[];
}

// Transaction-derived — used by both /overview's topClients (all-time, no
// range) and /reports/breakdown's topClients (scoped to dateFrom/dateTo).
export class TopClientRevenueItemDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Victoria Partners' })
  clientName!: string;

  @ApiPropertyOptional({
    example: 32400,
    nullable: true,
    description:
      "Revenue in the client's own currency, over the query's scope (all-time for /overview, the requested period for /reports/breakdown). Null when the client's sales in that scope span more than one currency.",
  })
  totalRevenue!: number | null;

  @ApiProperty({
    example: 32400,
    description: "Revenue over the query's scope, in USD",
  })
  totalRevenueUsd!: number;

  @ApiProperty({ example: 4 })
  salesCount!: number;

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    nullable: true,
    example: 'USD',
  })
  currencyType!: (typeof CURRENCY_VALUES)[number] | null;
}

export class DashboardOverviewResponseDto {
  @ApiProperty({ type: BalanceSummaryDto })
  balances!: BalanceSummaryDto;

  @ApiProperty({ type: RevenueSummaryDto })
  revenueSummary!: RevenueSummaryDto;

  @ApiProperty({ type: RevenueOverviewDto })
  revenueOverview!: RevenueOverviewDto;

  @ApiProperty({
    type: [BankAccountRevenueItemDto],
    description:
      "Revenue per bank account — every account in the workspace (LOCAL and INTERNATIONAL), uncapped, sorted by totalRevenueUsd descending. Accounts with no sales in the window appear with 0. Scoped to the request's `period`: today (daily), the trailing 7 days (weekly), month-to-date (monthly), or year-to-date (yearly) — not all-time. Transaction-driven, not balance-driven: for current balances see bankAccounts.",
  })
  revenueByBankAccount!: BankAccountRevenueItemDto[];

  @ApiProperty({
    type: [CurrencyRevenueItemDto],
    description:
      "Revenue grouped by the transaction currency, sorted by totalUsd descending. Scoped to the request's `period`, same window as revenueByBankAccount: today (daily), the trailing 7 days (weekly), month-to-date (monthly), or year-to-date (yearly) — not all-time. Currencies with no activity in the window are absent, not zero-filled.",
  })
  revenueByCurrency!: CurrencyRevenueItemDto[];

  @ApiProperty({ type: BankAccountsByTypeDto })
  bankAccounts!: BankAccountsByTypeDto;

  @ApiProperty({
    type: [TopClientRevenueItemDto],
    description:
      'Top clients by all-time transaction revenue, sorted by totalRevenueUsd descending. Clients with no transactions are omitted (not zero-filled).',
  })
  topClients!: TopClientRevenueItemDto[];
}
