import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type { WorkspaceRequest } from './workspace.types';
import type { AuthUser } from '../auth/auth.service';
import type { Request } from 'express';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceData } from './workspace.service';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    create(dto: CreateWorkspaceDto, req: AuthenticatedRequest): Promise<ApiRes<WorkspaceData>>;
    findAll(req: AuthenticatedRequest): Promise<ApiRes<WorkspaceData[]>>;
    findOne(req: WorkspaceRequest): Promise<ApiRes<WorkspaceData & {
        memberCount: number;
    }>>;
    update(req: WorkspaceRequest, dto: UpdateWorkspaceDto): Promise<ApiRes<WorkspaceData>>;
    remove(req: WorkspaceRequest): Promise<ApiRes<null>>;
}
export {};
