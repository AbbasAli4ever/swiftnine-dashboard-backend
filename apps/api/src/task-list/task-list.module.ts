import { Module } from '@nestjs/common';
import { TaskListController } from './task-list.controller';
import { TaskListService } from './task-list.service';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  controllers: [TaskListController],
  providers: [TaskListService],
})
export class TaskListModule {}
