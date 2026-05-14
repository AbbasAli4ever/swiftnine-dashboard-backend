import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SetProjectPasswordSchema = z.object({
  password: z.string().min(1),
});

export class SetProjectPasswordDto extends createZodDto(SetProjectPasswordSchema) {}
