import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    create(req: WorkspaceRequest, dto: CreateChannelDto): Promise<ApiRes<any>>;
}
