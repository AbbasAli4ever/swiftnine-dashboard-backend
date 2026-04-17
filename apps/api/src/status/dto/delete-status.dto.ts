import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const DeleteStatusSchema = z.object({
  replacementStatusId: z.string().uuid('Invalid replacement status id').optional(),
});

export class DeleteStatusDto extends createZodDto(DeleteStatusSchema) {}
