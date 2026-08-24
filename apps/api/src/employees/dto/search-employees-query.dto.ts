import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SearchEmployeesQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search query is required').max(200),
});

export class SearchEmployeesQueryDto extends createZodDto(
  SearchEmployeesQuerySchema,
) {}

export type SearchEmployeesQuery = z.output<typeof SearchEmployeesQuerySchema>;
