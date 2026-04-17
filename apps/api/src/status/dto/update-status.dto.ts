import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const UpdateStatusSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    color: z
      .string()
      .regex(HEX_COLOR_REGEX, 'Color must be a valid hex code')
      .optional(),
  })
  .refine((value) => value.name !== undefined || value.color !== undefined, {
    message: 'At least one field must be provided',
  });

export class UpdateStatusDto extends createZodDto(UpdateStatusSchema) {}
