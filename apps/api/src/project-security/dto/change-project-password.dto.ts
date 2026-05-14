import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ChangeProjectPasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export class ChangeProjectPasswordDto extends createZodDto(ChangeProjectPasswordSchema) {}
