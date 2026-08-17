import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { REPORTS_BREAKDOWN_MAX_RANGE_DAYS } from '../accounting-dashboard.constants';

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

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
    (value) => {
      const days =
        (Date.parse(`${value.dateTo}T00:00:00.000Z`) -
          Date.parse(`${value.dateFrom}T00:00:00.000Z`)) /
        MS_PER_DAY;
      return days <= REPORTS_BREAKDOWN_MAX_RANGE_DAYS;
    },
    {
      message: `Range cannot exceed ${REPORTS_BREAKDOWN_MAX_RANGE_DAYS} days`,
      path: ['dateTo'],
    },
  );

export class ReportsBreakdownQueryDto extends createZodDto(
  ReportsBreakdownQuerySchema,
) {}

export type ReportsBreakdownQuery = z.output<
  typeof ReportsBreakdownQuerySchema
>;
