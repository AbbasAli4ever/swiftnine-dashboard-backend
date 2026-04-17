import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const DefaultStatusesSchema = z.object({
  projectId: z.string().uuid('Invalid project id'),
});

export class DefaultStatusesDto extends createZodDto(DefaultStatusesSchema) {}
