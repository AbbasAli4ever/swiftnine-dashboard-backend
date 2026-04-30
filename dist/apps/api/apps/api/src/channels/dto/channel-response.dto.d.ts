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
    createdAt: Date;
    user: ChannelUserSummaryDto;
}
export declare class ChannelProjectSummaryDto {
    id: string;
    workspaceId: string;
    name: string;
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
    project?: ChannelProjectSummaryDto | null;
}
