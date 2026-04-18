import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ReorderTaskListsSchema = z.object({
  listIds: z
    .array(z.string().uuid('Invalid list id'))
    .min(1, 'At least one list id is required'),
});

export class ReorderTaskListsDto extends createZodDto(ReorderTaskListsSchema) {}
