import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { ProjectAccessResolverService } from './project-access-resolver.service';
import { ProjectPasswordService } from './project-password.service';
import { ProjectResetService } from './project-reset.service';
import { ProjectRealtimeLockService } from './project-realtime-lock.service';
import { ProjectSecurityCleanupService } from './project-security-cleanup.service';
import { ProjectSecurityService } from './project-security.service';
import { ProjectUnlockService } from './project-unlock.service';
import { ProjectUnlockedGuard } from './guards/project-unlocked.guard';

@Module({
  imports: [CommonModule],
  providers: [
    ProjectAccessResolverService,
    ProjectPasswordService,
    ProjectRealtimeLockService,
    ProjectResetService,
    ProjectSecurityCleanupService,
    ProjectSecurityService,
    ProjectUnlockService,
    ProjectUnlockedGuard,
  ],
  exports: [
    ProjectAccessResolverService,
    ProjectPasswordService,
    ProjectRealtimeLockService,
    ProjectResetService,
    ProjectSecurityCleanupService,
    ProjectSecurityService,
    ProjectUnlockService,
    ProjectUnlockedGuard,
  ],
})
export class ProjectSecurityModule {}
