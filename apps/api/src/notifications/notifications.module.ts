import { Module } from '@nestjs/common';
import { ProjectSecurityModule } from '../project-security/project-security.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsSseService } from './sse.service';

@Module({
  imports: [ProjectSecurityModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsSseService],
  exports: [NotificationsService, NotificationsSseService],
})
export class NotificationsModule {}
