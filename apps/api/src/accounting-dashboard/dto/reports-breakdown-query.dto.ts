import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  ACCOUNTING_REPORTS_MAX_RANGE_DAYS,
  DATE_FORMAT_REGEX,
  daysBetweenDates,
} from '../accounting-dashboard.constants';

export const ReportsBreakdownQuerySchema = z
  .object({
    dateFrom: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'dateFrom must be in YYYY-MM-DD format'),
    dateTo: z
      .string()
      .regex(DATE_FORMAT_REGEX, 'dateTo must be in YYYY-MM-DD format'),
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
