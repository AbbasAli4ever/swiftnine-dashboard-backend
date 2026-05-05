export declare class ChannelUserSummaryDto {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
}
export declare class ChannelMemberResponseDto {
    id: string;
    channelId: string;
    userId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    isMuted: boolean;
    unreadCount: number;
    lastReadMessageId?: string | null;
    joinedAt: Date;
    createdAt: Date;
    user: ChannelUserSummaryDto;
}
export declare class ChannelProjectSummaryDto {
    id: string;
    workspaceId: string;
    name: string | null;
    description?: string | null;
    color: string;
    icon?: string | null;
    taskIdPrefix: string;
    taskCounter: number;
    isArchived: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
export declare class ChannelResponseDto {
    id: string;
    workspaceId: string;
    projectId?: string | null;
    name: string;
    description?: string | null;
    privacy: 'PUBLIC' | 'PRIVATE';
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    members: ChannelMemberResponseDto[];
    isMember: boolean;
    isMuted: boolean;
    unreadCount: number;
    lastReadMessageId?: string | null;
    viewerMembership?: ChannelMemberResponseDto | null;
    project?: ChannelProjectSummaryDto | null;
}
