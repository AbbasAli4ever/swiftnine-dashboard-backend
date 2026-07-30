import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import type { AiModelTier } from '@app/database/generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AiTierService, type TierChangeResult } from './ai-tier.service';
import { ChangeAiTierDto } from './dto/change-ai-tier.dto';

@ApiTags('ai-tier')
@Controller('workspaces/:workspaceId/members/:userId/ai-tier')
export class AiTierController {
  constructor(private readonly aiTierService: AiTierService) {}

  @Patch()
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Change a member's AI model tier (OWNER + secret key required)",
    description:
      'The workspace owner role gates visibility of this action; the secret key gates the action itself. Owners without the secret receive 401.',
  })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiParam({ name: 'workspaceId', description: 'Workspace containing the member' })
  @ApiParam({ name: 'userId', description: 'User whose tier is changing' })
  @ApiResponse({ status: 200, description: 'Tier updated' })
  @ApiResponse({ status: 401, description: 'Secret key is invalid' })
  @ApiResponse({ status: 403, description: 'Not an owner, locked out, or no secret configured' })
  @ApiResponse({ status: 404, description: 'Member not found in this workspace' })
  async changeTier(
    @Req() req: WorkspaceRequest,
    @Param('userId') userId: string,
    @Body() dto: ChangeAiTierDto,
  ): Promise<ApiRes<TierChangeResult>> {
    const result = await this.aiTierService.changeTier(
      req.user.id,
      req.workspaceContext.workspaceId,
      userId,
      dto.tier as AiModelTier,
      dto.secret,
    );
    return ok(result, 'AI tier updated');
  }
}
