import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MonthlyBreakdownQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
});

export class MonthlyBreakdownQueryDto extends createZodDto(
  MonthlyBreakdownQuerySchema,
) {}

export type MonthlyBreakdownQuery = z.output<
  typeof MonthlyBreakdownQuerySchema
>;
