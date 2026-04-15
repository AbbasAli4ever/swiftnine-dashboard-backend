import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AcceptInviteSchema = z.object({
  token: z.string().uuid('Invalid invite token'),
});

export class AcceptInviteDto extends createZodDto(AcceptInviteSchema) {}
