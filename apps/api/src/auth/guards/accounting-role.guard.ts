import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { UserRole } from '@app/database/generated/prisma/enums';
import type { AuthUser } from '../auth.service';
import type { WorkspaceContext } from '../../workspace/workspace.types';

// Gates by `WorkspaceMember.accountingRole` (CEO/ACCOUNTANT), scoped to the
// current workspace — distinct from the workspace membership `Role`
// (OWNER/ADMIN/MEMBER) guarded by `../../roles/roles.guard`. Must run after
// `WorkspaceGuard`, which populates `req.workspaceContext`.
export const ACCOUNTING_ROLE_KEY = 'accountingRole';

export const RequireAccountingRole = (...roles: UserRole[]) =>
  SetMetadata(ACCOUNTING_ROLE_KEY, roles);

type RequestWithWorkspace = Request & {
  user: AuthUser;
  workspaceContext: WorkspaceContext;
};

@Injectable()
export class AccountingRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ACCOUNTING_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithWorkspace>();
    const accountingRole = req.workspaceContext?.accountingRole;
    if (!accountingRole || !requiredRoles.includes(accountingRole)) {
      throw new ForbiddenException(
        'You do not have the required role to access this resource',
      );
    }

    return true;
  }
}
