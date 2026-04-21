import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateTagSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g. #6366f1)')
    .optional(),
});

export class UpdateTagDto extends createZodDto(UpdateTagSchema) {}
