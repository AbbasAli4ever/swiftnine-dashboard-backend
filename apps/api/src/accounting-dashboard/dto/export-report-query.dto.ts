import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  ACCOUNTING_REPORTS_MAX_RANGE_DAYS,
  DATE_FORMAT_REGEX,
  daysBetweenDates,
} from '../accounting-dashboard.constants';

// Either a single `date` (unchanged, back-compat — defaults to today when
// omitted entirely) or a `dateFrom`/`dateTo` range, never both, and never
// just one side of the range.
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
