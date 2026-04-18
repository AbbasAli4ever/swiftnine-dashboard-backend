import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateTaskListSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
});

export class CreateTaskListDto extends createZodDto(CreateTaskListSchema) {}
