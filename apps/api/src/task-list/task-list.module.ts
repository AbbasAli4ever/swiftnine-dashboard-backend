import { Module } from '@nestjs/common';
import { TaskListController } from './task-list.controller';
import { TaskListService } from './task-list.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ProjectSecurityModule } from '../project-security/project-security.module';

@Module({
  imports: [WorkspaceModule, ProjectSecurityModule],
  controllers: [TaskListController],
  providers: [TaskListService],
})
export class TaskListModule {}
