import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AiTierService } from './ai-tier.service';
import { ModelResolverService } from './model-resolver.service';
import { TokenQuotaService, type QuotaStatus } from './token-quota.service';
import { ResetTokenAllowanceDto, SetTokenAllowanceDto } from './dto/set-token-allowance.dto';

@ApiTags('ai-tier')
@ApiBearerAuth()
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
@Controller('workspaces/:workspaceId/members/:userId/token-allowance')
@UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
@Roles('OWNER')
export class TokenAllowanceController {
  constructor(
    private readonly tiers: AiTierService,
    private readonly quotas: TokenQuotaService,
    private readonly models: ModelResolverService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Read a member's weekly token allowance (OWNER only)" })
  @ApiParam({ name: 'userId', description: 'Member whose allowance is read' })
  async getAllowance(
    @Req() req: WorkspaceRequest,
    @Param('userId') userId: string,
  ): Promise<ApiRes<QuotaStatus>> {
    const tier = await this.tiers.getTier(req.workspaceContext.workspaceId, userId);
    const status = await this.quotas.getStatus(req.workspaceContext.workspaceId, userId, tier);
    return ok(status);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Assign or update a member's weekly token allowance (OWNER + secret)",
    description:
      'Consumption is carried forward — raising a limit does not reset usage. Use the reset endpoint for that.',
  })
  @ApiParam({ name: 'userId', description: 'Member whose allowance is set' })
  @ApiResponse({ status: 401, description: 'Secret key is invalid' })
  @ApiResponse({ status: 403, description: 'Not an owner, locked out, or no secret configured' })
  async setAllowance(
    @Req() req: WorkspaceRequest,
    @Param('userId') userId: string,
    @Body() dto: SetTokenAllowanceDto,
  ): Promise<ApiRes<QuotaStatus>> {
    // Reuses the tier-change secret machinery: lockout guard, bcrypt compare,
    // and failure-counter reset all live in one place.
    await this.tiers.authoriseWithSecret(req.user.id, dto.secret);

    const status = await this.quotas.setLimit(
      req.workspaceContext.workspaceId,
      userId,
      dto.tokenLimit,
      req.user.id,
    );
    return ok(status, 'Token allowance updated');
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Reset a member's consumption for the current week (OWNER + secret)",
    description: 'Zeroes usage and clears any standard-model fallback opt-in. The limit is unchanged.',
  })
  @ApiParam({ name: 'userId', description: 'Member whose usage is reset' })
  async resetAllowance(
    @Req() req: WorkspaceRequest,
    @Param('userId') userId: string,
    @Body() dto: ResetTokenAllowanceDto,
  ): Promise<ApiRes<QuotaStatus>> {
    await this.tiers.authoriseWithSecret(req.user.id, dto.secret);

    const status = await this.quotas.resetNow(
      req.workspaceContext.workspaceId,
      userId,
      req.user.id,
    );
    return ok(status, 'Token usage reset');
  }
}

@ApiTags('ai-tier')
@ApiBearerAuth()
@Controller('ai-tier')
@UseGuards(JwtAuthGuard)
export class TokenCostQuoteController {
  constructor(private readonly models: ModelResolverService) {}

  @Get('token-cost-quote')
  @ApiOperation({
    summary: 'Cost bounds for a token allowance, for the assignment form',
    description:
      'A single figure is impossible: the same tokens cost the input rate if spent on prompts and the output rate if spent on replies — roughly a 6x spread on the premium model. Surface maxCostUsd as the headline with the range beneath.',
  })
  @ApiQuery({ name: 'tokens', example: 1_000_000 })
  async quote(
    @Query('tokens') tokensRaw: string,
  ): Promise<ApiRes<{ tokens: number; model: string; minCostUsd: number; maxCostUsd: number }>> {
    const tokens = Number.parseInt(tokensRaw, 10);
    const model = this.models.getPremiumModel();
    const quote =
      Number.isFinite(tokens) && tokens > 0 ? this.models.quoteTokenCost(model, tokens) : null;

    return ok({
      tokens: Number.isFinite(tokens) ? tokens : 0,
      model,
      minCostUsd: quote?.minCostUsd ?? 0,
      maxCostUsd: quote?.maxCostUsd ?? 0,
    });
  }
}
