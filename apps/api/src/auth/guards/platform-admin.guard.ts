import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from '../auth.service';
import { PLATFORM_ADMIN_ONLY } from '../auth.constants';

// Gates by `User.isPlatformAdmin` — a company-wide flag, NOT scoped to any
// workspace. This is deliberately different from the other two role guards:
//
//   - roles.guard          → WorkspaceMember.role (OWNER/ADMIN/MEMBER)
//   - accounting-role.guard → WorkspaceMember.accountingRole (CEO/ACCOUNTANT)
//   - this one             → User.isPlatformAdmin (global)
//
// Used only to protect granting/revoking accounting access. A workspace can
// have several OWNERs, so `role === 'OWNER'` can't distinguish the company
// admin from an ordinary owner — that's exactly why this is a per-user flag
// rather than another workspace role.
//
// Needs no workspace context and no membership lookup, so it can run
// straight after JwtAuthGuard. `isPlatformAdmin` comes from AUTH_USER_SELECT,
// which JwtStrategy re-reads from the database on every request.
@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();

    if (!req.user?.isPlatformAdmin) {
      throw new ForbiddenException(PLATFORM_ADMIN_ONLY);
    }

    return true;
  }
}
