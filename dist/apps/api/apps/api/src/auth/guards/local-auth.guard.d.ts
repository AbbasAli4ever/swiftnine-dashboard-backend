import { ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../auth.service';
declare const LocalAuthGuard_base: any;
export declare class LocalAuthGuard extends LocalAuthGuard_base {
    canActivate(context: ExecutionContext): any;
    handleRequest<TUser = AuthUser>(err: unknown, user: TUser | false | null | undefined, info?: {
        message?: string;
    }): TUser;
}
export {};
