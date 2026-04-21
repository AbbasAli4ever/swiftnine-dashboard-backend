import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AddAssigneesSchema = z.object({
  userIds: z.array(z.string().uuid('Invalid user ID')).min(1, 'At least one user ID is required'),
});

export class AddAssigneesDto extends createZodDto(AddAssigneesSchema) {}
