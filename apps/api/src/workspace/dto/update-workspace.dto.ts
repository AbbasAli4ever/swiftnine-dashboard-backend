import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url('Must be a valid URL').nullable().optional(),
});

export class UpdateWorkspaceDto extends createZodDto(UpdateWorkspaceSchema) {}
