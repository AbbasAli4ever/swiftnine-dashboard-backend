import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

// Duck-type Prisma errors without importing from the generated client
function isPrismaError(
  err: unknown,
): err is { code: string; meta?: Record<string, unknown> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as Record<string, unknown>)['code'] === 'string' &&
    ((err as Record<string, unknown>)['code'] as string).startsWith('P')
  );
}

function mapPrismaError(err: {
  code: string;
  meta?: Record<string, unknown>;
}): { statusCode: number; message: string } {
  switch (err.code) {
    case 'P2002': {
      const target = err.meta?.['target'];
      const field = Array.isArray(target) ? target.join(', ') : 'field';
      return { statusCode: HttpStatus.CONFLICT, message: `${field} already exists` };
    }
    case 'P2025':
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Record not found' };
    case 'P2003':
      return { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid reference: related record not found' };
    default:
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Database error' };
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // 1. Zod validation errors from nestjs-zod pipe → 422
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as { issues: Array<{ path: (string | number)[]; message: string }> };
      const errors = zodError.issues.map((e) => ({
        field: e.path.join('.') || 'value',
        message: e.message,
      }));
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // 2. Raw ZodError (manual throws inside services) → 422
    if (exception instanceof ZodError) {
      const errors = (exception.issues as Array<{ path: (string | number)[]; message: string }>).map((e) => ({
        field: e.path.join('.') || 'value',
        message: e.message,
      }));
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // 3. Prisma known errors → mapped HTTP codes
    if (isPrismaError(exception)) {
      const { statusCode, message } = mapPrismaError(exception);
      if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(`Prisma error ${(exception as { code: string }).code}`, exception);
      }
      res.status(statusCode).json({ statusCode, message });
      return;
    }

    // 4. NestJS HttpException (guards, pipes, manual throws) → pass through
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : (body as Record<string, unknown>)['message'] ?? exception.message;
      res.status(statusCode).json({ statusCode, message });
      return;
    }

    // 5. Anything else → 500, hide internals
    this.logger.error(
      `Unhandled exception on ${req.method} ${req.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
