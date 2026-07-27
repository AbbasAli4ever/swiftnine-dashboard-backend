import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateConversationSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export class UpdateConversationDto extends createZodDto(UpdateConversationSchema) {}
