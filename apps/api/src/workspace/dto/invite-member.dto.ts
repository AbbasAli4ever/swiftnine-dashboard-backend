import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// An invite carries a workspace role only. There is deliberately no
// accountingRole field: accounting access is granted after the invite is
// accepted, via PUT /organizations/members/:id/accounting-role, which only a
// platform admin can call. Keeping it off this DTO means a workspace owner
// cannot grant accounting access by inviting someone.
//
// role is MANAGER or MEMBER only — never OWNER. OWNER is set once, at
// workspace creation, and is never granted through an invite; this is what
// keeps a workspace from ending up with more than one. (MANAGER itself
// grants no additional permissions yet — that's a separate, later change.)
const InviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['MANAGER', 'MEMBER']).default('MEMBER'),
});

export class InviteMemberDto extends createZodDto(InviteMemberSchema) {}
