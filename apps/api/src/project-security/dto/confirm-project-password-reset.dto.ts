import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ConfirmProjectPasswordResetSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
  newPassword: z.string().min(1),
});

export class ConfirmProjectPasswordResetDto extends createZodDto(
  ConfirmProjectPasswordResetSchema,
) {}
