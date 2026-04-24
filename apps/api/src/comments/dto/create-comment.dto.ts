import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CreateCommentSchema = z.object({
  content: z.string().trim().min(1, 'Content is required').max(10000),
  parentId: z.string().uuid('Invalid parentId').optional(),
  mentionedUserIds: z.array(z.string().uuid('Invalid mentioned user id')).max(100).optional(),
});

export class CreateCommentDto extends createZodDto(CreateCommentSchema) {
  @ApiProperty({ type: String, description: 'Comment content', minLength: 1, maxLength: 10000 })
  content: string = '';

  @ApiPropertyOptional({ type: String, description: 'Parent comment id (optional)', format: 'uuid' })
  parentId?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Mentioned workspace user ids',
    example: ['cc6c4f04-6cae-4d0a-a3cb-864d53f92f29'],
  })
  mentionedUserIds?: string[];
}
