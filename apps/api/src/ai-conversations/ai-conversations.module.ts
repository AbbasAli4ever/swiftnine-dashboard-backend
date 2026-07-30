import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AiTierModule } from '../ai-tier/ai-tier.module';
import { AiConversationsController } from './ai-conversations.controller';
import { AiConversationsService } from './ai-conversations.service';
import { AiCompletionsService } from './ai-completions.service';
import { ChatContextBuilder } from './chat-context.builder';

@Module({
  imports: [CommonModule, AuthModule, WorkspaceModule, AiTierModule],
  controllers: [AiConversationsController],
  providers: [AiConversationsService, AiCompletionsService, ChatContextBuilder],
  exports: [AiConversationsService],
})
export class AiConversationsModule {}
