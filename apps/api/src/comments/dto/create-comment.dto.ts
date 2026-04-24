import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000),
  parentId: z.string().uuid('Invalid parentId').optional(),
  mentions: z.array(z.string().uuid('Invalid member id')).optional(),
});

export class CreateCommentDto extends createZodDto(CreateCommentSchema) {
  @ApiProperty({ type: String, description: 'Comment content', minLength: 1, maxLength: 10000 })
  content: string = '';

  @ApiProperty({ type: String, description: 'Parent comment id (optional)', required: false, format: 'uuid' })
  parentId?: string;

  @ApiProperty({ type: [String], description: 'Mentioned workspace member ids or user ids', required: false })
  mentions?: string[];
}

