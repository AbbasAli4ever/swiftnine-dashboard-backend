"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
function isPrismaError(err) {
    return (typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        typeof err['code'] === 'string' &&
        err['code'].startsWith('P'));
}
function mapPrismaError(err) {
    switch (err.code) {
        case 'P2002': {
            const target = err.meta?.['target'];
            const field = Array.isArray(target) ? target.join(', ') : 'field';
            return { statusCode: common_1.HttpStatus.CONFLICT, message: `${field} already exists` };
        }
        case 'P2025':
            return { statusCode: common_1.HttpStatus.NOT_FOUND, message: 'Record not found' };
        case 'P2003':
            return { statusCode: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid reference: related record not found' };
        default:
            return { statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR, message: 'Database error' };
    }
}
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        if (res.headersSent)
            return;
        if (exception instanceof nestjs_zod_1.ZodValidationException) {
            const zodError = exception.getZodError();
            const errors = zodError.issues.map((e) => ({
                field: e.path.join('.') || 'value',
                message: e.message,
            }));
            res.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY).json({
                statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                message: 'Validation failed',
                errors,
            });
            return;
        }
        if (exception instanceof zod_1.ZodError) {
            const errors = exception.issues.map((e) => ({
                field: e.path.join('.') || 'value',
                message: e.message,
            }));
            res.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY).json({
                statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                message: 'Validation failed',
                errors,
            });
            return;
        }
        if (isPrismaError(exception)) {
            const { statusCode, message } = mapPrismaError(exception);
            if (statusCode === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
                this.logger.error(`Prisma error ${exception.code}`, exception);
            }
            res.status(statusCode).json({ statusCode, message });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const statusCode = exception.getStatus();
            const body = exception.getResponse();
            const message = typeof body === 'string'
                ? body
                : body['message'] ?? exception.message;
            res.status(statusCode).json({ statusCode, message });
            return;
        }
        this.logger.error(`Unhandled exception on ${req.method} ${req.url}`, exception instanceof Error ? exception.stack : String(exception));
        res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map