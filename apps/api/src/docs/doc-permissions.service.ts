import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Doc, DocRole } from '@app/database/generated/prisma/client';
import {
  DOC_FORBIDDEN,
  DOC_ROLE_RANK,
  WORKSPACE_ROLE_TO_DOC_ROLE,
} from './doc-permissions.constants';

export type DocAccessSubject = Pick<
  Doc,
  'id' | 'scope' | 'workspaceId' | 'projectId' | 'ownerId'
>;

@Injectable()
export class DocPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the highest effective DocRole the user holds on this doc.
   * Resolution order: explicit override ≥ inherited membership role.
   * Returns null when the user has no access at all.
   */
  async resolveEffectiveRole(
    userId: string,
    doc: DocAccessSubject,
  ): Promise<DocRole | null> {
    if (doc.ownerId === userId) return 'OWNER';

    const override = await this.getOverrideRole(userId, doc.id);

    if (doc.scope === 'PERSONAL') return override;

    const base = await this.getInheritedRole(userId, doc);
    if (!base) return null;

    const inheritedRank = base ? DOC_ROLE_RANK[base] : 0;
    const overrideRank = override ? DOC_ROLE_RANK[override] : 0;

    return inheritedRank >= overrideRank ? base : override;
  }

  async assertCanView(userId: string, doc: DocAccessSubject): Promise<DocRole> {
    return this.assertAtLeast(userId, doc, 'VIEWER');
  }

  async assertCanComment(userId: string, doc: DocAccessSubject): Promise<DocRole> {
    return this.assertAtLeast(userId, doc, 'COMMENTER');
  }

  async assertCanEdit(userId: string, doc: DocAccessSubject): Promise<DocRole> {
    return this.assertAtLeast(userId, doc, 'EDITOR');
  }

  async assertCanOwn(userId: string, doc: DocAccessSubject): Promise<DocRole> {
    const role = await this.resolveEffectiveRole(userId, doc);
    if (role !== 'OWNER') throw new ForbiddenException(DOC_FORBIDDEN);
    return role;
  }

  private async getInheritedRole(
    userId: string,
    doc: Pick<Doc, 'scope' | 'workspaceId' | 'projectId'>,
  ): Promise<DocRole | null> {
    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: doc.workspaceId, userId, deletedAt: null },
      select: { role: true },
    });

    if (!member) return null;

    return WORKSPACE_ROLE_TO_DOC_ROLE[member.role] ?? null;
  }

  private async getOverrideRole(
    userId: string,
    docId: string,
  ): Promise<DocRole | null> {
    const override = await this.prisma.docPermission.findUnique({
      where: { docId_userId: { docId, userId } },
      select: { role: true },
    });

    return override?.role ?? null;
  }

  private async assertAtLeast(
    userId: string,
    doc: DocAccessSubject,
    requiredRole: DocRole,
  ): Promise<DocRole> {
    const role = await this.resolveEffectiveRole(userId, doc);
    if (!role || DOC_ROLE_RANK[role] < DOC_ROLE_RANK[requiredRole]) {
      throw new ForbiddenException(DOC_FORBIDDEN);
    }
    return role;
  }
}
