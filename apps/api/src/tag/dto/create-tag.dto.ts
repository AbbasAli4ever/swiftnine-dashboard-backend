import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g. #6366f1)')
    .default('#6366f1'),
});

export class CreateTagDto extends createZodDto(CreateTagSchema) {}
