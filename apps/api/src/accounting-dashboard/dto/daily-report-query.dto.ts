import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DailyReportQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export class DailyReportQueryDto extends createZodDto(DailyReportQuerySchema) {}

export type DailyReportQuery = z.output<typeof DailyReportQuerySchema>;
