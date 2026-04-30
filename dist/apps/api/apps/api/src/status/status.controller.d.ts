import { type ApiResponse as ApiRes } from '@app/common';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { StatusService, type GroupedStatuses, type StatusData } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { DeleteStatusDto } from './dto/delete-status.dto';
import { ReorderStatusesDto } from './dto/reorder-statuses.dto';
import { DefaultStatusesDto } from './dto/default-statuses.dto';
import { ListStatusesDto } from './dto/list-statuses.dto';
export declare class StatusController {
    private readonly statusService;
    constructor(statusService: StatusService);
    create(req: WorkspaceRequest, dto: CreateStatusDto): Promise<ApiRes<StatusData>>;
    findAll(req: WorkspaceRequest, dto: ListStatusesDto): Promise<ApiRes<GroupedStatuses>>;
    reorder(req: WorkspaceRequest, dto: ReorderStatusesDto): Promise<ApiRes<GroupedStatuses>>;
    applyDefaultTemplate(req: WorkspaceRequest, dto: DefaultStatusesDto): Promise<ApiRes<GroupedStatuses>>;
    findOne(req: WorkspaceRequest, id: string): Promise<ApiRes<StatusData>>;
    update(req: WorkspaceRequest, id: string, dto: UpdateStatusDto): Promise<ApiRes<StatusData>>;
    remove(req: WorkspaceRequest, id: string, dto: DeleteStatusDto): Promise<ApiRes<null>>;
}
