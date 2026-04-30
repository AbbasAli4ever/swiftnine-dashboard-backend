import { TagService, type TagData } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes } from '@app/common';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    create(req: WorkspaceRequest, dto: CreateTagDto): Promise<ApiRes<TagData>>;
    findAll(req: WorkspaceRequest): Promise<ApiRes<TagData[]>>;
    update(req: WorkspaceRequest, tagId: string, dto: UpdateTagDto): Promise<ApiRes<TagData>>;
    remove(req: WorkspaceRequest, tagId: string): Promise<ApiRes<null>>;
}
