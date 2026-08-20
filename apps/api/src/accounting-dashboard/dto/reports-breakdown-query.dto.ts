import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  ACCOUNTING_REPORTS_MAX_RANGE_DAYS,
  DATE_FORMAT_REGEX,
  daysBetweenDates,
} from '../accounting-dashboard.constants';
import { enumCsvOrArray } from '../../common/query/query.schemas';
import { CURRENCY_VALUES } from '../../transactions/transaction.constants';
import { ACCOUNT_TYPE_VALUES } from '../../bank-accounts/bank-account.constants';

// Same filter set as GET /transactions and the Excel export — so the
// Reports page's revenue/balance breakdown can be scoped to exactly what
// the filter bar currently shows, not just the date range.
export const ReportsBreakdownQuerySchema = z
  .object({
    dateFrom: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'dateFrom must be in YYYY-MM-DD format'),
    dateTo: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'dateTo must be in YYYY-MM-DD format'),
    clientId: z.string().uuid('Invalid client id').optional(),
    bankAccountId: z.string().uuid('Invalid bank account id').optional(),
    accountType: enumCsvOrArray(ACCOUNT_TYPE_VALUES, 'Invalid account type'),
    currency: enumCsvOrArray(CURRENCY_VALUES, 'Invalid currency'),
  })
  .refine((value) => value.dateFrom <= value.dateTo, {
    message: 'dateFrom must be on or before dateTo',
    path: ['dateTo'],
  })
  .refine(
    (value) =>
      daysBetweenDates(value.dateFrom, value.dateTo) <=
      ACCOUNTING_REPORTS_MAX_RANGE_DAYS,
    {
      message: `Range cannot exceed ${ACCOUNTING_REPORTS_MAX_RANGE_DAYS} days`,
      path: ['dateTo'],
    },
  );

export class ReportsBreakdownQueryDto extends createZodDto(
  ReportsBreakdownQuerySchema,
) {}

export type ReportsBreakdownQuery = z.output<
  typeof ReportsBreakdownQuerySchema
>;
