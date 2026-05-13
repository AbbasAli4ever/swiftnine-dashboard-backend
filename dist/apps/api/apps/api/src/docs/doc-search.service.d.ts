import { PrismaService } from "../../../../libs/database/src";
import type { DocScope } from "../../../../libs/database/src/generated/prisma/client";
import { DocPermissionsService } from './doc-permissions.service';
import { ProjectSecurityService } from '../project-security/project-security.service';
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
    private readonly projectSecurity;
    constructor(prisma: PrismaService, permissions: DocPermissionsService, projectSecurity: ProjectSecurityService);
    search(params: {
        query: string;
        workspaceId: string;
        projectId?: string;
        userId: string;
    }): Promise<DocSearchResult[]>;
    private searchWorkspace;
    private searchProject;
}
