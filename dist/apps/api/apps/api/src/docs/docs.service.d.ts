import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import { DOC_SELECT } from './doc-permissions.constants';
import { DocPermissionsService } from './doc-permissions.service';
import type { CreateDocInput } from './dto/create-doc.dto';
import type { UpdateDocInput } from './dto/update-doc.dto';
import type { ListDocsQuery } from './dto/list-docs-query.dto';
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
    private readonly autosaveTimestamps;
    private readonly contentSnapshots;
    constructor(prisma: PrismaService, permissions: DocPermissionsService);
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
    private filterViewable;
    private normalizeTitle;
    private rememberSnapshot;
    private getSnapshot;
    private snapshotKey;
}
