import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ConfirmProjectPasswordResetSchema = z.object({
  token: z.string().uuid('Invalid reset token'),
  newPassword: z.string().min(1),
});

export class ConfirmProjectPasswordResetDto extends createZodDto(
  ConfirmProjectPasswordResetSchema,
) {}
