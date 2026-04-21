import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ReorderTasksSchema = z.object({
  taskIds: z
    .array(z.string().uuid('Invalid task ID'))
    .min(1, 'At least one task ID is required'),
});

export class ReorderTasksDto extends createZodDto(ReorderTasksSchema) {}
