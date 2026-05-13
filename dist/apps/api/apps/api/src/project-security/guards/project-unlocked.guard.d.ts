import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ProjectSecurityService } from '../project-security.service';
export declare class ProjectUnlockedGuard implements CanActivate {
    private readonly security;
    constructor(security: ProjectSecurityService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
