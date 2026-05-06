import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalLimit } from '../../common/query/query.schemas';

const MessageContextSchema = z.object({
  messageId: z.string().uuid(),
  before: optionalLimit.transform((value) => Math.min(value, 50)).default(20),
  after: optionalLimit.transform((value) => Math.min(value, 50)).default(20),
});

export class MessageContextDto extends createZodDto(MessageContextSchema) {}

export type MessageContextQuery = z.output<typeof MessageContextSchema>;
