import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000),
});

export class UpdateCommentDto extends createZodDto(UpdateCommentSchema) {}
