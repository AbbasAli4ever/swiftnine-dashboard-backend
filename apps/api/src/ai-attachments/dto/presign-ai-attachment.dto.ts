import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { WIRE_ATTACHMENT_TYPES } from '../ai-attachments.constants';

export const PresignAiAttachmentSchema = z.object({
  conversationId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(255),
  fileSize: z.coerce.number().int().positive(),
  attachmentType: z.enum(WIRE_ATTACHMENT_TYPES),
});

export class PresignAiAttachmentDto extends createZodDto(PresignAiAttachmentSchema) {
  @ApiProperty({ format: 'uuid' })
  conversationId!: string;

  @ApiProperty({ example: 'requirements.pdf', maxLength: 255 })
  fileName!: string;

  @ApiProperty({ example: 'application/pdf', maxLength: 255 })
  mimeType!: string;

  @ApiProperty({ example: 245000, minimum: 1 })
  fileSize!: number;

  @ApiProperty({ enum: WIRE_ATTACHMENT_TYPES })
  attachmentType!: (typeof WIRE_ATTACHMENT_TYPES)[number];
}

export type PresignAiAttachmentInput = z.output<typeof PresignAiAttachmentSchema>;
