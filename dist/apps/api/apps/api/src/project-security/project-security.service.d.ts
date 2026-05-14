import { PrismaService } from "../../../../libs/database/src";
import type { Role } from "../../../../libs/database/src/generated/prisma/client";
import { type ProjectSecurityProject } from './project-security.constants';
import { ProjectUnlockService } from './project-unlock.service';
export declare class ProjectSecurityService {
    private readonly prisma;
    private readonly unlocks;
    constructor(prisma: PrismaService, unlocks: ProjectUnlockService);
    findProjectOrThrow(workspaceId: string, projectId: string): Promise<ProjectSecurityProject>;
    isProjectLocked(project: Pick<ProjectSecurityProject, 'passwordHash'>): boolean;
    canManagePassword(project: Pick<ProjectSecurityProject, 'createdBy'>, actorUserId: string, actorRole: Role): boolean;
    assertPasswordManager(workspaceId: string, projectId: string, actorUserId: string, actorRole: Role): Promise<ProjectSecurityProject>;
    getLockStatus(workspaceId: string, projectId: string, userId: string, now?: Date): Promise<{
        projectId: string;
        isLocked: boolean;
        isUnlocked: boolean;
        unlockedUntil: Date | null;
        passwordUpdatedAt: Date | null;
    }>;
    assertUnlocked(workspaceId: string, projectId: string, userId: string, now?: Date): Promise<ProjectSecurityProject>;
    activeUnlockedProjectIds(projectIds: string[], userId: string, now?: Date): Promise<Set<string>>;
    activeUnlockedWorkspaceProjectIds(workspaceId: string, userId: string, now?: Date): Promise<Set<string>>;
}
