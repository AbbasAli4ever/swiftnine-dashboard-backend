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

// Either a single `date` (unchanged, back-compat — defaults to today when
// omitted entirely) or a `dateFrom`/`dateTo` range, never both, and never
// just one side of the range. clientId/bankAccountId/accountType/currency
// layer on top of whichever date resolution applies — same filter set as
// GET /transactions, so "export only that data" matches what the Reports
// list is showing when any of them are active.
export const ExportReportQuerySchema = z
  .object({
    date: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'date must be in YYYY-MM-DD format')
      .optional(),
    dateFrom: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'dateFrom must be in YYYY-MM-DD format')
      .optional(),
    dateTo: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'dateTo must be in YYYY-MM-DD format')
      .optional(),
    clientId: z.string().uuid('Invalid client id').optional(),
    bankAccountId: z.string().uuid('Invalid bank account id').optional(),
    // Comma-separated or repeated, same as GET /transactions — e.g.
    // `currency=USD,PKR` exports both rather than requiring one value.
    accountType: enumCsvOrArray(ACCOUNT_TYPE_VALUES, 'Invalid account type'),
    currency: enumCsvOrArray(CURRENCY_VALUES, 'Invalid currency'),
  })
  .refine((value) => !(value.date && (value.dateFrom || value.dateTo)), {
    message: 'Pass either `date` or `dateFrom`/`dateTo`, not both',
    path: ['date'],
  })
  .refine(
    (value) => (value.dateFrom === undefined) === (value.dateTo === undefined),
    {
      message: '`dateFrom` and `dateTo` must be provided together',
      path: ['dateTo'],
    },
  )
  .refine(
    (value) =>
      !value.dateFrom || !value.dateTo || value.dateFrom <= value.dateTo,
    {
      message: 'dateFrom must be on or before dateTo',
      path: ['dateTo'],
    },
  )
  .refine(
    (value) => {
      if (!value.dateFrom || !value.dateTo) return true;
      return (
        daysBetweenDates(value.dateFrom, value.dateTo) <=
        ACCOUNTING_REPORTS_MAX_RANGE_DAYS
      );
    },
    {
      message: `Range cannot exceed ${ACCOUNTING_REPORTS_MAX_RANGE_DAYS} days`,
      path: ['dateTo'],
    },
  );

export class ExportReportQueryDto extends createZodDto(
  ExportReportQuerySchema,
) {}

export type ExportReportQuery = z.output<typeof ExportReportQuerySchema>;
