import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const limit = z.coerce.number().int().min(1).max(100).default(50);

export const ListTaskListAttachmentsQuerySchema = z.object({
  kind: z.enum(['FILE', 'LINK']).optional(),
  uploadedBy: z.string().uuid('Invalid uploader id').optional(),
  q: z.string().trim().min(1).max(200).optional(),
  cursor: z.string().trim().min(1).max(200).optional(),
  limit,
});

export class ListTaskListAttachmentsQueryDto extends createZodDto(
  ListTaskListAttachmentsQuerySchema,
) {
  @ApiPropertyOptional({ enum: ['FILE', 'LINK'] })
  kind?: 'FILE' | 'LINK';

  @ApiPropertyOptional({
    example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
    format: 'uuid',
  })
  uploadedBy?: string;

  @ApiPropertyOptional({ example: 'requirements', maxLength: 200 })
  q?: string;

  @ApiPropertyOptional({ example: '2026-05-21T10:30:00.000Z:attachment-id' })
  cursor?: string;

  @ApiPropertyOptional({ example: 50, minimum: 1, maximum: 100, default: 50 })
  limit: number = 50;
}

export type ListTaskListAttachmentsQuery = z.output<
  typeof ListTaskListAttachmentsQuerySchema
>;
