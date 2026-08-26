import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  CURRENCY_VALUES,
  TRANSACTION_EMPLOYEE_COMMISSION_PAIR,
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
    employeeId: z
      .string()
      .uuid('Employee id must be a valid UUID')
      .nullable()
      .optional(),
    commissionAmount: z.coerce
      .number()
      .nonnegative('Commission amount cannot be negative')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
  .refine(
    (data) =>
      (data.employeeId === undefined) === (data.commissionAmount === undefined),
    { message: TRANSACTION_EMPLOYEE_COMMISSION_PAIR, path: ['employeeId'] },
  );

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
      'Reassign (or clear, with null) the employee credited on this sale. Must be sent together with commissionAmount, or not at all. Never adjusts pendingCommission — that only happens once, at creation.',
    nullable: true,
  })
  employeeId?: string | null;

  @ApiPropertyOptional({
    type: Number,
    description:
      'Correct the commission amount (PKR) for this sale. Must be sent together with employeeId, or not at all. Never adjusts pendingCommission — that only happens once, at creation.',
    example: 5000,
  })
  commissionAmount?: number;
}
