import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateConversationSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
});

export class CreateConversationDto extends createZodDto(CreateConversationSchema) {}
