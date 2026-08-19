import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';
import { ACCOUNT_TYPE_VALUES } from '../bank-account.constants';

class BankAccountTransactionClientDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Victoria Partners' })
  clientName!: string;
}

class BankAccountTransactionBriefDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 'whop_txn_12345' })
  refId!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: '2026-07-15T00:00:00.000Z' })
  saleDate!: Date;

  @ApiProperty({ example: 'Monthly subscription renewal', nullable: true })
  description!: string | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: BankAccountTransactionClientDto })
  client!: BankAccountTransactionClientDto;
}

class BankAccountCountDto {
  @ApiProperty({
    example: 34,
    description: 'Number of transactions linked to this bank account',
  })
  transactions!: number;
}

export class BankAccountResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'HBL' })
  bankName!: string;

  @ApiProperty({ enum: ACCOUNT_TYPE_VALUES, example: 'LOCAL' })
  accountType!: (typeof ACCOUNT_TYPE_VALUES)[number];

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'PKR' })
  currencyType!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: 150000 })
  amount!: number;

  @ApiPropertyOptional({
    example:
      'https://public-data-swiftnine.s3.us-east-1.amazonaws.com/accounts_dashboard_assets/bank-logos/abc123-hbl.png',
    nullable: true,
  })
  logoUrl!: string | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: BankAccountCountDto })
  _count!: BankAccountCountDto;

  @ApiProperty({ type: [BankAccountTransactionBriefDto] })
  transactions!: BankAccountTransactionBriefDto[];
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

export class PaginatedBankAccountsResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: [BankAccountResponseDto] })
  data!: BankAccountResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}
