import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  DOC_FORBIDDEN,
  DOC_NOT_FOUND,
  DOC_SELECT,
  DOC_TITLE_REQUIRED,
  DOC_TITLE_TOO_LONG,
  DOC_TITLE_MAX_LENGTH,
  AUTOSAVE_MAX_RATE_MS,
} from './doc-permissions.constants';
import { DocPermissionsService } from './doc-permissions.service';
import { defaultDocContent, normalizeDocContent } from './doc-content';
import {
  diffDocBlocks,
  extractDocBlocks,
  intersectBlockIds,
  mergeDocBlocks,
} from './doc-blocks.util';
import type { CreateDocInput } from './dto/create-doc.dto';
import type { UpdateDocInput } from './dto/update-doc.dto';
import type { ListDocsQuery } from './dto/list-docs-query.dto';
import { ProjectSecurityService } from '../project-security/project-security.service';

export type DocData = Prisma.DocGetPayload<{ select: typeof DOC_SELECT }>;

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

export class DocSaveConflictException extends ConflictException {
  constructor(
    readonly conflictBlockIds: string[],
    readonly reason: string,
  ) {
    super({ conflictBlockIds, reason });
  }
}

@Injectable()
export class DocsService {
  // NOTE: single-instance only - autosave throttle/version snapshots need Redis to scale out.
  private readonly autosaveTimestamps = new Map<string, number>();
  private readonly contentSnapshots = new Map<string, unknown>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: DocPermissionsService,
    private readonly projectSecurity: ProjectSecurityService,
  ) {}

  async create(userId: string, dto: CreateDocInput): Promise<DocData> {
    await this.assertWorkspaceMember(userId, dto.workspaceId);
    await this.assertScopeIsValid(dto);
    if (dto.scope === 'PROJECT' && dto.projectId) {
      await this.projectSecurity.assertUnlocked(dto.workspaceId, dto.projectId, userId);
    }

    const normalized = dto.contentJson
      ? normalizeDocContent(dto.contentJson)
      : defaultDocContent();

    return this.prisma.doc.create({
      data: {
        workspaceId: dto.workspaceId,
        projectId: dto.scope === 'PROJECT' ? dto.projectId : null,
        ownerId: userId,
        scope: dto.scope,
        title: this.normalizeTitle(dto.title),
        contentJson: normalized.contentJson,
        plaintext: normalized.plaintext,
        version: 1,
      },
      select: DOC_SELECT,
    });
  }

  async findAll(userId: string, query: ListDocsQuery): Promise<DocData[]> {
    await this.assertWorkspaceMember(userId, query.workspaceId);
    if (query.projectId) {
      await this.projectSecurity.assertUnlocked(query.workspaceId, query.projectId, userId);
    }

    const docs = await this.prisma.doc.findMany({
      where: {
        workspaceId: query.workspaceId,
        projectId: query.projectId,
        scope: query.scope,
        deletedAt: null,
      },
      select: DOC_SELECT,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return this.filterUnlockedProjectDocs(userId, await this.filterViewable(userId, docs));
  }

  async findOne(userId: string, docId: string): Promise<DocData> {
    const doc = await this.findDocOrThrow(docId);
    await this.permissions.assertCanView(userId, doc);
    await this.assertDocProjectUnlocked(userId, doc);
    return doc;
  }

  async update(
    userId: string,
    docId: string,
    dto: UpdateDocInput,
  ): Promise<DocData> {
    const doc = await this.findDocOrThrow(docId);
    await this.permissions.assertCanEdit(userId, doc);
    await this.assertDocProjectUnlocked(userId, doc);

    const data: Prisma.DocUpdateInput = {};

    if (dto.title !== undefined) {
      data.title = this.normalizeTitle(dto.title);
    }

    if (dto.contentJson !== undefined) {
      const normalized = normalizeDocContent(dto.contentJson);
      data.contentJson = normalized.contentJson;
      data.plaintext = normalized.plaintext;
      data.version = { increment: 1 };
    }

    if (Object.keys(data).length === 0) return doc;

    return this.prisma.doc.update({
      where: { id: docId },
      data,
      select: DOC_SELECT,
    });
  }

  async assertCanEditDoc(userId: string, docId: string): Promise<DocData> {
    const doc = await this.findDocOrThrow(docId);
    await this.permissions.assertCanEdit(userId, doc);
    await this.assertDocProjectUnlocked(userId, doc);
    return doc;
  }

  async autosave(
    userId: string,
    input: AutosaveDocInput,
    now = Date.now(),
  ): Promise<AutosaveDocResult> {
    const throttleKey = `${userId}:${input.docId}`;
    const lastSaveAt = this.autosaveTimestamps.get(throttleKey);
    if (lastSaveAt !== undefined && now - lastSaveAt < AUTOSAVE_MAX_RATE_MS) {
      throw new DocSaveConflictException([], 'Autosave throttled');
    }

    const doc = await this.findDocOrThrow(input.docId);
    await this.permissions.assertCanEdit(userId, doc);
    await this.assertDocProjectUnlocked(userId, doc);

    if (!Number.isInteger(input.baseVersion) || input.baseVersion < 0) {
      throw new BadRequestException('baseVersion must be a non-negative integer');
    }

    this.rememberSnapshot(doc.id, doc.version, doc.contentJson);

    const normalized = normalizeDocContent(input.contentJson);
    const lockedBlockIds = new Set(input.lockedBlockIds);
    const currentBlocks = extractDocBlocks(doc.contentJson);
    const incomingBlocks = extractDocBlocks(normalized.contentJson);

    let contentToPersist: Prisma.InputJsonValue = normalized.contentJson;
    let changedBlockIds = diffDocBlocks(currentBlocks, incomingBlocks);
    let lockBaseBlocks = currentBlocks;

    if (input.baseVersion > doc.version) {
      throw new DocSaveConflictException([], 'Client base version is ahead of the server');
    }

    if (input.baseVersion < doc.version) {
      const baseContent = this.getSnapshot(doc.id, input.baseVersion);
      if (!baseContent) {
        throw new DocSaveConflictException([], 'Base version is no longer available');
      }

      const baseBlocks = extractDocBlocks(baseContent);
      const serverChangedBlockIds = diffDocBlocks(baseBlocks, currentBlocks);
      const clientChangedBlockIds = diffDocBlocks(baseBlocks, incomingBlocks);
      const overlap = intersectBlockIds(serverChangedBlockIds, clientChangedBlockIds);

      if (overlap.length > 0) {
        throw new DocSaveConflictException(overlap, 'Stale save overlaps with server changes');
      }

      contentToPersist = mergeDocBlocks(
        normalized.contentJson,
        doc.contentJson,
        serverChangedBlockIds,
      ) as Prisma.InputJsonValue;
      changedBlockIds = clientChangedBlockIds;
      lockBaseBlocks = baseBlocks;
    }

    const modifiedExistingBlockIds = Array.from(changedBlockIds).filter((blockId) =>
      lockBaseBlocks.has(blockId),
    );
    const unlockedBlockIds = modifiedExistingBlockIds.filter(
      (blockId) => !lockedBlockIds.has(blockId),
    );

    if (unlockedBlockIds.length > 0) {
      throw new DocSaveConflictException(
        unlockedBlockIds,
        'Modified blocks must be locked by the saving user',
      );
    }

    const persistedContent = normalizeDocContent(contentToPersist);
    const persistedBlocks = extractDocBlocks(persistedContent.contentJson);

    const { doc: savedDoc, orphanedThreadCount } = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const orphaned = await tx.docCommentThread.updateMany({
          where: {
            docId: doc.id,
            isOrphan: false,
            anchorBlockId: { not: null, notIn: Array.from(persistedBlocks.keys()) },
          },
          data: { isOrphan: true },
        });

        const saved = await tx.doc.update({
          where: { id: doc.id },
          data: {
            contentJson: persistedContent.contentJson,
            plaintext: persistedContent.plaintext,
            version: { increment: 1 },
          },
          select: DOC_SELECT,
        });

        return { doc: saved, orphanedThreadCount: orphaned.count };
      },
    );

    this.autosaveTimestamps.set(throttleKey, now);
    this.rememberSnapshot(savedDoc.id, savedDoc.version, savedDoc.contentJson);

    return {
      doc: savedDoc,
      changedBlockIds: Array.from(changedBlockIds),
      orphanedThreadCount,
    };
  }

  async remove(userId: string, docId: string): Promise<void> {
    const doc = await this.findDocOrThrow(docId);
    await this.permissions.assertCanOwn(userId, doc);
    await this.assertDocProjectUnlocked(userId, doc);

    await this.prisma.doc.update({
      where: { id: docId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  }

  private async findDocOrThrow(docId: string): Promise<DocData> {
    const doc = await this.prisma.doc.findFirst({
      where: { id: docId, deletedAt: null },
      select: DOC_SELECT,
    });
    if (!doc) throw new NotFoundException(DOC_NOT_FOUND);
    return doc;
  }

  private async assertWorkspaceMember(
    userId: string,
    workspaceId: string,
  ): Promise<void> {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
        workspace: { deletedAt: null },
      },
      select: { id: true },
    });

    if (!member) throw new ForbiddenException(DOC_FORBIDDEN);
  }

  private async assertScopeIsValid(dto: CreateDocInput): Promise<void> {
    if (dto.scope === 'PROJECT') {
      if (!dto.projectId) {
        throw new BadRequestException('Project documents require projectId');
      }

      const project = await this.prisma.project.findFirst({
        where: {
          id: dto.projectId,
          workspaceId: dto.workspaceId,
          deletedAt: null,
          isArchived: false,
        },
        select: { id: true },
      });
      if (!project) throw new BadRequestException('Project not found in workspace');
      return;
    }

    if (dto.projectId) {
      throw new BadRequestException('projectId is only allowed for project documents');
    }
  }

  private async assertDocProjectUnlocked(
    userId: string,
    doc: Pick<DocData, 'workspaceId' | 'projectId'>,
  ): Promise<void> {
    if (!doc.projectId) return;
    await this.projectSecurity.assertUnlocked(doc.workspaceId, doc.projectId, userId);
  }

  private async filterUnlockedProjectDocs(
    userId: string,
    docs: DocData[],
  ): Promise<DocData[]> {
    const projectIds = Array.from(
      new Set(docs.map((doc) => doc.projectId).filter((id): id is string => Boolean(id))),
    );
    if (projectIds.length === 0) return docs;

    const projects = await this.prisma.project.findMany({
      where: { id: { in: projectIds } },
      select: { id: true, passwordHash: true },
    });
    const unlockedByDefaultIds = new Set(
      projects.filter((project) => !project.passwordHash).map((project) => project.id),
    );
    const lockedProjectIds = projects
      .filter((project) => Boolean(project.passwordHash))
      .map((project) => project.id);
    const unlockedProjectIds = await this.projectSecurity.activeUnlockedProjectIds(
      lockedProjectIds,
      userId,
    );

    return docs.filter(
      (doc) =>
        !doc.projectId ||
        unlockedByDefaultIds.has(doc.projectId) ||
        unlockedProjectIds.has(doc.projectId),
    );
  }

  private async filterViewable(
    userId: string,
    docs: DocData[],
  ): Promise<DocData[]> {
    const viewable: DocData[] = [];
    for (const doc of docs) {
      const role = await this.permissions.resolveEffectiveRole(userId, doc);
      if (role) viewable.push(doc);
    }
    return viewable;
  }

  private normalizeTitle(title: string): string {
    const normalized = title.trim();
    if (!normalized) throw new BadRequestException(DOC_TITLE_REQUIRED);
    if (normalized.length > DOC_TITLE_MAX_LENGTH) {
      throw new BadRequestException(DOC_TITLE_TOO_LONG);
    }
    return normalized;
  }

  private rememberSnapshot(docId: string, version: number, contentJson: unknown): void {
    this.contentSnapshots.set(this.snapshotKey(docId, version), contentJson);
  }

  private getSnapshot(docId: string, version: number): unknown | undefined {
    return this.contentSnapshots.get(this.snapshotKey(docId, version));
  }

  private snapshotKey(docId: string, version: number): string {
    return `${docId}:${version}`;
  }
}
