import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const UpdateChannelSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    description: z.union([z.string().max(10000), z.null()]).optional(),
    privacy: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export class UpdateChannelDto extends createZodDto(UpdateChannelSchema) {
  @ApiPropertyOptional({ type: String, description: 'Channel name', minLength: 1, maxLength: 255 })
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'Channel description (use null to clear)' })
  description?: string | null;

  @ApiPropertyOptional({ enum: ['PUBLIC', 'PRIVATE'], description: 'Channel privacy' })
  privacy?: 'PUBLIC' | 'PRIVATE';
}
