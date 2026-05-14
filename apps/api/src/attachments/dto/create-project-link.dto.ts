import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const httpUrl = z
  .string()
  .trim()
  .url('linkUrl must be a valid URL')
  .max(2048)
  .refine((value) => /^https?:\/\//i.test(value), {
    message: 'linkUrl must start with http:// or https://',
  });

export const CreateProjectLinkSchema = z.object({
  linkUrl: httpUrl,
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).optional(),
});

export class CreateProjectLinkDto extends createZodDto(CreateProjectLinkSchema) {
  @ApiProperty({ example: 'https://www.figma.com/file/example', maxLength: 2048 })
  linkUrl!: string;

  @ApiProperty({ example: 'Design file', maxLength: 255 })
  title!: string;

  @ApiPropertyOptional({
    example: 'Main design reference for this project.',
    maxLength: 2000,
  })
  description?: string;
}

export type CreateProjectLinkInput = z.output<typeof CreateProjectLinkSchema>;
