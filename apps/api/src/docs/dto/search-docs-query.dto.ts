import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SearchDocsQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search query is required'),
  workspaceId: z.string().uuid('Invalid workspace ID'),
  projectId: z.string().uuid('Invalid project ID').optional(),
});

export class SearchDocsQueryDto extends createZodDto(SearchDocsQuerySchema) {}

export type SearchDocsQuery = z.infer<typeof SearchDocsQuerySchema>;
