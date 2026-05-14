import { PrismaService } from "../../../../libs/database/src";
import { EmailService } from "../../../../libs/common/src";
import type { Role } from "../../../../libs/database/src/generated/prisma/client";
import { ProjectSecurityService } from './project-security.service';
import { ProjectResetService } from './project-reset.service';
import { ProjectRealtimeLockService } from './project-realtime-lock.service';
import { ProjectUnlockService } from './project-unlock.service';
export declare class ProjectPasswordService {
    private readonly prisma;
    private readonly security;
    private readonly unlocks;
    private readonly resets;
    private readonly realtimeLocks;
    private readonly email;
    constructor(prisma: PrismaService, security: ProjectSecurityService, unlocks: ProjectUnlockService, resets: ProjectResetService, realtimeLocks: ProjectRealtimeLockService, email: EmailService);
    assertPasswordFormat(password: string): void;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, passwordHash: string): Promise<boolean>;
    private projectPasswordActivityInput;
    setPassword(workspaceId: string, projectId: string, actorUserId: string, actorRole: Role, password: string): Promise<{
        id: string;
        workspaceId: string;
        passwordUpdatedAt: Date | null;
    }>;
    changePassword(workspaceId: string, projectId: string, actorUserId: string, actorRole: Role, currentPassword: string, newPassword: string): Promise<{
        id: string;
        workspaceId: string;
        passwordUpdatedAt: Date | null;
    }>;
    removePassword(workspaceId: string, projectId: string, actorUserId: string, actorRole: Role): Promise<void>;
    invalidateUnlockSessions(projectId: string): Promise<number>;
    unlockProject(workspaceId: string, projectId: string, userId: string, password: string, now?: Date): Promise<{
        projectId: string;
        isLocked: boolean;
        unlockedUntil: null;
    } | {
        projectId: string;
        isLocked: boolean;
        unlockedUntil: Date;
    }>;
    requestPasswordReset(workspaceId: string, projectId: string, actorUserId: string, actorRole: Role): Promise<void>;
    resetPasswordWithToken(projectId: string, token: string, newPassword: string, actorUserId?: string): Promise<{
        projectId: string;
        passwordUpdatedAt: Date;
    }>;
}
