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

// Gates by `User.role` (CEO/ACCOUNTANT) — distinct from the workspace
// membership `Role` (OWNER/ADMIN/MEMBER) guarded by `../../roles/roles.guard`.
export const USER_ROLE_KEY = 'userRole';

export const RequireUserRole = (...roles: UserRole[]) =>
  SetMetadata(USER_ROLE_KEY, roles);

type RequestWithUser = Request & { user: AuthUser };

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      USER_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const role = req.user?.role;
    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException(
        'You do not have the required role to access this resource',
      );
    }

    return true;
  }
}
