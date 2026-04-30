import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '@app/database';
export declare class WorkspaceGuard implements CanActivate {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getHeaderValue;
}
