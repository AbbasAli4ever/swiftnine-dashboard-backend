import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { HttpLoggerMiddleware } from '@app/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectModule } from './project/project.module';
import { StatusModule } from './status/status.module';
import { TaskListModule } from './task-list/task-list.module';
import { TagModule } from './tag/tag.module';
import { TaskModule } from './task/task.module';
import { TimeEntryModule } from './time-entry/time-entry.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { ActivityModule } from './activity/activity.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    AttachmentsModule,
    ProjectModule,
    StatusModule,
    TaskListModule,
    TagModule,
    TaskModule,
    TimeEntryModule,
    ActivityModule,
    CommentsModule,
    ChannelsModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env['LOG_LEVEL'] === 'full') {
      consumer.apply(HttpLoggerMiddleware).forRoutes('*path');
    }
  }
}
