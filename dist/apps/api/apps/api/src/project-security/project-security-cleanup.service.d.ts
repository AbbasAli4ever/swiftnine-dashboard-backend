import { OnModuleDestroy } from '@nestjs/common';
import { ProjectResetService } from './project-reset.service';
import { ProjectUnlockService } from './project-unlock.service';
export declare class ProjectSecurityCleanupService implements OnModuleDestroy {
    private readonly unlocks;
    private readonly resets;
    private readonly logger;
    private cleanupWatcher?;
    constructor(unlocks: ProjectUnlockService, resets: ProjectResetService);
    onModuleDestroy(): void;
    cleanupExpiredRecords(now?: Date): Promise<{
        unlockSessions: number;
        unlockAttempts: number;
        resetTokens: number;
    }>;
}
