import { ProjectService, type ProjectWithDetails } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(req: WorkspaceRequest, dto: CreateProjectDto): Promise<ApiRes<ProjectWithDetails>>;
    findAll(req: WorkspaceRequest): Promise<ApiRes<ProjectWithDetails[]>>;
    findOne(req: WorkspaceRequest, projectId: string): Promise<ApiRes<ProjectWithDetails>>;
    update(req: WorkspaceRequest, projectId: string, dto: UpdateProjectDto): Promise<ApiRes<ProjectWithDetails>>;
    remove(req: WorkspaceRequest, projectId: string): Promise<ApiRes<null>>;
}
