import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatModule } from '../chat/chat.module';
import { ProjectSecurityModule } from '../project-security/project-security.module';
import { JoinRequestsController } from './join-requests/join-requests.controller';
import { JoinRequestsService } from './join-requests/join-requests.service';

@Module({
  imports: [NotificationsModule, ChatModule, ProjectSecurityModule],
  controllers: [ChannelsController, JoinRequestsController],
  providers: [ChannelsService, JoinRequestsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
