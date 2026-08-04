import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SearchClientsQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search query is required').max(200),
});

export class SearchClientsQueryDto extends createZodDto(
  SearchClientsQuerySchema,
) {}

export type SearchClientsQuery = z.output<typeof SearchClientsQuerySchema>;
