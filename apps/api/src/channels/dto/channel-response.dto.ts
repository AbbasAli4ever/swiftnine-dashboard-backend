import { ApiProperty } from '@nestjs/swagger';

export class ChannelUserSummaryDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  fullName!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  avatarUrl?: string | null;
}

export class ChannelMemberResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  channelId!: string;

  @ApiProperty({ type: String })
  userId!: string;

  @ApiProperty({ enum: ['OWNER', 'ADMIN', 'MEMBER'] })
  role!: 'OWNER' | 'ADMIN' | 'MEMBER';

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: ChannelUserSummaryDto })
  user!: ChannelUserSummaryDto;
}

export class ChannelProjectSummaryDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  workspaceId!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ type: String })
  color!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  icon?: string | null;

  @ApiProperty({ type: String })
  taskIdPrefix!: string;

  @ApiProperty({ type: Number })
  taskCounter!: number;

  @ApiProperty({ type: Boolean })
  isArchived!: boolean;

  @ApiProperty({ type: String })
  createdBy!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', required: false, nullable: true })
  deletedAt?: Date | null;
}

export class ChannelResponseDto {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  workspaceId!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  projectId?: string | null;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE'] })
  privacy!: 'PUBLIC' | 'PRIVATE';

  @ApiProperty({ type: String })
  createdBy!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;

  @ApiProperty({ type: ChannelMemberResponseDto, isArray: true })
  members!: ChannelMemberResponseDto[];

  @ApiProperty({ type: ChannelProjectSummaryDto, required: false, nullable: true })
  project?: ChannelProjectSummaryDto | null;
}
