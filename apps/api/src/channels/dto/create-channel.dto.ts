import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const CreateChannelSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(10000).optional(),
  privacy: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  projectId: z.string().uuid('Invalid projectId').optional(),
});

export class CreateChannelDto extends createZodDto(CreateChannelSchema) {
  @ApiProperty({ type: String, description: 'Channel name', minLength: 1, maxLength: 255 })
  name: string = '';

  @ApiProperty({ type: String, description: 'Channel description', required: false })
  description?: string;

  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE'], required: false, description: 'Channel privacy' })
  privacy?: 'PUBLIC' | 'PRIVATE';

  @ApiProperty({ type: String, format: 'uuid', required: false, description: 'Optional project id to scope the channel' })
  projectId?: string;
}
