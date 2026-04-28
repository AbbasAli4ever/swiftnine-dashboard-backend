import { PrismaService } from "../../../../libs/database/src";
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
import { DOC_SELECT } from './doc-permissions.constants';
import { DocPermissionsService } from './doc-permissions.service';
import type { CreateDocInput } from './dto/create-doc.dto';
import type { UpdateDocInput } from './dto/update-doc.dto';
import type { ListDocsQuery } from './dto/list-docs-query.dto';
export type DocData = Prisma.DocGetPayload<{
    select: typeof DOC_SELECT;
}>;
export declare class DocsService {
    private readonly prisma;
    private readonly permissions;
    constructor(prisma: PrismaService, permissions: DocPermissionsService);
    create(userId: string, dto: CreateDocInput): Promise<DocData>;
    findAll(userId: string, query: ListDocsQuery): Promise<DocData[]>;
    findOne(userId: string, docId: string): Promise<DocData>;
    update(userId: string, docId: string, dto: UpdateDocInput): Promise<DocData>;
    remove(userId: string, docId: string): Promise<void>;
    private findDocOrThrow;
    private assertWorkspaceMember;
    private assertScopeIsValid;
    private filterViewable;
    private normalizeTitle;
}
