import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ExportReportQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
});

export class ExportReportQueryDto extends createZodDto(
  ExportReportQuerySchema,
) {}

export type ExportReportQuery = z.output<typeof ExportReportQuerySchema>;
