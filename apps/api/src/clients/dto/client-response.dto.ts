import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CURRENCY_VALUES,
  PAYMENT_PLATFORM_VALUES,
} from '../../transactions/transaction.constants';

class ClientCountDto {
  @ApiProperty({
    example: 12,
    description: 'Number of transactions linked to this client',
  })
  transactions!: number;
}

class ClientCurrencyTotalDto {
  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: 2399.88 })
  total!: number;
}

class ClientTransactionBriefDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: PAYMENT_PLATFORM_VALUES, example: 'WHOP' })
  paymentPlatform!: (typeof PAYMENT_PLATFORM_VALUES)[number];

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: 'whop_txn_12345' })
  refId!: string;

  @ApiProperty({ example: '2026-07-15T00:00:00.000Z' })
  saleDate!: Date;

  @ApiProperty({ example: 'Monthly subscription renewal', nullable: true })
  description!: string | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;
}

export class ClientResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ example: 25000 })
  totalRevenue!: number;

  @ApiPropertyOptional({ enum: CURRENCY_VALUES, nullable: true })
  currencyType!: (typeof CURRENCY_VALUES)[number] | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: ClientCountDto })
  _count!: ClientCountDto;

  @ApiProperty({
    type: [ClientCurrencyTotalDto],
    description:
      "Sum of saleAmount across this client's transactions, grouped by currency",
  })
  totalSaleAmount!: ClientCurrencyTotalDto[];

  @ApiProperty({ type: [ClientTransactionBriefDto] })
  transactions!: ClientTransactionBriefDto[];
}

export class ClientListItemResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ example: 25000 })
  totalRevenue!: number;

  @ApiPropertyOptional({ enum: CURRENCY_VALUES, nullable: true })
  currencyType!: (typeof CURRENCY_VALUES)[number] | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: ClientCountDto })
  _count!: ClientCountDto;

  @ApiProperty({
    type: [ClientCurrencyTotalDto],
    description:
      "Sum of saleAmount across this client's transactions, grouped by currency",
  })
  totalSaleAmount!: ClientCurrencyTotalDto[];
}

export class ClientSearchResultDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;
}

class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 57 })
  total!: number;

  @ApiProperty({ example: 3 })
  total_pages!: number;

  @ApiProperty({ example: true })
  has_next!: boolean;

  @ApiProperty({ example: false })
  has_prev!: boolean;
}

export class PaginatedClientsResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: [ClientListItemResponseDto] })
  data!: ClientListItemResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}
