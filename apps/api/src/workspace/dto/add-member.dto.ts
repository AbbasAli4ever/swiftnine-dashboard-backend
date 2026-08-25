import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// role is MANAGER or MEMBER only — never OWNER, same reasoning as
// InviteMemberDto: OWNER is set once, at workspace creation, and never
// granted again through any path.
const AddMemberSchema = z.object({
  userId: z.string().uuid('Invalid user id'),
  role: z.enum(['MANAGER', 'MEMBER']).default('MEMBER'),
});

export class AddMemberDto extends createZodDto(AddMemberSchema) {}
