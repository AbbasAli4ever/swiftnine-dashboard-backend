import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DashboardSearchQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search query is required').max(200),
});

export class DashboardSearchQueryDto extends createZodDto(
  DashboardSearchQuerySchema,
) {}

export type DashboardSearchQuery = z.output<typeof DashboardSearchQuerySchema>;
