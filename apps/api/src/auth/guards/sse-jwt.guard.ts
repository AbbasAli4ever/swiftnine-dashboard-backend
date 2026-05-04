import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { ACCESS_TOKEN_EXPIRED_MESSAGE } from '../auth.constants';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class SseJwtGuard extends JwtAuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await (super.canActivate(context) as Promise<boolean>);
    } catch (err) {
      if (
        err instanceof UnauthorizedException &&
        err.message === ACCESS_TOKEN_EXPIRED_MESSAGE
      ) {
        const res = context.switchToHttp().getResponse<Response>();
        if (!res.writableEnded) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          // Large retry delay so browser EventSource doesn't spam reconnects;
          // the client should handle auth_error, refresh the token, and reconnect.
          res.write('retry: 86400000\n');
          res.write('event: auth_error\n');
          res.write(
            `data: ${JSON.stringify({ code: 'TOKEN_EXPIRED', message: ACCESS_TOKEN_EXPIRED_MESSAGE })}\n\n`,
          );
          res.end();
        }
      }
      throw err;
    }
  }
}
