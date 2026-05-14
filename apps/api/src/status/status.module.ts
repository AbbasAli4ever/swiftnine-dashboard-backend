import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { RolesModule } from '../roles/roles.module';
import { ProjectSecurityModule } from '../project-security/project-security.module';

@Module({
  imports: [WorkspaceModule, RolesModule, ProjectSecurityModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
