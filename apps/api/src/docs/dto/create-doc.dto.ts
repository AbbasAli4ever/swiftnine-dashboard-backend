import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { DOC_TITLE_MAX_LENGTH } from '../doc-permissions.constants';

export const CreateDocSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(DOC_TITLE_MAX_LENGTH, `Title must be ${DOC_TITLE_MAX_LENGTH} characters or fewer`),
  scope: z.enum(['WORKSPACE', 'PROJECT', 'PERSONAL']),
  workspaceId: z.string().uuid('Invalid workspace ID'),
  projectId: z.string().uuid('Invalid project ID').nullish(),
  contentJson: z.record(z.string(), z.unknown()).optional(),
});

export class CreateDocDto extends createZodDto(CreateDocSchema) {}

export type CreateDocInput = z.infer<typeof CreateDocSchema>;
