import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
  icon: z.string().max(50).nullable().optional(),
});

export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}
