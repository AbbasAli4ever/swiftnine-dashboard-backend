import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const InviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
  // Independent of role — grants accounting feature access on acceptance.
  // Omit or send null for no accounting access.
  accountingRole: z.enum(['ACCOUNTANT', 'CEO']).nullable().default(null),
});

export class InviteMemberDto extends createZodDto(InviteMemberSchema) {}
