import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const MAX_SECTIONS = 30;
const MAX_HEADING_LENGTH = 200;
const MAX_BODY_LENGTH = 5000;
const MAX_BULLET_LENGTH = 500;
const MAX_BULLETS_PER_SECTION = 20;

const DocumentSectionSchema = z
  .object({
    heading: z.string().trim().max(MAX_HEADING_LENGTH).optional(),
    body: z.string().trim().max(MAX_BODY_LENGTH).optional(),
    bullets: z.array(z.string().trim().max(MAX_BULLET_LENGTH)).max(MAX_BULLETS_PER_SECTION).optional(),
  })
  .refine((s) => Boolean(s.body) || Boolean(s.bullets?.length), {
    message: 'Each section needs a body or at least one bullet',
  });

export const GenerateDocumentSchema = z.object({
  conversationId: z.string().uuid(),
  messageId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(300),
  fileName: z.string().trim().min(1).max(255).optional(),
  sections: z.array(DocumentSectionSchema).min(1).max(MAX_SECTIONS),
});

export class GenerateDocumentDto extends createZodDto(GenerateDocumentSchema) {
  @ApiProperty({ format: 'uuid' })
  conversationId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  messageId?: string;

  @ApiProperty({ example: 'Q3 Roadmap Summary', maxLength: 300 })
  title!: string;

  @ApiPropertyOptional({ example: 'q3-roadmap-summary.pdf', maxLength: 255 })
  fileName?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        heading: { type: 'string', maxLength: MAX_HEADING_LENGTH },
        body: { type: 'string', maxLength: MAX_BODY_LENGTH },
        bullets: { type: 'array', items: { type: 'string', maxLength: MAX_BULLET_LENGTH } },
      },
    },
    minItems: 1,
    maxItems: MAX_SECTIONS,
  })
  sections!: { heading?: string; body?: string; bullets?: string[] }[];
}

export type GenerateDocumentInput = z.output<typeof GenerateDocumentSchema>;
