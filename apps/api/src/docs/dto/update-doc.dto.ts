import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { DOC_TITLE_MAX_LENGTH } from '../doc-permissions.constants';

export const UpdateDocSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(DOC_TITLE_MAX_LENGTH)
    .optional(),
  contentJson: z.record(z.string(), z.unknown()).optional(),
});

export class UpdateDocDto extends createZodDto(UpdateDocSchema) {}

export type UpdateDocInput = z.infer<typeof UpdateDocSchema>;
