import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(10000).nullable().optional(),
  statusId: z.string().uuid('Invalid status ID').optional(),
  priority: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE']).optional(),
  startDate: z.string().datetime().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  listId: z.string().uuid('Invalid list ID').optional(),
});

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}
