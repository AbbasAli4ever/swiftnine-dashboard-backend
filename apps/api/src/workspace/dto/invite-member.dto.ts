import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// An invite carries a workspace role only. There is deliberately no
// accountingRole field: accounting access is granted after the invite is
// accepted, via PUT /organizations/members/:id/accounting-role, which only a
// platform admin can call. Keeping it off this DTO means a workspace owner
// cannot grant accounting access by inviting someone.
const InviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});

export class InviteMemberDto extends createZodDto(InviteMemberSchema) {}
