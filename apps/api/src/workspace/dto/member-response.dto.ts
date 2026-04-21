import { ApiProperty } from '@nestjs/swagger';

export class MemberResponseDto {
  @ApiProperty({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  id!: string;

  @ApiProperty({ example: 'Shoaib Ahmed' })
  fullName!: string;

  @ApiProperty({ example: 'shoaib@example.com' })
  email!: string;

  @ApiProperty({ example: 'MEMBER', enum: ['OWNER', 'MEMBER'] })
  role!: 'OWNER' | 'MEMBER';

  @ApiProperty({ example: '2026-04-13T16:20:59.000Z', format: 'date-time', nullable: true })
  lastActive!: Date | null;

  @ApiProperty({ example: 'Shoaib Ahmed', nullable: true })
  invitedBy!: string | null;

  @ApiProperty({ example: '2026-04-10T12:35:41.000Z', format: 'date-time', nullable: true })
  invitedOn!: Date | null;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'], nullable: true })
  inviteStatus!: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | null;
}
