import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateMessageSchema = z.object({
  role: z.enum(['USER', 'ASSISTANT']),
  content: z.string().min(1),
  status: z.enum(['COMPLETE', 'ABORTED']).default('COMPLETE'),
  // Client-computed title (e.g. truncated first message) — applied only if
  // the conversation has no title yet and this is a USER message.
  title: z.string().trim().min(1).max(200).optional(),
});

export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}
