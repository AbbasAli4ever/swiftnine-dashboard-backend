import { ConfigService } from '@nestjs/config';
import { type Profile } from 'passport-google-oauth20';
import type { GoogleAuthProfile } from '../auth.service';
declare const GoogleStrategy_base: any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor(config: ConfigService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<GoogleAuthProfile>;
    private extractVerifiedEmail;
    private extractFullName;
    private extractAvatarUrl;
}
export {};
