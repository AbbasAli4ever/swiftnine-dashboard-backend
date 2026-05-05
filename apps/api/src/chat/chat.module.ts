import { Module } from '@nestjs/common';
import { AttachmentsModule } from '../attachments/attachments.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatController } from './chat.controller';
import { ChatFanoutService } from './chat-fanout.service';
import { ChatService } from './chat.service';
import { ChatSystemService } from './chat-system.service';

@Module({
  imports: [NotificationsModule, AttachmentsModule],
  controllers: [ChatController],
  providers: [ChatSystemService, ChatFanoutService, ChatService],
  exports: [ChatSystemService, ChatService],
})
export class ChatModule {}
