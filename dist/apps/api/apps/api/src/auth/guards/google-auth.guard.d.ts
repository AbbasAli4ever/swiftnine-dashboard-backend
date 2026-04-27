import type { AuthenticateOptionsGoogle } from 'passport-google-oauth20';
declare const GoogleAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleAuthGuard extends GoogleAuthGuard_base {
    getAuthenticateOptions(): AuthenticateOptionsGoogle;
}
export {};
