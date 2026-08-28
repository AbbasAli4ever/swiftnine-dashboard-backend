import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const BatchInviteProjectMembersSchema = z.object({
  userIds: z
    .array(z.string().uuid('Invalid user id'))
    .min(1, 'At least one user id is required')
    .max(50, 'You can invite at most 50 users per request'),
});

export class BatchInviteProjectMembersDto extends createZodDto(
  BatchInviteProjectMembersSchema,
) {}

export class BatchInviteProjectMemberResultDto {
  @ApiProperty({ example: '6a1f4e9a-...' })
  userId!: string;

  @ApiProperty({
    example: 'invited',
    enum: ['invited', 'already_member', 'failed'],
  })
  status!: 'invited' | 'already_member' | 'failed';

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}

export class BatchInviteProjectMembersSummaryDto {
  @ApiProperty({ example: 3 })
  total!: number;

  @ApiProperty({ example: 2 })
  invited!: number;

  @ApiProperty({ example: 1 })
  alreadyMember!: number;

  @ApiProperty({ example: 0 })
  failed!: number;
}

export class BatchInviteProjectMembersResponseDto {
  @ApiProperty({ type: [BatchInviteProjectMemberResultDto] })
  results!: BatchInviteProjectMemberResultDto[];

  @ApiProperty({ type: BatchInviteProjectMembersSummaryDto })
  summary!: BatchInviteProjectMembersSummaryDto;
}
