import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ConfirmAiAttachmentSchema = z.object({
  messageId: z.string().uuid().optional(),
  // Opaque AI-provenance bag (model/prompt/pageCount/dimensions/wordCount/
  // checksum) — not computed by this layer, just accepted and stored as-is.
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export class ConfirmAiAttachmentDto extends createZodDto(ConfirmAiAttachmentSchema) {
  @ApiPropertyOptional({ format: 'uuid' })
  messageId?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  metadata?: Record<string, unknown>;
}

export type ConfirmAiAttachmentInput = z.output<typeof ConfirmAiAttachmentSchema>;
