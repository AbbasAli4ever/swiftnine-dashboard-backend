import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ListStatusesSchema = z.object({
  projectId: z.string().uuid('Invalid project id'),
});

export class ListStatusesDto extends createZodDto(ListStatusesSchema) {}
