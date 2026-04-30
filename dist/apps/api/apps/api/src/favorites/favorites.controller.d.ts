import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favorites;
    constructor(favorites: FavoritesService);
    listFavoriteProjects(req: WorkspaceRequest, includeArchived?: string): Promise<ApiRes<unknown[]>>;
    listFavoriteTasks(req: WorkspaceRequest, includeArchived?: string): Promise<ApiRes<unknown[]>>;
    favoriteProject(req: WorkspaceRequest, projectId: string): Promise<ApiRes<{
        isFavorite: boolean;
    }>>;
    unfavoriteProject(req: WorkspaceRequest, projectId: string): Promise<ApiRes<{
        isFavorite: boolean;
    }>>;
    favoriteTask(req: WorkspaceRequest, taskId: string): Promise<ApiRes<{
        isFavorite: boolean;
    }>>;
    unfavoriteTask(req: WorkspaceRequest, taskId: string): Promise<ApiRes<{
        isFavorite: boolean;
    }>>;
}
