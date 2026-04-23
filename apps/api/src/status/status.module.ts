import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [WorkspaceModule, RolesModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
