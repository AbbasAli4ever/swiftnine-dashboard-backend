import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateProjectAttachmentSchema = z
  .object({
    title: z.string().trim().min(1).max(255).nullable().optional(),
    description: z.string().trim().max(2000).nullable().optional(),
  })
  .refine(
    (value) =>
      Object.prototype.hasOwnProperty.call(value, 'title') ||
      Object.prototype.hasOwnProperty.call(value, 'description'),
    { message: 'At least one field must be provided' },
  );

export class UpdateProjectAttachmentDto extends createZodDto(
  UpdateProjectAttachmentSchema,
) {
  @ApiPropertyOptional({
    example: 'Updated reference title',
    nullable: true,
    maxLength: 255,
  })
  title?: string | null;

  @ApiPropertyOptional({
    example: 'Updated description for the resource.',
    nullable: true,
    maxLength: 2000,
  })
  description?: string | null;
}

export type UpdateProjectAttachmentInput = z.output<
  typeof UpdateProjectAttachmentSchema
>;
