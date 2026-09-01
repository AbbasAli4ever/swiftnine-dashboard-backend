import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VendorResponseDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Karachi Print House' })
  name!: string;

  @ApiProperty({
    example: 45000,
    description:
      'Amount owed to this vendor but not yet paid, in PKR — entered manually, not derived from any transaction',
  })
  pendingPayment!: number;

  @ApiPropertyOptional({
    example: '2026-09-30T00:00:00.000Z',
    description:
      'When the pendingPayment is due — entered manually, no reminder/notification behavior',
    nullable: true,
  })
  dueDate!: Date | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;
}

export class VendorSearchResultDto {
  @ApiProperty({ example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a' })
  id!: string;

  @ApiProperty({ example: 'Karachi Print House' })
  name!: string;
}

class VendorPaginationMetaDto {
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

export class PaginatedVendorsResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: [VendorResponseDto] })
  data!: VendorResponseDto[];

  @ApiProperty({ type: VendorPaginationMetaDto })
  meta!: VendorPaginationMetaDto;

  @ApiProperty({
    example: 187500,
    description:
      'Sum of pendingPayment across every vendor matching the current filter, PKR — not just the current page.',
  })
  totalPendingPayment!: number;

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}
