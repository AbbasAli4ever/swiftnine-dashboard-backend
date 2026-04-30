import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { DocRole } from "../../../../../libs/database/src/generated/prisma/client";
import { PrismaService } from "../../../../../libs/database/src";
import { DocPermissionsService } from '../doc-permissions.service';
export declare const DOC_ROLE_KEY = "docRole";
export declare const RequireDocRole: (role: DocRole) => import("@nestjs/common").CustomDecorator<string>;
export declare class DocRolesGuard implements CanActivate {
    private readonly reflector;
    private readonly prisma;
    private readonly permissions;
    constructor(reflector: Reflector, prisma: PrismaService, permissions: DocPermissionsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
