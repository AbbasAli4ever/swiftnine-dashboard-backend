import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const JsonObjectSchema = z.object({}).passthrough();

const SendMessageSchema = z
  .object({
    contentJson: JsonObjectSchema,
    replyToMessageId: z.string().uuid().optional(),
    mentionedUserIds: z.array(z.string().uuid()).optional().default([]),
    attachmentIds: z.array(z.string().uuid()).optional().default([]),
  })
  .transform((data) => ({
    ...data,
    mentionedUserIds: Array.from(new Set(data.mentionedUserIds ?? [])),
    attachmentIds: Array.from(new Set(data.attachmentIds ?? [])),
  }));

export class SendMessageDto extends createZodDto(SendMessageSchema) {
  @ApiProperty({ type: Object, description: 'Rich JSON message payload' })
  contentJson!: Record<string, unknown>;

  @ApiPropertyOptional({ format: 'uuid' })
  replyToMessageId?: string;

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  mentionedUserIds: string[] = [];

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  attachmentIds: string[] = [];
}
