import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ProjectPasswordService } from '../project-security/project-password.service';
import { ProjectSecurityService } from '../project-security/project-security.service';
import { ChangeProjectPasswordDto } from '../project-security/dto/change-project-password.dto';
import { ConfirmProjectPasswordResetDto } from '../project-security/dto/confirm-project-password-reset.dto';
import { SetProjectPasswordDto } from '../project-security/dto/set-project-password.dto';
import { UnlockProjectDto } from '../project-security/dto/unlock-project.dto';
export declare class ProjectPasswordController {
    private readonly projectPasswords;
    private readonly projectSecurity;
    constructor(projectPasswords: ProjectPasswordService, projectSecurity: ProjectSecurityService);
    setPassword(req: WorkspaceRequest, projectId: string, dto: SetProjectPasswordDto): Promise<ApiRes<{
        id: string;
        workspaceId: string;
        passwordUpdatedAt: Date | null;
    }>>;
    changePassword(req: WorkspaceRequest, projectId: string, dto: ChangeProjectPasswordDto): Promise<ApiRes<{
        id: string;
        workspaceId: string;
        passwordUpdatedAt: Date | null;
    }>>;
    removePassword(req: WorkspaceRequest, projectId: string): Promise<ApiRes<null>>;
    unlock(req: WorkspaceRequest, projectId: string, dto: UnlockProjectDto): Promise<ApiRes<{
        projectId: string;
        isLocked: boolean;
        unlockedUntil: Date | null;
    }>>;
    lockStatus(req: WorkspaceRequest, projectId: string): Promise<ApiRes<{
        projectId: string;
        isLocked: boolean;
        isUnlocked: boolean;
        unlockedUntil: Date | null;
        passwordUpdatedAt: Date | null;
    }>>;
    requestReset(req: WorkspaceRequest, projectId: string): Promise<ApiRes<null>>;
    confirmReset(req: WorkspaceRequest, projectId: string, dto: ConfirmProjectPasswordResetDto): Promise<ApiRes<{
        projectId: string;
        passwordUpdatedAt: Date;
    }>>;
}
