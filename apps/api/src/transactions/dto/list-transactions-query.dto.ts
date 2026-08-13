import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  enumCsvOrArray,
  optionalDate,
  optionalLimit,
  optionalPage,
} from '../../common/query/query.schemas';
import {
  CURRENCY_VALUES,
  TRANSACTION_SORT_FIELDS,
} from '../transaction.constants';

export const ListTransactionsQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: optionalPage,
  limit: optionalLimit,
  clientId: z.string().uuid('Invalid client id').optional(),
  currency: enumCsvOrArray(CURRENCY_VALUES, 'Invalid currency'),
  dateFrom: optionalDate,
  dateTo: optionalDate,
  sortBy: z.enum(TRANSACTION_SORT_FIELDS).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export class ListTransactionsQueryDto extends createZodDto(
  ListTransactionsQuerySchema,
) {}

export type ListTransactionsQuery = z.output<
  typeof ListTransactionsQuerySchema
>;
