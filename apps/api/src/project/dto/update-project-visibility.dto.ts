import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateProjectVisibilitySchema = z.object({
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
});

export class UpdateProjectVisibilityDto extends createZodDto(
  UpdateProjectVisibilitySchema,
) {}
