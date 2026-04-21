import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskListTasksController } from './task-list-tasks.controller';

@Module({
  controllers: [TaskController, TaskListTasksController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
