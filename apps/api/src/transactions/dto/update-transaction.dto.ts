import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  COMMISSION_CURRENCY_VALUES,
  CURRENCY_VALUES,
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
    bankAccountId: z
      .string()
      .uuid('Bank account id must be a valid UUID')
      .optional(),
    saleAmount: z.coerce
      .number()
      .nonnegative('Sale amount cannot be negative')
      .optional(),
    currency: z.enum(CURRENCY_VALUES).optional(),
    saleDate: z.string().datetime().optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    // Nullable so a caller can explicitly clear the assignment/commission,
    // not just leave it untouched by omitting the field. Whether the
    // resulting *combination* is valid (amount needs a currency, commission
    // needs an employee) depends on whatever the transaction already has for
    // fields not included here, so that cross-field check happens in
    // TransactionService.update, not this schema.
    employeeId: z
      .string()
      .uuid('Employee id must be a valid UUID')
      .nullable()
      .optional(),
    commissionAmount: z.coerce
      .number()
      .nonnegative('Commission amount cannot be negative')
      .nullable()
      .optional(),
    commissionCurrency: z
      .enum(COMMISSION_CURRENCY_VALUES)
      .nullable()
      .optional(),
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
    type: String,
    format: 'uuid',
    description:
      "Move this transaction to a different bank account. Its currencyType does not need to match this transaction's currency — unless it's a LOCAL account, which only ever accepts PKR.",
  })
  bankAccountId?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Sale amount for this transaction',
    example: 199.99,
  })
  saleAmount?: number;

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    description:
      'Currency the transaction was settled in. Any value is accepted for an INTERNATIONAL bank account; a LOCAL bank account only accepts PKR.',
  })
  currency?: (typeof CURRENCY_VALUES)[number];

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Correct the date the sale actually happened',
    example: '2026-07-15T00:00:00.000Z',
  })
  saleDate?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional free-text description',
    maxLength: 2000,
    nullable: true,
  })
  description?: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description:
      'Reassign who gets credited for this sale. Send null to clear it — this also clears any commission (a commission cannot exist without an employee).',
    nullable: true,
  })
  employeeId?: string | null;

  @ApiPropertyOptional({
    type: Number,
    description:
      'Correct the manually entered commission for this sale. Send null to clear it.',
    nullable: true,
  })
  commissionAmount?: number | null;

  @ApiPropertyOptional({
    enum: COMMISSION_CURRENCY_VALUES,
    description: 'Correct the currency the commission is paid in.',
    nullable: true,
  })
  commissionCurrency?: (typeof COMMISSION_CURRENCY_VALUES)[number] | null;
}
