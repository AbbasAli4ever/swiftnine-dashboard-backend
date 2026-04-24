import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ReorderBoardTasksSchema = z.object({
  mode: z.literal('manual').default('manual'),
  taskId: z.string().uuid('Invalid task ID'),
  toStatusId: z.string().uuid('Invalid status ID'),
  toListId: z.string().uuid('Invalid list ID').optional(),
  orderedTaskIds: z
    .array(z.string().uuid('Invalid task ID'))
    .min(1, 'At least one task ID is required'),
});

export class ReorderBoardTasksDto extends createZodDto(ReorderBoardTasksSchema) {}
