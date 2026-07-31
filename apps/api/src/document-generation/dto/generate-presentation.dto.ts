import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MAX_DECK_SLIDES } from '../../ai-generation/ai-generation.constants';

const MAX_HEADING_LENGTH = 200;
const MAX_BODY_LENGTH = 2000;
const MAX_BULLET_LENGTH = 300;
const MAX_BULLETS_PER_SLIDE = 6;
const MAX_IMAGE_PROMPT_LENGTH = 800;
const MAX_QUOTE_LENGTH = 600;
const MAX_CHART_ITEMS = 12;

const FONT_ENUM = z.enum(['Arial', 'Georgia', 'Verdana', 'Trebuchet MS']);
const HEX_COLOR = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{6}$/, 'accentColor must be a bare 6-digit hex value, no "#"');

const ThemeSchema = z.object({
  accentColor: HEX_COLOR,
  headFont: FONT_ENUM,
  bodyFont: FONT_ENUM,
});

const TitleSlideSchema = z.object({
  type: z.literal('title'),
  heading: z.string().trim().min(1).max(MAX_HEADING_LENGTH),
  subheading: z.string().trim().max(MAX_HEADING_LENGTH).optional(),
});

const BulletsSlideSchema = z.object({
  type: z.literal('bullets'),
  heading: z.string().trim().min(1).max(MAX_HEADING_LENGTH),
  bullets: z.array(z.string().trim().max(MAX_BULLET_LENGTH)).min(1).max(MAX_BULLETS_PER_SLIDE),
});

const ImageSlideSchema = z.object({
  type: z.enum(['image-left', 'image-right']),
  heading: z.string().trim().min(1).max(MAX_HEADING_LENGTH),
  body: z.string().trim().max(MAX_BODY_LENGTH).optional(),
  bullets: z.array(z.string().trim().max(MAX_BULLET_LENGTH)).max(MAX_BULLETS_PER_SLIDE).optional(),
  imagePrompt: z.string().trim().min(1).max(MAX_IMAGE_PROMPT_LENGTH),
});

const ChartSlideSchema = z
  .object({
    type: z.literal('chart'),
    heading: z.string().trim().min(1).max(MAX_HEADING_LENGTH),
    chartType: z.enum(['bar', 'line', 'pie', 'doughnut']),
    labels: z.array(z.string().trim().max(MAX_HEADING_LENGTH)).min(1).max(MAX_CHART_ITEMS),
    values: z.array(z.number()).min(1).max(MAX_CHART_ITEMS),
  })
  .refine((s) => s.labels.length === s.values.length, {
    message: 'labels and values must be the same length',
  });

const QuoteSlideSchema = z.object({
  type: z.literal('quote'),
  quote: z.string().trim().min(1).max(MAX_QUOTE_LENGTH),
  attribution: z.string().trim().max(MAX_HEADING_LENGTH).optional(),
});

const SectionDividerSlideSchema = z.object({
  type: z.literal('section-divider'),
  heading: z.string().trim().min(1).max(MAX_HEADING_LENGTH),
});

const SlideSchema = z.discriminatedUnion('type', [
  TitleSlideSchema,
  BulletsSlideSchema,
  ImageSlideSchema,
  ChartSlideSchema,
  QuoteSlideSchema,
  SectionDividerSlideSchema,
]);

export const GeneratePresentationSchema = z.object({
  conversationId: z.string().uuid(),
  messageId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().trim().max(300).optional(),
  fileName: z.string().trim().min(1).max(255).optional(),
  theme: ThemeSchema,
  slides: z.array(SlideSchema).min(1).max(MAX_DECK_SLIDES),
});

export class GeneratePresentationDto extends createZodDto(GeneratePresentationSchema) {
  @ApiProperty({ format: 'uuid' })
  conversationId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  messageId?: string;

  @ApiProperty({ example: 'Q3 Roadmap', maxLength: 300 })
  title!: string;

  @ApiPropertyOptional({ example: 'A look ahead', maxLength: 300 })
  subtitle?: string;

  @ApiPropertyOptional({ example: 'q3-roadmap.pptx', maxLength: 255 })
  fileName?: string;

  @ApiProperty({
    type: 'object',
    properties: {
      accentColor: { type: 'string', example: '2563EB' },
      headFont: { type: 'string', example: 'Arial' },
      bodyFont: { type: 'string', example: 'Arial' },
    },
  })
  theme!: z.output<typeof ThemeSchema>;

  @ApiProperty({ type: 'array', items: { type: 'object' }, minItems: 1, maxItems: MAX_DECK_SLIDES })
  slides!: z.output<typeof SlideSchema>[];
}

export type GeneratePresentationInput = z.output<typeof GeneratePresentationSchema>;
export type PresentationSlide = z.output<typeof SlideSchema>;
export type PresentationTheme = z.output<typeof ThemeSchema>;
