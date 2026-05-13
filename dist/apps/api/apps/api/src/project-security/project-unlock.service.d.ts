import { PrismaService } from "../../../../libs/database/src";
export declare class ProjectUnlockService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getActiveUnlockSession(projectId: string, userId: string, now?: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        projectId: string;
    } | null>;
    hasActiveUnlock(projectId: string, userId: string, now?: Date): Promise<boolean>;
    activeUnlockedProjectIds(projectIds: string[], userId: string, now?: Date): Promise<Set<string>>;
    activeUnlockedWorkspaceProjectIds(workspaceId: string, userId: string, now?: Date): Promise<Set<string>>;
    createUnlockSession(projectId: string, userId: string, now?: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        projectId: string;
    }>;
    invalidateUnlockSessions(projectId: string): Promise<number>;
    pruneExpiredUnlockSessions(now?: Date): Promise<number>;
    assertNotLockedOut(projectId: string, userId: string, now?: Date): Promise<void>;
    recordFailedAttempt(projectId: string, userId: string, now?: Date): Promise<{
        id: string;
        userId: string;
        projectId: string;
        failedCount: number;
        lockedUntil: Date | null;
        lastFailAt: Date | null;
    }>;
    clearFailedAttempts(projectId: string, userId: string): Promise<void>;
    pruneExpiredFailedAttempts(now?: Date): Promise<number>;
}
