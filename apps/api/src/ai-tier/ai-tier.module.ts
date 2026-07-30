import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AiTierController } from './ai-tier.controller';
import {
  TokenAllowanceController,
  TokenCostQuoteController,
} from './token-allowance.controller';
import { AiTierService } from './ai-tier.service';
import { ModelResolverService } from './model-resolver.service';
import { OpenAiClientProvider } from './openai-client.provider';
import { TokenCounterService } from './token-counter.service';
import { TokenQuotaService } from './token-quota.service';

@Module({
  imports: [CommonModule, AuthModule, RolesModule, WorkspaceModule],
  controllers: [AiTierController, TokenAllowanceController, TokenCostQuoteController],
  providers: [
    AiTierService,
    ModelResolverService,
    OpenAiClientProvider,
    TokenCounterService,
    TokenQuotaService,
  ],
  exports: [
    AiTierService,
    ModelResolverService,
    OpenAiClientProvider,
    TokenCounterService,
    TokenQuotaService,
  ],
})
export class AiTierModule {}
