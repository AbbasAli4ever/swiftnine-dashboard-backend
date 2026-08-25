import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';

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

class ClientTransactionBankAccountDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Whop' })
  bankName!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.swiftnine.com/logos/whop.png',
    nullable: true,
  })
  logoUrl!: string | null;
}

class ClientTransactionBriefDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

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

  @ApiProperty({
    type: ClientTransactionBankAccountDto,
    description:
      'The account this payment came in through — the closest thing to a "payment method" available today.',
  })
  bankAccount!: ClientTransactionBankAccountDto;
}

export class ClientResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({
    example: 0,
    deprecated: true,
    description:
      'Legacy field. No longer settable — POST /clients accepts only clientName, so this is always 0 on clients created after 2026-08-25. Older clients keep whatever was hand-typed at creation. It never reflects real sales; use totalRevenueUsd instead.',
  })
  totalRevenue!: number;

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    nullable: true,
    deprecated: true,
    description:
      'Legacy field, paired with totalRevenue. No longer settable — always null on clients created after 2026-08-25.',
  })
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

  @ApiProperty({
    example: 1039.5,
    description:
      'Every entry in totalSaleAmount converted to USD and summed — the one meaningful total when a client has sales in more than one currency. This is what changes as transactions are added, and the field a "Total Revenue" column should bind to; totalRevenue above is a legacy field that can no longer be set and does not update.',
  })
  totalRevenueUsd!: number;

  @ApiProperty({ type: [ClientTransactionBriefDto] })
  transactions!: ClientTransactionBriefDto[];
}

export class ClientListItemResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({
    example: 0,
    deprecated: true,
    description:
      'Legacy field. No longer settable — POST /clients accepts only clientName, so this is always 0 on clients created after 2026-08-25. Older clients keep whatever was hand-typed at creation. It never reflects real sales; use totalRevenueUsd instead.',
  })
  totalRevenue!: number;

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    nullable: true,
    deprecated: true,
    description:
      'Legacy field, paired with totalRevenue. No longer settable — always null on clients created after 2026-08-25.',
  })
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

  @ApiProperty({
    example: 1039.5,
    description:
      'Every entry in totalSaleAmount converted to USD and summed — the one meaningful total when a client has sales in more than one currency. This is what changes as transactions are added, and the field a "Total Revenue" column should bind to; totalRevenue above is a legacy field that can no longer be set and does not update.',
  })
  totalRevenueUsd!: number;

  @ApiProperty({ type: [ClientTransactionBriefDto] })
  transactions!: ClientTransactionBriefDto[];
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
