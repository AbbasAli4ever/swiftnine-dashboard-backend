import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const limit = z.coerce.number().int().min(1).max(100).default(50);

export const ListAiAttachmentsQuerySchema = z.object({
  conversationId: z.string().uuid().optional(),
  cursor: z.string().trim().min(1).max(200).optional(),
  limit,
});

export class ListAiAttachmentsQueryDto extends createZodDto(ListAiAttachmentsQuerySchema) {
  @ApiPropertyOptional({ format: 'uuid' })
  conversationId?: string;

  @ApiPropertyOptional({ example: '2026-05-13T10:30:00.000Z:attachment-id' })
  cursor?: string;

  @ApiPropertyOptional({ example: 50, minimum: 1, maximum: 100, default: 50 })
  limit: number = 50;
}

export type ListAiAttachmentsQuery = z.output<typeof ListAiAttachmentsQuerySchema>;
