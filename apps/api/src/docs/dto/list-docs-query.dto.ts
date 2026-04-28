import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ListDocsQuerySchema = z.object({
  workspaceId: z.string().uuid('Invalid workspace ID'),
  projectId: z.string().uuid('Invalid project ID').optional(),
  scope: z.enum(['WORKSPACE', 'PROJECT', 'PERSONAL']).optional(),
});

export class ListDocsQueryDto extends createZodDto(ListDocsQuerySchema) {}

export type ListDocsQuery = z.infer<typeof ListDocsQuerySchema>;
