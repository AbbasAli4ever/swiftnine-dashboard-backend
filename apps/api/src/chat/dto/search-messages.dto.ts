import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalLimit } from '../../common/query/query.schemas';

const SearchMessagesSchema = z.object({
  q: z.string().trim().min(1).max(200),
  channelId: z.string().uuid().optional(),
  cursor: z.string().trim().min(1).optional(),
  limit: optionalLimit.transform((value) => Math.min(value, 100)).default(50),
});

export class SearchMessagesDto extends createZodDto(SearchMessagesSchema) {}

export type SearchMessagesQuery = z.output<typeof SearchMessagesSchema>;
