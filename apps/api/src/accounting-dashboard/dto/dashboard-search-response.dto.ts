import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';

class DashboardSearchClientDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ example: 25000 })
  totalRevenue!: number;

  @ApiPropertyOptional({ enum: CURRENCY_VALUES, nullable: true })
  currencyType!: (typeof CURRENCY_VALUES)[number] | null;
}

class DashboardSearchTransactionDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 'whop_txn_12345' })
  refId!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: '2026-07-15T00:00:00.000Z' })
  saleDate!: Date;

  @ApiProperty({ example: 'Monthly subscription renewal', nullable: true })
  description!: string | null;
}

export class DashboardSearchResponseDto {
  @ApiProperty({ type: [DashboardSearchClientDto] })
  clients!: DashboardSearchClientDto[];

  @ApiProperty({ type: [DashboardSearchTransactionDto] })
  transactions!: DashboardSearchTransactionDto[];
}
