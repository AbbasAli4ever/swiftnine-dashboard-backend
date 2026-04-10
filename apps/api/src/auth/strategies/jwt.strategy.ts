import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ACCESS_TOKEN_PAYLOAD_SCHEMA,
  INVALID_ACCESS_TOKEN_MESSAGE,
  type AccessTokenPayload,
} from '../auth.constants';
import { AuthService, type AuthUser } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: unknown): Promise<AuthUser> {
    const parsedPayload = ACCESS_TOKEN_PAYLOAD_SCHEMA.safeParse(payload);

    if (!parsedPayload.success) {
      throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
    }

    const user = await this.authService.findActiveAuthUser(
      parsedPayload.data.sub,
      parsedPayload.data.email,
    );

    if (!user) {
      throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
    }

    return user;
  }
}
