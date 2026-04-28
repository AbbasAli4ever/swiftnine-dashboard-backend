import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AddMemberSchema = z.object({
  userId: z.string().uuid('Invalid user id'),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});

export class AddMemberDto extends createZodDto(AddMemberSchema) {}
