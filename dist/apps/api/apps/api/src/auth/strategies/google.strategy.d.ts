import { ConfigService } from '@nestjs/config';
import { Strategy, type Profile } from 'passport-google-oauth20';
import type { GoogleAuthProfile } from '../auth.service';
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor(config: ConfigService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<GoogleAuthProfile>;
    private extractVerifiedEmail;
    private extractFullName;
    private extractAvatarUrl;
}
export {};
