import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PresignTaskListAttachmentSchema = z.object({
  fileName: z.string().trim().min(1).max(255).optional(),
  mimeType: z.string().trim().min(1).max(255),
  fileSize: z.coerce.number().int().nonnegative().optional(),
});

export class PresignTaskListAttachmentDto extends createZodDto(
  PresignTaskListAttachmentSchema,
) {
  @ApiPropertyOptional({ example: 'requirements.pdf', maxLength: 255 })
  fileName?: string;

  @ApiProperty({ example: 'application/pdf', maxLength: 255 })
  mimeType!: string;

  @ApiPropertyOptional({ example: 245000, minimum: 0 })
  fileSize?: number;
}

export type PresignTaskListAttachmentInput = z.output<
  typeof PresignTaskListAttachmentSchema
>;
