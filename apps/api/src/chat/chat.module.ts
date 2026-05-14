import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { AttachmentsModule } from '../attachments/attachments.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PresenceModule } from '../presence/presence.module';
import { RealtimeMetricsModule } from '../realtime/realtime-metrics.module';
import { ProjectSecurityModule } from '../project-security/project-security.module';
import { ChatController } from './chat.controller';
import { ChatFanoutService } from './chat-fanout.service';
import { ChatGateway } from './chat.gateway';
import { ChatRateLimitService } from './chat-rate-limit.service';
import { ChatService } from './chat.service';
import { ChatSystemService } from './chat-system.service';

@Module({
  imports: [
    AuthModule,
    NotificationsModule,
    AttachmentsModule,
    PresenceModule,
    RealtimeMetricsModule,
    ProjectSecurityModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatRateLimitService,
    ChatSystemService,
    ChatFanoutService,
    ChatService,
  ],
  exports: [ChatSystemService, ChatService],
})
export class ChatModule {}
