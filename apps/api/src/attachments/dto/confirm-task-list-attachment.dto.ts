import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ConfirmTaskListAttachmentSchema = z.object({
  s3Key: z.string().trim().min(1).max(1024),
  fileName: z.string().trim().min(1).max(255).optional(),
  mimeType: z.string().trim().min(1).max(255).optional(),
  fileSize: z.coerce.number().int().nonnegative().optional(),
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(2000).optional(),
});

export class ConfirmTaskListAttachmentDto extends createZodDto(
  ConfirmTaskListAttachmentSchema,
) {
  @ApiProperty({
    example: 'swiftnine/docs/app/attachments/list-2f9c1b8a/file-requirements.pdf',
    maxLength: 1024,
  })
  s3Key!: string;

  @ApiPropertyOptional({ example: 'requirements.pdf', maxLength: 255 })
  fileName?: string;

  @ApiPropertyOptional({ example: 'application/pdf', maxLength: 255 })
  mimeType?: string;

  @ApiPropertyOptional({ example: 245000, minimum: 0 })
  fileSize?: number;

  @ApiPropertyOptional({ example: 'List requirements', maxLength: 255 })
  title?: string;

  @ApiPropertyOptional({
    example: 'Reference material for this list.',
    maxLength: 2000,
  })
  description?: string;
}

export type ConfirmTaskListAttachmentInput = z.output<
  typeof ConfirmTaskListAttachmentSchema
>;
