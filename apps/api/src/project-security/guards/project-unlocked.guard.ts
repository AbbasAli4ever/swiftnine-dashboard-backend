import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { WorkspaceContext } from '../../workspace/workspace.types';
import type { AuthUser } from '../../auth/auth.service';
import { ProjectSecurityService } from '../project-security.service';

type ProjectUnlockedRequest = Request & {
  user: AuthUser;
  workspaceContext: WorkspaceContext;
  params: { projectId?: string };
};

@Injectable()
export class ProjectUnlockedGuard implements CanActivate {
  constructor(private readonly security: ProjectSecurityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ProjectUnlockedRequest>();
    const projectId = req.params.projectId?.trim();

    if (!projectId) return true;

    await this.security.assertUnlocked(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
    );

    return true;
  }
}
