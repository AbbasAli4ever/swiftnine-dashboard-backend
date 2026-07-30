import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AiTierModule } from '../ai-tier/ai-tier.module';
import { AiGenerationController } from './ai-generation.controller';
import { AiGenerationService } from './ai-generation.service';

@Module({
  imports: [CommonModule, AuthModule, WorkspaceModule, AiTierModule],
  controllers: [AiGenerationController],
  providers: [AiGenerationService],
  exports: [AiGenerationService],
})
export class AiGenerationModule {}
