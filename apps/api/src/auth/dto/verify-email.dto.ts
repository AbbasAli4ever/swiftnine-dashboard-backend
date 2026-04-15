import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const VerifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
});

export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {}
