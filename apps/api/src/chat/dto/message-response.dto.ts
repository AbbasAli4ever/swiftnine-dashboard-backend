import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttachmentDto } from '../../attachments/dto/attachment.dto';

export class ChatUserSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl?: string | null;
}

export class ChatReactionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  messageId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  emoji!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: ChatUserSummaryDto })
  user!: ChatUserSummaryDto;
}

export class ChatReplyPreviewDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ nullable: true })
  senderId!: string | null;

  @ApiProperty({ enum: ['USER', 'SYSTEM'] })
  kind!: 'USER' | 'SYSTEM';

  @ApiProperty()
  plaintext!: string;

  @ApiPropertyOptional({ nullable: true })
  deletedAt?: Date | null;

  @ApiPropertyOptional({ type: ChatUserSummaryDto, nullable: true })
  sender?: ChatUserSummaryDto | null;
}

export class ChatChannelSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  workspaceId!: string;

  @ApiProperty({ enum: ['CHANNEL', 'DM'] })
  kind!: 'CHANNEL' | 'DM';

  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE'] })
  privacy!: 'PUBLIC' | 'PRIVATE';

  @ApiPropertyOptional({ nullable: true })
  name?: string | null;
}

export class ChatMessageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  channelId!: string;

  @ApiPropertyOptional({ nullable: true })
  senderId?: string | null;

  @ApiProperty({ enum: ['USER', 'SYSTEM'] })
  kind!: 'USER' | 'SYSTEM';

  @ApiProperty({ type: Object })
  contentJson!: Record<string, unknown>;

  @ApiProperty()
  plaintext!: string;

  @ApiPropertyOptional({ nullable: true })
  replyToMessageId?: string | null;

  @ApiProperty()
  isEdited!: boolean;

  @ApiPropertyOptional({ nullable: true })
  editedAt?: Date | null;

  @ApiProperty()
  isPinned!: boolean;

  @ApiPropertyOptional({ nullable: true })
  pinnedAt?: Date | null;

  @ApiPropertyOptional({ nullable: true })
  pinnedById?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt?: Date | null;

  @ApiPropertyOptional({ type: ChatUserSummaryDto, nullable: true })
  sender?: ChatUserSummaryDto | null;

  @ApiPropertyOptional({ type: ChatUserSummaryDto, nullable: true })
  pinnedBy?: ChatUserSummaryDto | null;

  @ApiProperty({ type: ChatUserSummaryDto, isArray: true })
  mentions!: ChatUserSummaryDto[];

  @ApiProperty({ type: ChatReactionDto, isArray: true })
  reactions!: ChatReactionDto[];

  @ApiProperty({ type: AttachmentDto, isArray: true })
  attachments!: AttachmentDto[];

  @ApiPropertyOptional({ type: ChatReplyPreviewDto, nullable: true })
  replyTo?: ChatReplyPreviewDto | null;

  @ApiProperty({ type: ChatChannelSummaryDto })
  channel!: ChatChannelSummaryDto;
}

export class ChatMessageListResponseDto {
  @ApiProperty({ type: ChatMessageResponseDto, isArray: true })
  items!: ChatMessageResponseDto[];

  @ApiPropertyOptional({ nullable: true })
  nextCursor?: string | null;
}

export class ChatMessageContextResponseDto {
  @ApiProperty({ type: ChatMessageResponseDto, isArray: true })
  items!: ChatMessageResponseDto[];

  @ApiProperty()
  anchorMessageId!: string;

  @ApiProperty()
  hasBefore!: boolean;

  @ApiProperty()
  hasAfter!: boolean;
}

export class ChatReadStateResponseDto {
  @ApiProperty()
  channelId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  lastReadMessageId!: string;

  @ApiProperty()
  unreadCount!: number;

  @ApiProperty()
  readAt!: Date;
}

export class ChatMuteStateResponseDto {
  @ApiProperty()
  channelId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  isMuted!: boolean;
}

export class ChatChannelMemberDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ['OWNER', 'ADMIN', 'MEMBER'] })
  role!: 'OWNER' | 'ADMIN' | 'MEMBER';

  @ApiProperty()
  isMuted!: boolean;

  @ApiProperty()
  unreadCount!: number;

  @ApiPropertyOptional({ nullable: true })
  lastReadMessageId?: string | null;

  @ApiProperty()
  joinedAt!: Date;

  @ApiProperty({ type: ChatUserSummaryDto })
  user!: ChatUserSummaryDto;
}

export class ChatChannelResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  workspaceId!: string;

  @ApiProperty({ enum: ['CHANNEL', 'DM'] })
  kind!: 'CHANNEL' | 'DM';

  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE'] })
  privacy!: 'PUBLIC' | 'PRIVATE';

  @ApiPropertyOptional({ nullable: true })
  name?: string | null;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ nullable: true })
  projectId?: string | null;

  @ApiProperty()
  createdBy!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  isMuted!: boolean;

  @ApiProperty()
  unreadCount!: number;

  @ApiPropertyOptional({ nullable: true })
  lastReadMessageId?: string | null;

  @ApiProperty({ type: ChatChannelMemberDto, isArray: true })
  members!: ChatChannelMemberDto[];
}
