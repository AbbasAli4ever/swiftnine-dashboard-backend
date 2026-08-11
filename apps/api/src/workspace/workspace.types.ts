import type { Role, UserRole } from '@app/database/generated/prisma/client';
import type { AuthUser } from '../auth/auth.service';
import type { Request } from 'express';

export type WorkspaceContext = {
  workspaceId: string;
  role: Role;
  accountingRole: UserRole | null;
};

export type WorkspaceRequest = Request & {
  user: AuthUser;
  workspaceContext: WorkspaceContext;
};
