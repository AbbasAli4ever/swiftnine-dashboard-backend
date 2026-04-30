import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { AuthUser } from '../auth/auth.service';
import { DocsService, type DocData } from './docs.service';
import { DocSearchService, type DocSearchResult } from './doc-search.service';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';
import { ListDocsQueryDto } from './dto/list-docs-query.dto';
import { SearchDocsQueryDto } from './dto/search-docs-query.dto';
import type { Request } from 'express';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class DocsController {
    private readonly docsService;
    private readonly searchService;
    constructor(docsService: DocsService, searchService: DocSearchService);
    create(req: AuthenticatedRequest, dto: CreateDocDto): Promise<ApiRes<DocData>>;
    findAll(req: AuthenticatedRequest, query: ListDocsQueryDto): Promise<ApiRes<DocData[]>>;
    search(req: AuthenticatedRequest, query: SearchDocsQueryDto): Promise<ApiRes<DocSearchResult[]>>;
    findOne(req: AuthenticatedRequest, docId: string): Promise<ApiRes<DocData>>;
    update(req: AuthenticatedRequest, docId: string, dto: UpdateDocDto): Promise<ApiRes<DocData>>;
    remove(req: AuthenticatedRequest, docId: string): Promise<ApiRes<null>>;
}
export {};
