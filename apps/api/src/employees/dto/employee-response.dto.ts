import { ApiProperty } from '@nestjs/swagger';

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
    example: 5000,
    description: 'Commission owed but not yet paid, in PKR — entered manually',
  })
  pendingCommission!: number;

  @ApiProperty({
    example: 20000,
    description: 'paidCommission + pendingCommission — computed, not stored',
  })
  totalCommission!: number;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;
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
