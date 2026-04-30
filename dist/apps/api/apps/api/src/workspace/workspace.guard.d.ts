import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from "../../../../libs/database/src";
export declare class WorkspaceGuard implements CanActivate {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getHeaderValue;
}
