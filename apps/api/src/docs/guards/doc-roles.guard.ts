import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { DocRole } from '@app/database/generated/prisma/client';
import { PrismaService } from '@app/database';
import { DocPermissionsService } from '../doc-permissions.service';
import { DOC_ROLE_RANK, DOC_FORBIDDEN, DOC_NOT_FOUND } from '../doc-permissions.constants';

export const DOC_ROLE_KEY = 'docRole';

/** Decorator to declare the minimum DocRole required for an endpoint. */
export const RequireDocRole = (role: DocRole) => SetMetadata(DOC_ROLE_KEY, role);

/**
 * Guard that resolves the user's effective doc role and enforces a minimum.
 * Expects the route param to be :id or :docId. Must run after JwtAuthGuard.
 */
@Injectable()
export class DocRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly permissions: DocPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<DocRole>(DOC_ROLE_KEY, context.getHandler());
    if (!requiredRole) return true;

    const req = context.switchToHttp().getRequest<{ user: { id: string }; params: { id?: string; docId?: string } }>();
    const userId = req.user?.id;
    const docId = req.params?.docId ?? req.params?.id;

    if (!userId || !docId) throw new ForbiddenException(DOC_FORBIDDEN);

    const doc = await this.prisma.doc.findFirst({
      where: { id: docId, deletedAt: null },
      select: { id: true, scope: true, workspaceId: true, projectId: true, ownerId: true },
    });

    if (!doc) throw new NotFoundException(DOC_NOT_FOUND);

    const effective = await this.permissions.resolveEffectiveRole(userId, doc);

    if (!effective || DOC_ROLE_RANK[effective] < DOC_ROLE_RANK[requiredRole]) {
      throw new ForbiddenException(DOC_FORBIDDEN);
    }

    return true;
  }
}
