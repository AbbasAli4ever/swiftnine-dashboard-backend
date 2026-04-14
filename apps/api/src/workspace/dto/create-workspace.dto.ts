import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  logoUrl: z.string().url('Must be a valid URL').optional(),
});

export class CreateWorkspaceDto extends createZodDto(CreateWorkspaceSchema) {}
