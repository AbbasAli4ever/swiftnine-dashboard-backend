import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g. #6366f1)')
    .default('#6366f1'),
  icon: z.string().max(50).optional(),
  taskIdPrefix: z
    .string()
    .min(2, 'Prefix must be 2–6 characters')
    .max(6, 'Prefix must be 2–6 characters')
    .regex(/^[A-Z0-9]+$/, 'Prefix must be uppercase letters and numbers only')
    .transform((v) => v.toUpperCase()),
});

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}
