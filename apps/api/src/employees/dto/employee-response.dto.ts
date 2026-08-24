import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  COMMISSION_CURRENCY_VALUES,
  CURRENCY_VALUES,
} from '../../transactions/transaction.constants';

class EmployeeCountDto {
  @ApiProperty({
    example: 12,
    description: 'Number of transactions linked to this employee',
  })
  transactions!: number;
}

class EmployeeCommissionTotalDto {
  @ApiProperty({ enum: COMMISSION_CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof COMMISSION_CURRENCY_VALUES)[number];

  @ApiProperty({ example: 450.5 })
  total!: number;
}

class EmployeeTransactionClientDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Acme Corp' })
  clientName!: string;
}

class EmployeeTransactionBriefDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({ example: 199.99 })
  saleAmount!: number;

  @ApiProperty({ enum: CURRENCY_VALUES, example: 'USD' })
  currency!: (typeof CURRENCY_VALUES)[number];

  @ApiPropertyOptional({ example: 20, nullable: true })
  commissionAmount!: number | null;

  @ApiPropertyOptional({
    enum: COMMISSION_CURRENCY_VALUES,
    nullable: true,
  })
  commissionCurrency!: (typeof COMMISSION_CURRENCY_VALUES)[number] | null;

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

  @ApiProperty({ type: EmployeeTransactionClientDto })
  client!: EmployeeTransactionClientDto;
}

export class EmployeeResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Sara Khan' })
  name!: string;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: EmployeeCountDto })
  _count!: EmployeeCountDto;

  @ApiProperty({
    type: [EmployeeCommissionTotalDto],
    description:
      "Sum of commissionAmount across this employee's transactions, grouped by currency",
  })
  totalCommission!: EmployeeCommissionTotalDto[];

  @ApiProperty({ type: [EmployeeTransactionBriefDto] })
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

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}
