import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from './workspace.guard';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type { WorkspaceRequest } from './workspace.types';
import type { AuthUser } from '../auth/auth.service';
import type { Request } from 'express';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import type { WorkspaceData } from './workspace.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('workspaces')
@ApiBearerAuth()
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created successfully' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async create(
    @Body() dto: CreateWorkspaceDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ApiRes<WorkspaceData>> {
    const workspace = await this.workspaceService.create(req.user.id, dto);
    return ok(workspace, 'Workspace created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List all workspaces the current user belongs to' })
  @ApiResponse({ status: 200, description: 'Workspaces returned' })
  async findAll(@Req() req: AuthenticatedRequest): Promise<ApiRes<WorkspaceData[]>> {
    const workspaces = await this.workspaceService.findAllForUser(req.user.id);
    return ok(workspaces);
  }

  @Get(':workspaceId')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get a single workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Workspace returned' })
  @ApiResponse({ status: 403, description: 'Not a member' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async findOne(@Req() req: WorkspaceRequest): Promise<ApiRes<WorkspaceData & { memberCount: number }>> {
    const workspace = await this.workspaceService.findOne(
      req.workspaceContext.workspaceId,
      req.user.id,
    );
    return ok(workspace);
  }

  @Patch(':workspaceId')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Update workspace name or logo (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Workspace updated' })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Body() dto: UpdateWorkspaceDto,
  ): Promise<ApiRes<WorkspaceData>> {
    const workspace = await this.workspaceService.update(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(workspace, 'Workspace updated successfully');
  }

  @Delete(':workspaceId')
  @UseGuards(WorkspaceGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a workspace (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Workspace deleted' })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async remove(@Req() req: WorkspaceRequest): Promise<ApiRes<null>> {
    await this.workspaceService.remove(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
    );
    return ok(null, 'Workspace deleted successfully');
  }
}
