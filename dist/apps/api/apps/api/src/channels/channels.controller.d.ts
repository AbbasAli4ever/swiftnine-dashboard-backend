import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';
import { AddChannelMemberDto, BulkAddChannelMembersDto } from './dto/channel-member.dto';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    create(req: WorkspaceRequest, dto: CreateChannelDto): Promise<ApiRes<any>>;
    addMember(req: WorkspaceRequest, channelId: string, dto: AddChannelMemberDto): Promise<ApiRes<any>>;
    addMembersBulk(req: WorkspaceRequest, channelId: string, dto: BulkAddChannelMembersDto): Promise<ApiRes<any>>;
    removeMember(req: WorkspaceRequest, channelId: string, memberId: string): Promise<ApiRes<any>>;
}
