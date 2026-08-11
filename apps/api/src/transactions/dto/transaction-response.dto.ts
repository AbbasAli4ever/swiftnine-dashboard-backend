import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CURRENCY_VALUES,
  PAYMENT_PLATFORM_VALUES,
  TRANSACTION_TYPE_VALUES,
} from '../transaction.constants';

class TransactionClientBriefDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;
}

class TransactionBankAccountBriefDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'HBL' })
  bankName!: string;
}

export class TransactionResponseDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  clientId!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ type: TransactionClientBriefDto })
  client!: TransactionClientBriefDto;

  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  bankAccountId!: string;

  @ApiProperty({ type: TransactionBankAccountBriefDto })
  bankAccount!: TransactionBankAccountBriefDto;

  @ApiProperty({
    enum: TRANSACTION_TYPE_VALUES,
    example: 'CREDIT',
    description:
      'CREDIT increases the bank account balance, DEBIT decreases it.',
  })
  type!: (typeof TRANSACTION_TYPE_VALUES)[number];

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: PAYMENT_PLATFORM_VALUES, example: 'WHOP' })
  paymentPlatform!: (typeof PAYMENT_PLATFORM_VALUES)[number];

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: 'whop_txn_12345' })
  refId!: string;

  @ApiProperty({
    example: '2026-07-15T00:00:00.000Z',
    description: 'The date the sale actually happened',
  })
  saleDate!: Date;

  @ApiPropertyOptional({
    example: 'Monthly subscription renewal',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;
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

export class PaginatedTransactionsResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: [TransactionResponseDto] })
  data!: TransactionResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  @ApiPropertyOptional({ example: null, nullable: true })
  message!: string | null;
}
