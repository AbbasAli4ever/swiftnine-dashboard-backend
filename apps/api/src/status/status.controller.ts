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
  Query,
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
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { StatusService, type GroupedStatuses, type StatusData } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { DeleteStatusDto } from './dto/delete-status.dto';
import { ReorderStatusesDto } from './dto/reorder-statuses.dto';
import { DefaultStatusesDto } from './dto/default-statuses.dto';
import { ListStatusesDto } from './dto/list-statuses.dto';

@ApiTags('statuses')
@ApiBearerAuth()
@Controller('statuses')
@UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @Roles('OWNER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a custom status for a project (OWNER only)' })
  @ApiResponse({ status: 201, description: 'Status created' })
  @ApiResponse({ status: 403, description: 'Only workspace owner can manage statuses' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateStatusDto,
  ): Promise<ApiRes<StatusData>> {
    const status = await this.statusService.create(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(status, 'Status created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List grouped statuses for a project' })
  @ApiResponse({ status: 200, description: 'Statuses returned' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query() dto: ListStatusesDto,
  ): Promise<ApiRes<GroupedStatuses>> {
    const statuses = await this.statusService.findAll(
      req.workspaceContext.workspaceId,
      dto.projectId,
      req.user.id,
    );
    return ok(statuses);
  }

  @Put('reorder')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Reorder statuses and move them across groups (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Statuses reordered' })
  @ApiResponse({ status: 403, description: 'Only workspace owner can manage statuses' })
  async reorder(
    @Req() req: WorkspaceRequest,
    @Body() dto: ReorderStatusesDto,
  ): Promise<ApiRes<GroupedStatuses>> {
    const statuses = await this.statusService.reorder(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(statuses, 'Statuses reordered successfully');
  }

  @Post('default')
  @Roles('OWNER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apply the default status template to a project (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Default statuses applied' })
  @ApiResponse({ status: 403, description: 'Only workspace owner can manage statuses' })
  async applyDefaultTemplate(
    @Req() req: WorkspaceRequest,
    @Body() dto: DefaultStatusesDto,
  ): Promise<ApiRes<GroupedStatuses>> {
    const statuses = await this.statusService.applyDefaultTemplate(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(statuses, 'Default statuses applied successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single status by id' })
  @ApiResponse({ status: 200, description: 'Status returned' })
  @ApiResponse({ status: 404, description: 'Status not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('id') id: string,
  ): Promise<ApiRes<StatusData>> {
    const status = await this.statusService.findOne(req.workspaceContext.workspaceId, id);
    return ok(status);
  }

  @Put(':id')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Update a status (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 403, description: 'Only workspace owner can manage statuses' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ): Promise<ApiRes<StatusData>> {
    const status = await this.statusService.update(
      req.workspaceContext.workspaceId,
      id,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(status, 'Status updated successfully');
  }

  @Delete(':id')
  @Roles('OWNER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a status and optionally reassign its tasks (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Status deleted' })
  @ApiResponse({ status: 403, description: 'Only workspace owner can manage statuses' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('id') id: string,
    @Body() dto: DeleteStatusDto,
  ): Promise<ApiRes<null>> {
    await this.statusService.remove(
      req.workspaceContext.workspaceId,
      id,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(null, 'Status deleted successfully');
  }
}
