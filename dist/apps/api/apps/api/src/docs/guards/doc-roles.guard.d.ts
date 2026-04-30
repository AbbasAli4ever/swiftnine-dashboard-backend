import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { DocRole } from '@app/database/generated/prisma/client';
import { PrismaService } from '@app/database';
import { DocPermissionsService } from '../doc-permissions.service';
export declare const DOC_ROLE_KEY = "docRole";
export declare const RequireDocRole: (role: DocRole) => any;
export declare class DocRolesGuard implements CanActivate {
    private readonly reflector;
    private readonly prisma;
    private readonly permissions;
    constructor(reflector: Reflector, prisma: PrismaService, permissions: DocPermissionsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
