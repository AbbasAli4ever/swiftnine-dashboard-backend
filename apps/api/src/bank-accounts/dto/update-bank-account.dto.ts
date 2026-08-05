import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';
import { ACCOUNT_TYPE_VALUES } from '../bank-account.constants';

const UpdateBankAccountSchema = z
  .object({
    bankName: z
      .string()
      .trim()
      .min(1, 'Bank name is required')
      .max(255)
      .optional(),
    accountType: z.enum(ACCOUNT_TYPE_VALUES).optional(),
    currencyType: z.enum(CURRENCY_VALUES).optional(),
    amount: z.coerce
      .number()
      .nonnegative('Amount cannot be negative')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export class UpdateBankAccountDto extends createZodDto(
  UpdateBankAccountSchema,
) {
  @ApiPropertyOptional({
    type: String,
    description: 'Bank name',
    example: 'HBL',
  })
  bankName?: string;

  @ApiPropertyOptional({
    enum: ACCOUNT_TYPE_VALUES,
    description: 'Whether this is a local or international account',
  })
  accountType?: (typeof ACCOUNT_TYPE_VALUES)[number];

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    description: 'Currency held in this account',
  })
  currencyType?: (typeof CURRENCY_VALUES)[number];

  @ApiPropertyOptional({
    type: Number,
    description: 'Account balance',
    example: 150000,
  })
  amount?: number;
}
