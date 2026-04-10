import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Profile } from 'passport-google-oauth20';
import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(() => {
    strategy = new GoogleStrategy({
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          GOOGLE_CLIENT_ID: 'client-id',
          GOOGLE_CLIENT_SECRET: 'client-secret',
          GOOGLE_CALLBACK_URL:
            'http://localhost:3020/api/v1/auth/google/callback',
        };

        return values[key];
      }),
    } as unknown as ConfigService);
  });

  it('maps a valid Google profile into normalized auth profile data', async () => {
    const profile = {
      id: 'google-1',
      displayName: 'Jane Doe',
      provider: 'google',
      emails: [{ value: 'JANE@Example.com', verified: true }],
      photos: [{ value: 'https://example.com/avatar.png' }],
      _json: {
        iss: 'https://accounts.google.com',
        aud: 'client-id',
        sub: 'google-1',
        iat: 1,
        exp: 2,
      },
    } as unknown as Profile;

    await expect(strategy.validate('', '', profile)).resolves.toEqual({
      googleId: 'google-1',
      email: 'jane@example.com',
      fullName: 'Jane Doe',
      avatarUrl: 'https://example.com/avatar.png',
    });
  });

  it('falls back to the verified email in the Google id token payload', async () => {
    const profile = {
      id: 'google-1',
      displayName: '',
      provider: 'google',
      emails: [],
      photos: [],
      _json: {
        iss: 'https://accounts.google.com',
        aud: 'client-id',
        sub: 'google-1',
        iat: 1,
        exp: 2,
        email: 'fallback@example.com',
        email_verified: true,
        given_name: 'Jane',
      },
    } as unknown as Profile;

    await expect(strategy.validate('', '', profile)).resolves.toEqual({
      googleId: 'google-1',
      email: 'fallback@example.com',
      fullName: 'Jane',
      avatarUrl: null,
    });
  });

  it('rejects Google profiles without a verified email address', async () => {
    const profile = {
      id: 'google-1',
      displayName: 'Jane Doe',
      provider: 'google',
      emails: [{ value: 'jane@example.com', verified: false }],
      photos: [],
      _json: {
        iss: 'https://accounts.google.com',
        aud: 'client-id',
        sub: 'google-1',
        iat: 1,
        exp: 2,
        email: 'jane@example.com',
        email_verified: false,
      },
    } as unknown as Profile;

    await expect(strategy.validate('', '', profile)).rejects.toThrow(
      new UnauthorizedException(
        'Google account must provide a verified email address',
      ),
    );
  });
});
