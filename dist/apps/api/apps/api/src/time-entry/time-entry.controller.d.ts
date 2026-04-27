import { TimeEntryService, type TimeEntryData, type StartTimerResult } from './time-entry.service';
import { ManualTimeEntryDto } from './dto/manual-time-entry.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
export declare class TimeEntryController {
    private readonly timeEntryService;
    constructor(timeEntryService: TimeEntryService);
    addManual(req: WorkspaceRequest, taskId: string, dto: ManualTimeEntryDto): Promise<ApiRes<TimeEntryData>>;
    startTimer(req: WorkspaceRequest, taskId: string): Promise<ApiRes<StartTimerResult>>;
    stopTimer(req: WorkspaceRequest, taskId: string): Promise<ApiRes<TimeEntryData>>;
    findAll(req: WorkspaceRequest, taskId: string): Promise<ApiRes<TimeEntryData[]>>;
}
