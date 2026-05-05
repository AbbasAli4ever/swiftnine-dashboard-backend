import { AttachmentDto } from '../../attachments/dto/attachment.dto';
export declare class ChatUserSummaryDto {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
}
export declare class ChatReactionDto {
    id: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt: Date;
    user: ChatUserSummaryDto;
}
export declare class ChatReplyPreviewDto {
    id: string;
    senderId: string | null;
    kind: 'USER' | 'SYSTEM';
    plaintext: string;
    deletedAt?: Date | null;
    sender?: ChatUserSummaryDto | null;
}
export declare class ChatChannelSummaryDto {
    id: string;
    workspaceId: string;
    kind: 'CHANNEL' | 'DM';
    privacy: 'PUBLIC' | 'PRIVATE';
    name?: string | null;
}
export declare class ChatMessageResponseDto {
    id: string;
    channelId: string;
    senderId?: string | null;
    kind: 'USER' | 'SYSTEM';
    contentJson: Record<string, unknown>;
    plaintext: string;
    replyToMessageId?: string | null;
    isEdited: boolean;
    editedAt?: Date | null;
    isPinned: boolean;
    pinnedAt?: Date | null;
    pinnedById?: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    sender?: ChatUserSummaryDto | null;
    pinnedBy?: ChatUserSummaryDto | null;
    mentions: ChatUserSummaryDto[];
    reactions: ChatReactionDto[];
    attachments: AttachmentDto[];
    replyTo?: ChatReplyPreviewDto | null;
    channel: ChatChannelSummaryDto;
}
export declare class ChatMessageListResponseDto {
    items: ChatMessageResponseDto[];
    nextCursor?: string | null;
}
export declare class ChatReadStateResponseDto {
    channelId: string;
    userId: string;
    lastReadMessageId: string;
    unreadCount: number;
    readAt: Date;
}
export declare class ChatMuteStateResponseDto {
    channelId: string;
    userId: string;
    isMuted: boolean;
}
export declare class ChatChannelMemberDto {
    id: string;
    userId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    isMuted: boolean;
    unreadCount: number;
    lastReadMessageId?: string | null;
    joinedAt: Date;
    user: ChatUserSummaryDto;
}
export declare class ChatChannelResponseDto {
    id: string;
    workspaceId: string;
    kind: 'CHANNEL' | 'DM';
    privacy: 'PUBLIC' | 'PRIVATE';
    name?: string | null;
    description?: string | null;
    projectId?: string | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    isMuted: boolean;
    unreadCount: number;
    lastReadMessageId?: string | null;
    members: ChatChannelMemberDto[];
}
