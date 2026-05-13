import { ConflictException } from '@nestjs/common';
import { PrismaService } from "../../../../libs/database/src";
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
import { DOC_SELECT } from './doc-permissions.constants';
import { DocPermissionsService } from './doc-permissions.service';
import type { CreateDocInput } from './dto/create-doc.dto';
import type { UpdateDocInput } from './dto/update-doc.dto';
import type { ListDocsQuery } from './dto/list-docs-query.dto';
import { ProjectSecurityService } from '../project-security/project-security.service';
export type DocData = Prisma.DocGetPayload<{
    select: typeof DOC_SELECT;
}>;
export type AutosaveDocInput = {
    docId: string;
    contentJson: unknown;
    baseVersion: number;
    lockedBlockIds: Iterable<string>;
};
export type AutosaveDocResult = {
    doc: DocData;
    changedBlockIds: string[];
    orphanedThreadCount: number;
};
export declare class DocSaveConflictException extends ConflictException {
    readonly conflictBlockIds: string[];
    readonly reason: string;
    constructor(conflictBlockIds: string[], reason: string);
}
export declare class DocsService {
    private readonly prisma;
    private readonly permissions;
    private readonly projectSecurity;
    private readonly autosaveTimestamps;
    private readonly contentSnapshots;
    constructor(prisma: PrismaService, permissions: DocPermissionsService, projectSecurity: ProjectSecurityService);
    create(userId: string, dto: CreateDocInput): Promise<DocData>;
    findAll(userId: string, query: ListDocsQuery): Promise<DocData[]>;
    findOne(userId: string, docId: string): Promise<DocData>;
    update(userId: string, docId: string, dto: UpdateDocInput): Promise<DocData>;
    assertCanEditDoc(userId: string, docId: string): Promise<DocData>;
    autosave(userId: string, input: AutosaveDocInput, now?: number): Promise<AutosaveDocResult>;
    remove(userId: string, docId: string): Promise<void>;
    private findDocOrThrow;
    private assertWorkspaceMember;
    private assertScopeIsValid;
    private assertDocProjectUnlocked;
    private filterUnlockedProjectDocs;
    private filterViewable;
    private normalizeTitle;
    private rememberSnapshot;
    private getSnapshot;
    private snapshotKey;
}
