import { TimeEntryService, type TimeEntryData } from './time-entry.service';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
export declare class TimeEntryManageController {
    private readonly timeEntryService;
    constructor(timeEntryService: TimeEntryService);
    getActive(req: WorkspaceRequest): Promise<ApiRes<TimeEntryData | null>>;
    update(req: WorkspaceRequest, entryId: string, dto: UpdateTimeEntryDto): Promise<ApiRes<TimeEntryData>>;
    remove(req: WorkspaceRequest, entryId: string): Promise<ApiRes<null>>;
}
