import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalLimit } from '../../common/query/query.schemas';

const ListMessagesSchema = z.object({
  cursor: z.string().trim().min(1).optional(),
  limit: optionalLimit.transform((value) => Math.min(value, 100)).default(50),
});

export class ListMessagesDto extends createZodDto(ListMessagesSchema) {}

export type ListMessagesQuery = z.output<typeof ListMessagesSchema>;
