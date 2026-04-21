import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AddTagToTaskSchema = z.object({
  tagId: z.string().uuid('Invalid tag ID'),
});

export class AddTagToTaskDto extends createZodDto(AddTagToTaskSchema) {}
