import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { WorkspaceGuard } from '../workspace/workspace.guard';
import {
  TimeEntryService,
  type TimeEntryData,
  type StartTimerResult,
} from './time-entry.service';
import { ManualTimeEntryDto } from './dto/manual-time-entry.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';

@ApiTags('time-entries')
@ApiBearerAuth()
@Controller('tasks/:taskId/time')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Post('manual')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log a manual time entry (startTime+endTime or durationMinutes)' })
  @ApiResponse({ status: 201, description: 'Manual time entry logged' })
  async addManual(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Body() dto: ManualTimeEntryDto,
  ): Promise<ApiRes<TimeEntryData>> {
    const entry = await this.timeEntryService.addManual(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      dto,
    );
    return ok(entry, 'Time logged successfully');
  }

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start a timer on a task (auto-stops any previously running timer)' })
  @ApiResponse({ status: 201, description: 'Timer started. stoppedEntry is non-null if a previous timer was auto-stopped' })
  async startTimer(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<StartTimerResult>> {
    const result = await this.timeEntryService.startTimer(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    const message = result.stoppedEntry
      ? 'Previous timer stopped. New timer started.'
      : 'Timer started';
    return ok(result, message);
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop the running timer on this task' })
  @ApiResponse({ status: 200, description: 'Timer stopped and duration recorded' })
  @ApiResponse({ status: 404, description: 'No active timer found for this task' })
  async stopTimer(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TimeEntryData>> {
    const entry = await this.timeEntryService.stopTimer(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    return ok(entry, 'Timer stopped');
  }

  @Get()
  @ApiOperation({ summary: 'List all time entries for a task' })
  @ApiResponse({ status: 200, description: 'Time entries returned' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TimeEntryData[]>> {
    const entries = await this.timeEntryService.findAllByTask(
      req.workspaceContext.workspaceId,
      taskId,
    );
    return ok(entries);
  }
}
