import type { AuthUser } from '../auth.service';
type AuthFailureInfo = {
    message?: string;
    name?: string;
};
declare const JwtAuthGuard_base: any;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    handleRequest<TUser = AuthUser>(err: unknown, user: TUser | false | null | undefined, info?: AuthFailureInfo): TUser;
    private isMissingTokenError;
    private getFailureInfo;
}
export {};
