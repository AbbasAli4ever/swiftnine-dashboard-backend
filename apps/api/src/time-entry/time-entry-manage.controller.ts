import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { TimeEntryService, type TimeEntryData } from './time-entry.service';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';

@ApiTags('time-entries')
@ApiBearerAuth()
@Controller('time-entries')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TimeEntryManageController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get the currently running timer for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Active timer entry or null if none running' })
  async getActive(@Req() req: WorkspaceRequest): Promise<ApiRes<TimeEntryData | null>> {
    const entry = await this.timeEntryService.findActiveTimer(
      req.workspaceContext.workspaceId,
      req.user.id,
    );
    return ok(entry);
  }

  @Patch(':entryId')
  @ApiOperation({ summary: 'Update a manual time entry (own entries only)' })
  @ApiResponse({ status: 200, description: 'Time entry updated' })
  @ApiResponse({ status: 403, description: 'Can only update your own time entries' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('entryId') entryId: string,
    @Body() dto: UpdateTimeEntryDto,
  ): Promise<ApiRes<TimeEntryData>> {
    const entry = await this.timeEntryService.update(
      req.workspaceContext.workspaceId,
      req.user.id,
      entryId,
      dto,
    );
    return ok(entry, 'Time entry updated successfully');
  }

  @Delete(':entryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a time entry (own entries only)' })
  @ApiResponse({ status: 200, description: 'Time entry deleted' })
  @ApiResponse({ status: 403, description: 'Can only delete your own time entries' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('entryId') entryId: string,
  ): Promise<ApiRes<null>> {
    await this.timeEntryService.remove(
      req.workspaceContext.workspaceId,
      req.user.id,
      entryId,
    );
    return ok(null, 'Time entry deleted successfully');
  }
}
