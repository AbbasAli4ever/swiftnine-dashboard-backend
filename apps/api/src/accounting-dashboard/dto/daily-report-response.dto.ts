import { ApiProperty } from '@nestjs/swagger';
import {
  CURRENCY_VALUES,
  PAYMENT_PLATFORM_VALUES,
} from '../../transactions/transaction.constants';
import { BalanceSummaryDto } from './dashboard-overview-response.dto';

class DailyReportClientPaymentDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ enum: PAYMENT_PLATFORM_VALUES, example: 'WHOP' })
  paymentPlatform!: (typeof PAYMENT_PLATFORM_VALUES)[number];
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
