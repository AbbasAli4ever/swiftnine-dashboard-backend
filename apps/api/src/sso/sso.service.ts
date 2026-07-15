import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';
import type { AuthUser } from '../auth/auth.service';

@Injectable()
export class SsoService {
  private readonly logger = new Logger(SsoService.name);

  constructor(private readonly config: ConfigService) {}

  mintOdooLoginToken(user: AuthUser): { token: string; redirectUrl: string } {
    const secret = this.config.getOrThrow<string>('SSO_ODOO_JWT_SECRET');
    const issuer = this.config.getOrThrow<string>('SSO_ODOO_JWT_ISSUER');
    const audience = this.config.getOrThrow<string>('SSO_ODOO_JWT_AUDIENCE');
    const redirectBaseUrl = this.config.getOrThrow<string>(
      'SSO_ODOO_REDIRECT_BASE_URL',
    );

    const jti = randomUUID();

    // iss/aud/jti/exp are passed as sign options, not payload fields — jsonwebtoken
    // throws if a claim is set both ways (e.g. "options.issuer" + payload.iss).
    const token = sign(
      {
        sub: user.id,
        email: user.email,
        name: user.fullName,
      },
      secret,
      {
        algorithm: 'HS256',
        expiresIn: '60s',
        issuer,
        audience,
        jwtid: jti,
      },
    );

    this.logger.log(`sso.mint jti=${jti} userId=${user.id}`);

    return {
      token,
      redirectUrl: `${redirectBaseUrl}?token=${token}`,
    };
  }
}
