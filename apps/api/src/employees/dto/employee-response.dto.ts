import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';

class EmployeeTransactionBankAccountBriefDto {
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

class EmployeeTransactionBriefDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiProperty({ example: '2026-07-15T00:00:00.000Z' })
  saleDate!: Date;

  @ApiProperty({ example: 'whop_txn_12345' })
  refId!: string;

  @ApiPropertyOptional({
    example: 'Monthly subscription renewal',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    example: 5000,
    description: 'Commission earned on this specific sale, PKR',
  })
  commissionAmount!: number;

  @ApiProperty({ type: EmployeeTransactionBankAccountBriefDto })
  bankAccount!: EmployeeTransactionBankAccountBriefDto;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;
}

class EmployeeCountDto {
  @ApiProperty({ example: 12 })
  transactions!: number;
}

export class EmployeeResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Sara Khan' })
  name!: string;

  @ApiProperty({
    example: 15000,
    description: 'Commission already paid out, in PKR — entered manually',
  })
  paidCommission!: number;

  @ApiProperty({
    example: 53.96,
    description: 'paidCommission converted to USD at the current rate',
  })
  paidCommissionUsd!: number;

  @ApiProperty({
    example: 5000,
    description: 'Commission owed but not yet paid, in PKR — entered manually',
  })
  pendingCommission!: number;

  @ApiProperty({
    example: 17.99,
    description: 'pendingCommission converted to USD at the current rate',
  })
  pendingCommissionUsd!: number;

  @ApiProperty({
    example: 20000,
    description: 'paidCommission + pendingCommission — computed, not stored',
  })
  totalCommission!: number;

  @ApiProperty({
    example: 71.94,
    description: 'totalCommission converted to USD at the current rate',
  })
  totalCommissionUsd!: number;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: EmployeeCountDto })
  _count!: EmployeeCountDto;

  @ApiProperty({
    type: [EmployeeTransactionBriefDto],
    description:
      "Every sale this employee is attached to, most recent first — the source of paidCommission/pendingCommission. commissionAmount on each entry is that sale's specific commission, PKR.",
  })
  transactions!: EmployeeTransactionBriefDto[];
}

export class EmployeeSearchResultDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Sara Khan' })
  name!: string;
}

class EmployeePaginationMetaDto {
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

export class PaginatedEmployeesResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: [EmployeeResponseDto] })
  data!: EmployeeResponseDto[];

  @ApiProperty({ type: EmployeePaginationMetaDto })
  meta!: EmployeePaginationMetaDto;

  @ApiProperty({
    example: 62500,
    description:
      'Sum of pendingCommission across every employee matching the current filter, PKR — not just the current page.',
  })
  totalPendingCommission!: number;

  @ApiProperty({
    example: 224.82,
    description: 'totalPendingCommission converted to USD at the current rate',
  })
  totalPendingCommissionUsd!: number;

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}
