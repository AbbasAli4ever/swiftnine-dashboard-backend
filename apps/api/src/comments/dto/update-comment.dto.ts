import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const UpdateCommentSchema = z.object({
  content: z.string().trim().min(1, 'Content is required').max(10000),
  mentionedUserIds: z.array(z.string().uuid('Invalid mentioned user id')).max(100).optional(),
});

export class UpdateCommentDto extends createZodDto(UpdateCommentSchema) {
  @ApiProperty({ type: String, description: 'Comment content', minLength: 1, maxLength: 10000 })
  content: string = '';

  @ApiPropertyOptional({
    type: [String],
    description: 'Mentioned workspace user ids. When omitted, existing mentions are preserved.',
    example: ['cc6c4f04-6cae-4d0a-a3cb-864d53f92f29'],
  })
  mentionedUserIds?: string[];
}
