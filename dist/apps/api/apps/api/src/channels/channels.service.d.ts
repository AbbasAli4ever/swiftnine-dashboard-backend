import { PrismaService } from "../../../../libs/database/src";
import type { CreateChannelDto } from './dto/create-channel.dto';
import { NotificationsService } from '../notifications/notifications.service';
import type { Role } from "../../../../libs/database/src/generated/prisma/client";
export declare class ChannelsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    create(workspaceId: string, userId: string, dto: CreateChannelDto): Promise<({
        project: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            createdBy: string;
            workspaceId: string;
            color: string;
            icon: string | null;
            taskIdPrefix: string;
            taskCounter: number;
            isArchived: boolean;
        } | null;
        members: ({
            user: {
                fullName: string;
                id: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: Role;
            channelId: string;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        workspaceId: string;
        projectId: string | null;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
    }) | null>;
    private mapRoleInput;
    addChannelMember(workspaceId: string, channelId: string, callerUserId: string, userId: string, roleInput: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: Role;
        channelId: string;
    }>;
    addChannelMembersBulk(workspaceId: string, channelId: string, callerUserId: string, members: Array<{
        userId: string;
        role: string;
    }>): Promise<any[]>;
    removeChannelMember(workspaceId: string, channelId: string, callerUserId: string, channelMemberId: string): Promise<boolean>;
}
