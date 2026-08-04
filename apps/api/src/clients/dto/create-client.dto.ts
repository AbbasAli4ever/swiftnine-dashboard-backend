import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';

const CreateClientSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required').max(255),
  totalRevenue: z.coerce
    .number()
    .nonnegative('Total revenue cannot be negative'),
  currencyType: z.enum(CURRENCY_VALUES).optional(),
});

export class CreateClientDto extends createZodDto(CreateClientSchema) {
  @ApiProperty({
    type: String,
    description: 'Client name',
    example: 'Acme Corp',
  })
  clientName: string = '';

  @ApiProperty({
    type: Number,
    description: 'Total revenue for this client',
    example: 25000,
  })
  totalRevenue: number = 0;

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    description: 'Currency the total revenue is denominated in',
  })
  currencyType?: (typeof CURRENCY_VALUES)[number];
}
