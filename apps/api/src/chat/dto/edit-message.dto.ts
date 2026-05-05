import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const JsonObjectSchema = z.object({}).passthrough();

const EditMessageSchema = z
  .object({
    contentJson: JsonObjectSchema,
    mentionedUserIds: z.array(z.string().uuid()).optional().default([]),
  })
  .transform((data) => ({
    ...data,
    mentionedUserIds: Array.from(new Set(data.mentionedUserIds ?? [])),
  }));

export class EditMessageDto extends createZodDto(EditMessageSchema) {
  @ApiProperty({
    type: Object,
    description: 'Updated rich JSON message payload',
  })
  contentJson!: Record<string, unknown>;

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  mentionedUserIds: string[] = [];
}
