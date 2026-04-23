import { ApiProperty } from '@nestjs/swagger';

export class MemberDetailResponseDto {
  @ApiProperty({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  id!: string;

  @ApiProperty({ example: '7f9c4f04-1a2b-4d0a-a3cb-864d53f92abc' })
  workspaceMemberId!: string;

  @ApiProperty({ example: 'Shoaib Ahmed' })
  fullName!: string;

  @ApiProperty({ example: 'shoaib@example.com' })
  email!: string;

  @ApiProperty({ example: 'MEMBER', enum: ['OWNER', 'MEMBER'] })
  role!: 'OWNER' | 'MEMBER';

  @ApiProperty({ example: 'https://cdn.example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: 'blue', nullable: true })
  avatarColor!: string | null;

  @ApiProperty({ example: 'Lead Backend Engineer', nullable: true })
  designation!: string | null;

  @ApiProperty({ example: 'I like to build distributed systems.', nullable: true })
  bio!: string | null;

  @ApiProperty({ example: true })
  isOnline!: boolean;

  @ApiProperty({ example: '2026-04-13T16:20:59.000Z', format: 'date-time', nullable: true })
  lastActive!: Date | null;

  @ApiProperty({ example: 'Asia/Karachi', nullable: true })
  timezone!: string | null;

  @ApiProperty({ example: {}, nullable: true })
  notificationPreferences!: Record<string, unknown> | null;

  @ApiProperty({ example: 'Shoaib Ahmed', nullable: true })
  invitedBy!: string | null;

  @ApiProperty({ example: '2026-04-10T12:35:41.000Z', format: 'date-time', nullable: true })
  invitedOn!: Date | null;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'], nullable: true })
  inviteStatus!: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | null;

  @ApiProperty({ example: '2026-04-13T16:20:59.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-13T16:20:59.000Z', format: 'date-time' })
  updatedAt!: Date;
}
