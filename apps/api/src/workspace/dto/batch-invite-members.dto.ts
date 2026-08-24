import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// No accountingRole here, for the same reason as InviteMemberDto — accounting
// access is granted per member after acceptance by a platform admin, never
// attached to an invite. This mattered most on the batch route, where one
// request could otherwise have granted accounting access to 50 people at once.
const BatchInviteMembersSchema = z.object({
  emails: z
    .array(z.string().email('Invalid email address'))
    .min(1, 'At least one email is required')
    .max(50, 'You can invite at most 50 emails per request'),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});

export class BatchInviteMembersDto extends createZodDto(BatchInviteMembersSchema) {}

export class BatchInviteMemberResultDto {
  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiProperty({ example: 'invited', enum: ['invited', 'already_member', 'failed'] })
  status!: 'invited' | 'already_member' | 'failed';

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}

export class BatchInviteSummaryDto {
  @ApiProperty({ example: 3 })
  total!: number;

  @ApiProperty({ example: 2 })
  invited!: number;

  @ApiProperty({ example: 1 })
  alreadyMember!: number;

  @ApiProperty({ example: 0 })
  failed!: number;
}

export class BatchInviteResponseDto {
  @ApiProperty({ type: [BatchInviteMemberResultDto] })
  results!: BatchInviteMemberResultDto[];

  @ApiProperty({ type: BatchInviteSummaryDto })
  summary!: BatchInviteSummaryDto;
}
