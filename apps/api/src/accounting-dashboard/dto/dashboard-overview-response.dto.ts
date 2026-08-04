import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CURRENCY_VALUES,
  PAYMENT_PLATFORM_VALUES,
} from '../../transactions/transaction.constants';
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
}

class BalanceSummaryDto {
  @ApiProperty({ type: [BalanceByAccountTypeDto] })
  byAccountType!: BalanceByAccountTypeDto[];

  @ApiProperty({ example: 131893.09 })
  totalBalanceUsd!: number;

  @ApiProperty({
    example: { USD: 1, PKR: 278, HKD: 7.8 },
    description:
      'Fixed exchange rates used to convert every currency into totalBalanceUsd (units of that currency per 1 USD)',
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

class RevenueOverviewPointDto {
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

class PlatformRevenueItemDto {
  @ApiProperty({ enum: PAYMENT_PLATFORM_VALUES, example: 'WHOP' })
  paymentPlatform!: (typeof PAYMENT_PLATFORM_VALUES)[number];

  @ApiProperty({ example: 28400 })
  totalUsd!: number;
}

class CurrencyRevenueItemDto {
  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({
    example: 152400,
    description: "Total in the currency's own units (not converted)",
  })
  total!: number;

  @ApiProperty({ example: 152400 })
  totalUsd!: number;

  @ApiProperty({
    example: 42,
    description: 'Share of total revenue (by USD value)',
  })
  percent!: number;
}

class BankAccountItemDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'HBL' })
  bankName!: string;

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

class TopClientItemDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Victoria Partners' })
  clientName!: string;

  @ApiProperty({ example: 32400 })
  totalRevenue!: number;

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

  @ApiProperty({ type: [PlatformRevenueItemDto] })
  revenueByPaymentPlatform!: PlatformRevenueItemDto[];

  @ApiProperty({ type: [CurrencyRevenueItemDto] })
  revenueByCurrency!: CurrencyRevenueItemDto[];

  @ApiProperty({ type: BankAccountsByTypeDto })
  bankAccounts!: BankAccountsByTypeDto;

  @ApiProperty({ type: [TopClientItemDto] })
  topClients!: TopClientItemDto[];
}
