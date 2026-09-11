import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalPage, optionalLimit } from '../../common/query/query.schemas';

const ListMeetingsSchema = z.object({
  page: optionalPage,
  limit: optionalLimit,
});

export class ListMeetingsDto extends createZodDto(ListMeetingsSchema) {}

export type ListMeetingsQuery = z.output<typeof ListMeetingsSchema>;
