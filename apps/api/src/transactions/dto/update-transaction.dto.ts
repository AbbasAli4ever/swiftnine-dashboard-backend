import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  CURRENCY_VALUES,
  PAYMENT_PLATFORM_VALUES,
} from '../transaction.constants';

const UpdateTransactionSchema = z
  .object({
    clientId: z.string().uuid('Client id must be a valid UUID').optional(),
    clientName: z
      .string()
      .trim()
      .min(1, 'Client name is required')
      .max(255)
      .optional(),
    paymentPlatform: z.enum(PAYMENT_PLATFORM_VALUES).optional(),
    saleAmount: z.coerce
      .number()
      .nonnegative('Sale amount cannot be negative')
      .optional(),
    currency: z.enum(CURRENCY_VALUES).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export class UpdateTransactionDto extends createZodDto(
  UpdateTransactionSchema,
) {
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: 'Reassign this transaction to a different client',
  })
  clientId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Client name for this transaction',
    example: 'Acme Corp',
  })
  clientName?: string;

  @ApiPropertyOptional({
    enum: PAYMENT_PLATFORM_VALUES,
    description: 'Payment platform the transaction was processed on',
  })
  paymentPlatform?: (typeof PAYMENT_PLATFORM_VALUES)[number];

  @ApiPropertyOptional({
    type: Number,
    description: 'Sale amount for this transaction',
    example: 199.99,
  })
  saleAmount?: number;

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    description: 'Currency the transaction was settled in',
  })
  currency?: (typeof CURRENCY_VALUES)[number];

  @ApiPropertyOptional({
    type: String,
    description: 'Optional free-text description',
    maxLength: 2000,
    nullable: true,
  })
  description?: string | null;
}
