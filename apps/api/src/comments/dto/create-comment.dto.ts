import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000),
  parentId: z.string().uuid('Invalid parentId').optional(),
});

export class CreateCommentDto extends createZodDto(CreateCommentSchema) {}
