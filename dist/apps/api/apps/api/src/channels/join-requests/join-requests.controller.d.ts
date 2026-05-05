import { type ApiResponse as ApiRes } from "../../../../../libs/common/src";
import type { WorkspaceRequest } from '../../workspace/workspace.types';
import { DecideJoinRequestDto } from './dto/decide-join-request.dto';
import { JoinRequestsService } from './join-requests.service';
export declare class JoinRequestsController {
    private readonly joinRequestsService;
    constructor(joinRequestsService: JoinRequestsService);
    createRequest(req: WorkspaceRequest, channelId: string): Promise<ApiRes<any>>;
    listRequests(req: WorkspaceRequest, channelId: string, status?: string): Promise<ApiRes<any>>;
    getMyRequestStatus(req: WorkspaceRequest, channelId: string): Promise<ApiRes<any>>;
    decideRequest(req: WorkspaceRequest, channelId: string, requestId: string, dto: DecideJoinRequestDto): Promise<ApiRes<any>>;
}
