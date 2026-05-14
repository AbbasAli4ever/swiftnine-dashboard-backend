import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UnlockProjectSchema = z.object({
  password: z.string().min(1),
});

export class UnlockProjectDto extends createZodDto(UnlockProjectSchema) {}
