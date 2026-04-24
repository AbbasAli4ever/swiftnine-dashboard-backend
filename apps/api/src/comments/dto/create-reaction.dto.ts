import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const CreateReactionSchema = z.object({
  reactFace: z.string().trim().min(1, 'reactFace is required').max(64),
});

export class CreateReactionDto extends createZodDto(CreateReactionSchema) {
  @ApiProperty({ type: String, description: 'Reaction identifier (emoji or name)', example: 'like' })
  reactFace: string = '';
}
