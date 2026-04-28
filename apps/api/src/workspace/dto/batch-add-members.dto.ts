import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const BatchAddMembersSchema = z.object({
  userIds: z
    .array(z.string().uuid('Invalid user id'))
    .min(1, 'At least one user id is required')
    .max(50, 'You can add at most 50 users per request'),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});

export class BatchAddMembersDto extends createZodDto(BatchAddMembersSchema) {}

export class BatchAddMemberResultDto {
  @ApiProperty({ example: '6a1f4e9a-...' })
  userId!: string;

  @ApiProperty({ example: 'added', enum: ['added', 'already_member', 'failed'] })
  status!: 'added' | 'already_member' | 'failed';

  @ApiProperty({ example: null, nullable: true })
  message!: string | null;
}

export class BatchAddSummaryDto {
  @ApiProperty({ example: 3 })
  total!: number;

  @ApiProperty({ example: 2 })
  added!: number;

  @ApiProperty({ example: 1 })
  alreadyMember!: number;

  @ApiProperty({ example: 0 })
  failed!: number;
}

export class BatchAddResponseDto {
  @ApiProperty({ type: [BatchAddMemberResultDto] })
  results!: BatchAddMemberResultDto[];

  @ApiProperty({ type: BatchAddSummaryDto })
  summary!: BatchAddSummaryDto;
}
