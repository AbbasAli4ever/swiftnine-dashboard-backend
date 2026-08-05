import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  enumCsvOrArray,
  optionalLimit,
  optionalPage,
} from '../../common/query/query.schemas';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';
import {
  ACCOUNT_TYPE_VALUES,
  BANK_ACCOUNT_SORT_FIELDS,
} from '../bank-account.constants';

export const ListBankAccountsQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: optionalPage,
  limit: optionalLimit,
  accountType: enumCsvOrArray(ACCOUNT_TYPE_VALUES, 'Invalid account type'),
  currencyType: enumCsvOrArray(CURRENCY_VALUES, 'Invalid currency'),
  sortBy: z.enum(BANK_ACCOUNT_SORT_FIELDS).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export class ListBankAccountsQueryDto extends createZodDto(
  ListBankAccountsQuerySchema,
) {}

export type ListBankAccountsQuery = z.output<
  typeof ListBankAccountsQuerySchema
>;
