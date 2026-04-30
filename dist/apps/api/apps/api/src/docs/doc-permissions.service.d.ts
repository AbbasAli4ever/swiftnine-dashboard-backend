import { PrismaService } from '@app/database';
import type { Doc, DocRole } from '@app/database/generated/prisma/client';
export type DocAccessSubject = Pick<Doc, 'id' | 'scope' | 'workspaceId' | 'projectId' | 'ownerId'>;
export declare class DocPermissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveEffectiveRole(userId: string, doc: DocAccessSubject): Promise<DocRole | null>;
    assertCanView(userId: string, doc: DocAccessSubject): Promise<DocRole>;
    assertCanComment(userId: string, doc: DocAccessSubject): Promise<DocRole>;
    assertCanEdit(userId: string, doc: DocAccessSubject): Promise<DocRole>;
    assertCanOwn(userId: string, doc: DocAccessSubject): Promise<DocRole>;
    private getInheritedRole;
    private getOverrideRole;
    private assertAtLeast;
}
