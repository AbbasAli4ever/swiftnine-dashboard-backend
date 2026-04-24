import { TaskListItemResponseDto } from './task-list-item-response.dto';
declare class BoardStatusDto {
    id: string;
    name: string;
    color: string;
    group: 'NOT_STARTED' | 'ACTIVE' | 'DONE' | 'CLOSED';
    position: number;
    isDefault: boolean;
    isProtected: boolean;
    isClosed: boolean;
}
declare class ProjectBoardColumnDto {
    status: BoardStatusDto;
    tasks: TaskListItemResponseDto[];
    total: number;
}
export declare class ProjectBoardDto {
    groupBy: 'status';
    projectId: string;
    columns: ProjectBoardColumnDto[];
    total: number;
}
export declare class ProjectBoardResponseDto {
    success: true;
    data: ProjectBoardDto;
    message: string | null;
}
export {};
