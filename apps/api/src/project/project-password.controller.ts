import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ProjectPasswordService } from '../project-security/project-password.service';
import { ProjectSecurityService } from '../project-security/project-security.service';
import { ChangeProjectPasswordDto } from '../project-security/dto/change-project-password.dto';
import { ConfirmProjectPasswordResetDto } from '../project-security/dto/confirm-project-password-reset.dto';
import { SetProjectPasswordDto } from '../project-security/dto/set-project-password.dto';
import { UnlockProjectDto } from '../project-security/dto/unlock-project.dto';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class ProjectPasswordController {
  constructor(
    private readonly projectPasswords: ProjectPasswordService,
    private readonly projectSecurity: ProjectSecurityService,
  ) {}

  @Post(':projectId/password')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Set the initial password for a project' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 201, description: 'Project password set' })
  async setPassword(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: SetProjectPasswordDto,
  ): Promise<ApiRes<{ id: string; workspaceId: string; passwordUpdatedAt: Date | null }>> {
    const result = await this.projectPasswords.setPassword(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      req.workspaceContext.role,
      dto.password,
    );

    return ok(result, 'Project password set successfully');
  }

  @Put(':projectId/password')
  @ApiOperation({ summary: 'Change an existing project password' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project password changed' })
  async changePassword(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: ChangeProjectPasswordDto,
  ): Promise<ApiRes<{ id: string; workspaceId: string; passwordUpdatedAt: Date | null }>> {
    const result = await this.projectPasswords.changePassword(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      req.workspaceContext.role,
      dto.currentPassword,
      dto.newPassword,
    );

    return ok(result, 'Project password changed successfully');
  }

  @Delete(':projectId/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove project password protection' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project password removed' })
  async removePassword(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<null>> {
    await this.projectPasswords.removePassword(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      req.workspaceContext.role,
    );

    return ok(null, 'Project password removed successfully');
  }

  @Post(':projectId/unlock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlock a password-protected project for the current user' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project unlocked' })
  async unlock(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: UnlockProjectDto,
  ): Promise<ApiRes<{ projectId: string; isLocked: boolean; unlockedUntil: Date | null }>> {
    const result = await this.projectPasswords.unlockProject(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      dto.password,
    );

    return ok(result, 'Project unlocked successfully');
  }

  @Get(':projectId/lock-status')
  @ApiOperation({ summary: 'Get project lock state for the current user' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project lock status returned' })
  async lockStatus(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<
    ApiRes<{
      projectId: string;
      isLocked: boolean;
      isUnlocked: boolean;
      unlockedUntil: Date | null;
      passwordUpdatedAt: Date | null;
    }>
  > {
    const result = await this.projectSecurity.getLockStatus(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
    );

    return ok(result);
  }

  @Post(':projectId/password/reset-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send project password reset email to the project creator' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project password reset email requested' })
  async requestReset(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<null>> {
    await this.projectPasswords.requestPasswordReset(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      req.workspaceContext.role,
    );

    return ok(null, 'Project password reset email requested');
  }

  @Post(':projectId/password/reset-confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset project password using an emailed token' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project password reset' })
  async confirmReset(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: ConfirmProjectPasswordResetDto,
  ): Promise<ApiRes<{ projectId: string; passwordUpdatedAt: Date }>> {
    const result = await this.projectPasswords.resetPasswordWithToken(
      projectId,
      dto.token,
      dto.newPassword,
      req.user.id,
    );

    return ok(result, 'Project password reset successfully');
  }
}
