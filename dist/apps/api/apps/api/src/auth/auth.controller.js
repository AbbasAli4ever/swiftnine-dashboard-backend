"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const login_dto_1 = require("./dto/login.dto");
const google_auth_guard_1 = require("./guards/google-auth.guard");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const auth_constants_1 = require("./auth.constants");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto, res) {
        const { refreshToken, ...result } = await this.authService.register(dto);
        this.setRefreshCookie(res, refreshToken);
        return result;
    }
    async login(req, res) {
        const { refreshToken, ...result } = await this.authService.login(req.user);
        this.setRefreshCookie(res, refreshToken);
        return result;
    }
    googleAuth() { }
    async googleCallback(req, res) {
        const { refreshToken, ...result } = await this.authService.handleGoogleAuth(req.user);
        this.setRefreshCookie(res, refreshToken);
        return result;
    }
    setRefreshCookie(res, token) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: 'strict',
            maxAge: auth_constants_1.REFRESH_TOKEN_TTL_MS,
            path: '/api/v1/auth',
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Register with email & password',
        description: 'Creates a new account. Returns access token in body and sets refresh token as httpOnly cookie.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        type: auth_response_dto_1.AuthResponseDto,
        description: 'Account created, tokens issued',
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already in use' }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'Validation failed' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Login with email & password',
        description: 'Validates credentials. Returns access token in body and sets refresh token as httpOnly cookie.',
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: auth_response_dto_1.AuthResponseDto,
        description: 'Login successful, tokens issued',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid email or password' }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'Validation failed' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Start Google OAuth',
        description: 'Redirects the user to Google for authentication.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redirect to Google consent screen',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_auth_guard_1.GoogleAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle Google OAuth callback',
        description: 'Consumes the Google OAuth callback, issues tokens, and sets the refresh token cookie.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: auth_response_dto_1.AuthResponseDto,
        description: 'Google authentication successful, tokens issued',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Google account could not be authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Google account conflicts with an existing or inactive account',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map