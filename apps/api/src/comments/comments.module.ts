import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SseService } from './sse.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ActivityModule, NotificationsModule],
  controllers: [CommentsController],
  providers: [CommentsService, SseService],
  exports: [CommentsService],
})
export class CommentsModule {}
