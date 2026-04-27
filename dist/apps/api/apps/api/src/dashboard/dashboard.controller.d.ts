import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { DashboardService, type ProjectDashboardData } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getProjectDashboard(req: WorkspaceRequest, projectId: string): Promise<ApiRes<ProjectDashboardData>>;
}
