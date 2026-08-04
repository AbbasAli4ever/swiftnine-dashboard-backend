import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CURRENCY_VALUES,
  PAYMENT_PLATFORM_VALUES,
} from '../transaction.constants';

const CreateTransactionSchema = z.object({
  clientId: z.string().uuid('Client id must be a valid UUID'),
  paymentPlatform: z.enum(PAYMENT_PLATFORM_VALUES).default('WHOP'),
  saleAmount: z.coerce
    .number()
    .nonnegative('Sale amount cannot be negative')
    .default(0),
  currency: z.enum(CURRENCY_VALUES).default('USD'),
  refId: z.string().trim().min(1, 'Reference ID is required').max(255),
  description: z.string().trim().max(2000).optional(),
});

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description:
      'Id of the client this transaction belongs to. The client must already exist.',
    example: 'b3a6b8b0-9c1e-4b8b-8b1a-9b8b1a9b8b1a',
  })
  clientId: string = '';

  @ApiPropertyOptional({
    enum: PAYMENT_PLATFORM_VALUES,
    description: 'Payment platform the transaction was processed on',
    default: 'WHOP',
  })
  paymentPlatform: (typeof PAYMENT_PLATFORM_VALUES)[number] = 'WHOP';

  @ApiPropertyOptional({
    type: Number,
    description: 'Sale amount for this transaction',
    default: 0,
    example: 199.99,
  })
  saleAmount: number = 0;

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    description: 'Currency the transaction was settled in',
    default: 'USD',
  })
  currency: (typeof CURRENCY_VALUES)[number] = 'USD';

  @ApiProperty({
    type: String,
    description: 'Unique reference ID from the payment platform',
    example: 'whop_txn_12345',
  })
  refId: string = '';

  @ApiPropertyOptional({
    type: String,
    description: 'Optional free-text description',
    maxLength: 2000,
  })
  description?: string;
}
