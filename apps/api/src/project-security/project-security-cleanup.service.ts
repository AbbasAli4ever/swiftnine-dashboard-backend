import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PROJECT_SECURITY_CLEANUP_INTERVAL_MS } from './project-security.constants';
import { ProjectResetService } from './project-reset.service';
import { ProjectUnlockService } from './project-unlock.service';

@Injectable()
export class ProjectSecurityCleanupService implements OnModuleDestroy {
  private readonly logger = new Logger(ProjectSecurityCleanupService.name);
  private cleanupWatcher?: NodeJS.Timeout;

  constructor(
    private readonly unlocks: ProjectUnlockService,
    private readonly resets: ProjectResetService,
  ) {
    this.cleanupWatcher = setInterval(() => {
      this.cleanupExpiredRecords().catch((err) =>
        this.logger.debug('Project security cleanup error', err as any),
      );
    }, PROJECT_SECURITY_CLEANUP_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.cleanupWatcher) clearInterval(this.cleanupWatcher);
  }

  async cleanupExpiredRecords(now = new Date()) {
    const [unlockSessions, unlockAttempts, resetTokens] = await Promise.all([
      this.unlocks.pruneExpiredUnlockSessions(now),
      this.unlocks.pruneExpiredFailedAttempts(now),
      this.resets.pruneExpiredResetTokens(now),
    ]);

    if (unlockSessions || unlockAttempts || resetTokens) {
      this.logger.log(
        `Cleaned project security records: unlockSessions=${unlockSessions}, unlockAttempts=${unlockAttempts}, resetTokens=${resetTokens}`,
      );
    }

    return { unlockSessions, unlockAttempts, resetTokens };
  }
}
