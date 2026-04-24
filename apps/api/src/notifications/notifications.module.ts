import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsSseService } from './sse.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsSseService],
  exports: [NotificationsService, NotificationsSseService],
})
export class NotificationsModule {}
