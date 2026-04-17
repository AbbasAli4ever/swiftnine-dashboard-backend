import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ReorderStatusesSchema = z.object({
  projectId: z.string().uuid('Invalid project id'),
  groups: z.object({
    notStarted: z.array(z.string().uuid('Invalid status id')),
    active: z.array(z.string().uuid('Invalid status id')),
    done: z.array(z.string().uuid('Invalid status id')),
    closed: z.array(z.string().uuid('Invalid status id')),
  }),
});

export class ReorderStatusesDto extends createZodDto(ReorderStatusesSchema) {}
