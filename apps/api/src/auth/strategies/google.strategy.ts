import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-google-oauth20';
import { GOOGLE_EMAIL_REQUIRED_MESSAGE } from '../auth.constants';
import type { GoogleAuthProfile } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<GoogleAuthProfile> {
    const email = this.extractVerifiedEmail(profile);

    if (!email) {
      throw new UnauthorizedException(GOOGLE_EMAIL_REQUIRED_MESSAGE);
    }

    return {
      googleId: profile.id,
      email,
      fullName: this.extractFullName(profile),
      avatarUrl: this.extractAvatarUrl(profile),
    };
  }

  private extractVerifiedEmail(profile: Profile): string | null {
    const verifiedProfileEmail = profile.emails?.find(
      (email) => email.verified,
    );

    if (verifiedProfileEmail?.value) {
      return verifiedProfileEmail.value.trim().toLowerCase();
    }

    if (profile._json.email && profile._json.email_verified) {
      return profile._json.email.trim().toLowerCase();
    }

    return null;
  }

  private extractFullName(profile: Profile): string | null {
    const candidates = [
      profile.displayName,
      profile._json.name,
      [profile._json.given_name, profile._json.family_name]
        .filter((value): value is string => Boolean(value?.trim()))
        .join(' '),
    ];

    const fullName = candidates.find((value): value is string =>
      Boolean(value?.trim()),
    );

    return fullName?.trim() || null;
  }

  private extractAvatarUrl(profile: Profile): string | null {
    const avatarUrl =
      profile.photos?.[0]?.value ?? profile._json.picture ?? null;
    return avatarUrl?.trim() || null;
  }
}
