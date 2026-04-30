import { type ApiResponse as ApiRes } from '@app/common';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ActivityService, type ActivityFeedResult } from './activity.service';
import { ListActivityDto } from './dto/list-activity.dto';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    listWorkspaceActivity(req: WorkspaceRequest, dto: ListActivityDto): Promise<ApiRes<ActivityFeedResult>>;
    listTaskActivity(req: WorkspaceRequest, taskId: string, dto: ListActivityDto): Promise<ApiRes<ActivityFeedResult>>;
}
