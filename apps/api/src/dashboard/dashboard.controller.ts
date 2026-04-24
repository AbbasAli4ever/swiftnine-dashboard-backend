import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { DashboardService, type ProjectDashboardData } from './dashboard.service';
import { ProjectDashboardResponseDto } from './dto/project-dashboard-response.dto';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('projects/:projectId/dashboard')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the overview dashboard data for a project',
    description:
      'Returns project overview data for the Overview section, including task counts grouped by status, per-list task stats, and all task attachments in the project.',
  })
  @ApiOkResponse({ description: 'Project dashboard returned', type: ProjectDashboardResponseDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectDashboard(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<ProjectDashboardData>> {
    const dashboard = await this.dashboardService.getProjectDashboard(
      req.workspaceContext.workspaceId,
      projectId,
    );
    return ok(dashboard);
  }
}
