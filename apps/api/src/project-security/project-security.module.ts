import { Module } from '@nestjs/common';
import { ProjectAccessResolverService } from './project-access-resolver.service';
import { ProjectSecurityService } from './project-security.service';
import { ProjectUnlockedGuard } from './guards/project-unlocked.guard';

@Module({
  providers: [
    ProjectAccessResolverService,
    ProjectSecurityService,
    ProjectUnlockedGuard,
  ],
  exports: [
    ProjectAccessResolverService,
    ProjectSecurityService,
    ProjectUnlockedGuard,
  ],
})
export class ProjectSecurityModule {}
