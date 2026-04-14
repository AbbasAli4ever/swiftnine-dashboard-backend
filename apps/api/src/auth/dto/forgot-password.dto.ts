import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
