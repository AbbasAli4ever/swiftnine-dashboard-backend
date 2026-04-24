import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskListTasksController } from './task-list-tasks.controller';
import { TaskProjectTasksController } from './task-project-tasks.controller';
import { ActivityModule } from '../activity/activity.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ActivityModule, NotificationsModule],
  controllers: [TaskController, TaskListTasksController, TaskProjectTasksController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
