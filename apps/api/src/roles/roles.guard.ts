import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@app/database';
import type { Role } from '@app/database/generated/prisma/client';
import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.service';
import { ROLES_KEY } from './roles.decorator';

type RequestWithWorkspace = Request & {
  user: AuthUser;
  workspaceContext?: {
    workspaceId: string;
    role: Role;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const req = context.switchToHttp().getRequest<RequestWithWorkspace>();
    const existingRole = req.workspaceContext?.role;

    if (existingRole && requiredRoles.includes(existingRole)) return true;

    const workspaceId = this.resolveWorkspaceId(req);
    if (!workspaceId) {
      throw new ForbiddenException('Workspace id is required for this action');
    }

    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: req.user.id,
        deletedAt: null,
      },
      select: { role: true, workspaceId: true },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    req.workspaceContext = { workspaceId: member.workspaceId, role: member.role };

    if (!requiredRoles.includes(member.role)) {
      throw new ForbiddenException('Only the workspace owner can perform this action');
    }

    return true;
  }

  private resolveWorkspaceId(req: RequestWithWorkspace): string | null {
    if (req.workspaceContext?.workspaceId) return req.workspaceContext.workspaceId;

    const headerWorkspaceId = req.headers['x-workspace-id'];
    if (typeof headerWorkspaceId === 'string' && headerWorkspaceId.trim()) {
      return headerWorkspaceId.trim();
    }

    const bodyWorkspaceId = this.getStringField(req.body, 'workspaceId');
    if (bodyWorkspaceId) return bodyWorkspaceId;

    const paramWorkspaceId = this.getStringField(req.params, 'workspaceId');
    if (paramWorkspaceId) return paramWorkspaceId;

    const queryWorkspaceId = this.getStringField(req.query, 'workspaceId');
    if (queryWorkspaceId) return queryWorkspaceId;

    return null;
  }

  private getStringField(source: unknown, key: string): string | null {
    if (!source || typeof source !== 'object') return null;
    const value = (source as Record<string, unknown>)[key];
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }
}
