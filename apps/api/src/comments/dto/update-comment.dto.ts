import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const UpdateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000),
});

export class UpdateCommentDto extends createZodDto(UpdateCommentSchema) {
  @ApiProperty({ type: String, description: 'Comment content', minLength: 1, maxLength: 10000 })
  content: string = '';
}
