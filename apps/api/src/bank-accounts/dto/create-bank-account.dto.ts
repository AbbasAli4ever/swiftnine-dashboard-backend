import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';
import { ACCOUNT_TYPE_VALUES } from '../bank-account.constants';

const CreateBankAccountSchema = z.object({
  bankName: z.string().trim().min(1, 'Bank name is required').max(255),
  accountType: z.enum(ACCOUNT_TYPE_VALUES).default('LOCAL'),
  currencyType: z.enum(CURRENCY_VALUES).default('PKR'),
  amount: z.coerce.number().nonnegative('Amount cannot be negative'),
});

export class CreateBankAccountDto extends createZodDto(
  CreateBankAccountSchema,
) {
  @ApiProperty({ type: String, description: 'Bank name', example: 'HBL' })
  bankName: string = '';

  @ApiPropertyOptional({
    enum: ACCOUNT_TYPE_VALUES,
    description: 'Whether this is a local or international account',
    default: 'LOCAL',
  })
  accountType: (typeof ACCOUNT_TYPE_VALUES)[number] = 'LOCAL';

  @ApiPropertyOptional({
    enum: CURRENCY_VALUES,
    description: 'Currency held in this account',
    default: 'PKR',
  })
  currencyType: (typeof CURRENCY_VALUES)[number] = 'PKR';

  @ApiProperty({
    type: Number,
    description: 'Account balance',
    example: 150000,
  })
  amount: number = 0;
}
