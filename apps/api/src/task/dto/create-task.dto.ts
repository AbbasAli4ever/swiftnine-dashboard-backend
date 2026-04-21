import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().max(10000).optional(),
  statusId: z.string().uuid('Invalid status ID'),
  priority: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE']).default('NONE'),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  assigneeIds: z.array(z.string().uuid('Invalid user ID')).optional(),
  tagIds: z.array(z.string().uuid('Invalid tag ID')).optional(),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}
