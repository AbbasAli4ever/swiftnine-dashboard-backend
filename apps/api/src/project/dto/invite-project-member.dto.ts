import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const InviteProjectMemberSchema = z.object({
  userId: z.string().uuid('userId must be a valid UUID'),
});

export class InviteProjectMemberDto extends createZodDto(
  InviteProjectMemberSchema,
) {}
