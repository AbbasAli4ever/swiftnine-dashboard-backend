import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ACCESS_TOKEN_EXPIRED_MESSAGE,
  AUTHENTICATION_REQUIRED_MESSAGE,
  INVALID_ACCESS_TOKEN_MESSAGE,
} from '../auth.constants';
import type { AuthUser } from '../auth.service';

type AuthFailureInfo = {
  message?: string;
  name?: string;
};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = AuthUser>(
    err: unknown,
    user: TUser | false | null | undefined,
    info?: AuthFailureInfo,
  ): TUser {
    if (user) {
      return user;
    }

    if (err instanceof UnauthorizedException) {
      throw err;
    }

    const failure = this.getFailureInfo(err, info);

    if (this.isMissingTokenError(failure)) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    if (failure?.name === 'TokenExpiredError') {
      throw new UnauthorizedException(ACCESS_TOKEN_EXPIRED_MESSAGE);
    }

    throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
  }

  private isMissingTokenError(info?: AuthFailureInfo): boolean {
    return Boolean(
      info?.message &&
      /No auth token|No authorization token/i.test(info.message),
    );
  }

  private getFailureInfo(
    err: unknown,
    info?: AuthFailureInfo,
  ): AuthFailureInfo | undefined {
    if (info?.message || info?.name) {
      return info;
    }

    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }

    return undefined;
  }
}
