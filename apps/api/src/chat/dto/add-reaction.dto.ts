import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const AddReactionSchema = z.object({
  emoji: z.string().trim().min(1).max(64),
});

export class AddReactionDto extends createZodDto(AddReactionSchema) {
  @ApiProperty({ example: '👍' })
  emoji: string = '';
}
