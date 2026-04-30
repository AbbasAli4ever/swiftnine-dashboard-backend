import { PrismaService } from '@app/database';
import type { DocScope } from '@app/database/generated/prisma/client';
import { DocPermissionsService } from './doc-permissions.service';
export interface DocSearchResult {
    id: string;
    title: string;
    scope: DocScope;
    workspaceId: string;
    projectId: string | null;
    ownerId: string;
    updatedAt: Date;
    snippet: string | null;
}
export declare class DocSearchService {
    private readonly prisma;
    private readonly permissions;
    constructor(prisma: PrismaService, permissions: DocPermissionsService);
    search(params: {
        query: string;
        workspaceId: string;
        projectId?: string;
        userId: string;
    }): Promise<DocSearchResult[]>;
    private searchWorkspace;
    private searchProject;
}
