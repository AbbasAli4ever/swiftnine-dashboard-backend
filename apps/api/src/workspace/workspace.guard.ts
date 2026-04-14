import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { AuthUser } from '../auth/auth.service';
import type { Request } from 'express';

const MISSING_WORKSPACE_HEADER = 'x-workspace-id header is required';
const NOT_A_MEMBER = 'You are not a member of this workspace';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user: AuthUser; workspaceContext?: unknown }>();

    const workspaceId = req.headers['x-workspace-id'];
    if (!workspaceId || typeof workspaceId !== 'string' || !workspaceId.trim()) {
      throw new ForbiddenException(MISSING_WORKSPACE_HEADER);
    }

    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId: workspaceId.trim(),
        userId: req.user.id,
        deletedAt: null,
      },
      select: { role: true, workspaceId: true },
    });

    if (!member) {
      throw new ForbiddenException(NOT_A_MEMBER);
    }

    req.workspaceContext = { workspaceId: member.workspaceId, role: member.role };
    return true;
  }
}
