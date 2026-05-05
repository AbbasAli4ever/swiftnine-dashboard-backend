import { Module } from '@nestjs/common';
import { ChatSystemService } from './chat-system.service';

@Module({
  providers: [ChatSystemService],
  exports: [ChatSystemService],
})
export class ChatModule {}
