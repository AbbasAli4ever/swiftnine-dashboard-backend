import { ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../auth.service';
declare const LocalAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LocalAuthGuard extends LocalAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = AuthUser>(err: unknown, user: TUser | false | null | undefined, info?: {
        message?: string;
    }): TUser;
}
export {};
