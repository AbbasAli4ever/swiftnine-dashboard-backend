import {
  BadRequestException,
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
} from './doc-permissions.constants';
import { DocPermissionsService } from './doc-permissions.service';
import { defaultDocContent, normalizeDocContent } from './doc-content';
import type { CreateDocInput } from './dto/create-doc.dto';
import type { UpdateDocInput } from './dto/update-doc.dto';
import type { ListDocsQuery } from './dto/list-docs-query.dto';

export type DocData = Prisma.DocGetPayload<{ select: typeof DOC_SELECT }>;

@Injectable()
export class DocsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: DocPermissionsService,
  ) {}

  async create(userId: string, dto: CreateDocInput): Promise<DocData> {
    await this.assertWorkspaceMember(userId, dto.workspaceId);
    await this.assertScopeIsValid(dto);

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

    return this.filterViewable(userId, docs);
  }

  async findOne(userId: string, docId: string): Promise<DocData> {
    const doc = await this.findDocOrThrow(docId);
    await this.permissions.assertCanView(userId, doc);
    return doc;
  }

  async update(
    userId: string,
    docId: string,
    dto: UpdateDocInput,
  ): Promise<DocData> {
    const doc = await this.findDocOrThrow(docId);
    await this.permissions.assertCanEdit(userId, doc);

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

  async remove(userId: string, docId: string): Promise<void> {
    const doc = await this.findDocOrThrow(docId);
    await this.permissions.assertCanOwn(userId, doc);

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
}
