import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { LoginSchema } from '../dto/login.dto';
import { INVALID_CREDENTIALS_MESSAGE } from '../auth.constants';
import type { AuthUser } from '../auth.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  override canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    LoginSchema.parse(request.body);

    return super.canActivate(context);
  }

  override handleRequest<TUser = AuthUser>(
    err: unknown,
    user: TUser | false | null | undefined,
    info?: { message?: string },
  ): TUser {
    if (err || !user) {
      throw err instanceof Error
        ? err
        : new UnauthorizedException(
            info?.message ?? INVALID_CREDENTIALS_MESSAGE,
          );
    }

    return user;
  }
}
