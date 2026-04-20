import { WorkspaceService } from './workspace.service';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { ChangeMemberRoleDto } from './dto/change-member-role.dto';
import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.service';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class OrganizationsController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    removeMember(req: AuthenticatedRequest, dto: RemoveMemberDto): Promise<import("@app/common").ApiResponse<null>>;
    changeMemberRole(req: AuthenticatedRequest, memberId: string, dto: ChangeMemberRoleDto): Promise<import("@app/common").ApiResponse<null>>;
}
export {};
