import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SearchVendorsQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search query is required').max(200),
});

export class SearchVendorsQueryDto extends createZodDto(
  SearchVendorsQuerySchema,
) {}

export type SearchVendorsQuery = z.output<typeof SearchVendorsQuerySchema>;
