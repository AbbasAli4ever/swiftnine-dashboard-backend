import { PrismaService } from '@app/database';
import type { CreateChannelDto } from './dto/create-channel.dto';
import type { UpdateChannelDto } from './dto/update-channel.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ChannelsService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    private channelInclude;
    listByWorkspace(workspaceId: string, userId: string): Promise<runtime.Types.Public.PrismaPromise<T>>;
    listByProject(workspaceId: string, projectId: string, userId: string): Promise<runtime.Types.Public.PrismaPromise<T>>;
    create(workspaceId: string, userId: string, dto: CreateChannelDto): Promise<runtime.Types.Utils.JsPromise<R>>;
    updateChannel(workspaceId: string, channelId: string, callerUserId: string, dto: UpdateChannelDto): Promise<runtime.Types.Result.GetResult<import("@app/database/generated/prisma/models").$ChannelPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    private mapRoleInput;
    addChannelMember(workspaceId: string, channelId: string, callerUserId: string, userId: string, roleInput: string): Promise<any>;
    addChannelMembersBulk(workspaceId: string, channelId: string, callerUserId: string, members: Array<{
        userId: string;
        role: string;
    }>): Promise<any[]>;
    removeChannelMember(workspaceId: string, channelId: string, callerUserId: string, channelMemberId: string): Promise<boolean>;
}
