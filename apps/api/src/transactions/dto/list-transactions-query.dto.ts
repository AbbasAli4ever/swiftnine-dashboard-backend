import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  enumCsvOrArray,
  optionalLimit,
  optionalPage,
} from '../../common/query/query.schemas';
import {
  CURRENCY_VALUES,
  PAYMENT_PLATFORM_VALUES,
  TRANSACTION_SORT_FIELDS,
} from '../transaction.constants';

export const ListTransactionsQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: optionalPage,
  limit: optionalLimit,
  clientId: z.string().uuid('Invalid client id').optional(),
  paymentPlatform: enumCsvOrArray(
    PAYMENT_PLATFORM_VALUES,
    'Invalid payment platform',
  ),
  currency: enumCsvOrArray(CURRENCY_VALUES, 'Invalid currency'),
  sortBy: z.enum(TRANSACTION_SORT_FIELDS).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export class ListTransactionsQueryDto extends createZodDto(
  ListTransactionsQuerySchema,
) {}

export type ListTransactionsQuery = z.output<
  typeof ListTransactionsQuerySchema
>;
