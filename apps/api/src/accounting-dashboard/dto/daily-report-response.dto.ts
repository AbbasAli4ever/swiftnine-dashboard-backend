import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';
import { BalanceSummaryDto } from './dashboard-overview-response.dto';

class DailyReportBankAccountBriefDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'HBL' })
  bankName!: string;

  @ApiPropertyOptional({
    example:
      'https://public-data-swiftnine.s3.us-east-1.amazonaws.com/accounts_dashboard_assets/bank-logos/hbl.svg',
    nullable: true,
  })
  logoUrl!: string | null;
}

class DailyReportClientPaymentDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ type: DailyReportBankAccountBriefDto })
  bankAccount!: DailyReportBankAccountBriefDto;
}

export class DailyReportResponseDto {
  @ApiProperty({ example: '2026-07-28' })
  date!: string;

  @ApiProperty({ example: 4200 })
  revenueUsd!: number;

  @ApiProperty({ example: 11 })
  salesCount!: number;

  @ApiProperty({ type: BalanceSummaryDto })
  balances!: BalanceSummaryDto;

  @ApiProperty({ type: [DailyReportClientPaymentDto] })
  clientPayments!: DailyReportClientPaymentDto[];
}
