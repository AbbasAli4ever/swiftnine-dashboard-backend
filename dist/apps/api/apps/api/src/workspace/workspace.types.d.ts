import type { Role } from "../../../../libs/database/src/generated/prisma/client";
import type { AuthUser } from '../auth/auth.service';
import type { Request } from 'express';
export type WorkspaceContext = {
    workspaceId: string;
    role: Role;
};
export type WorkspaceRequest = Request & {
    user: AuthUser;
    workspaceContext: WorkspaceContext;
};
