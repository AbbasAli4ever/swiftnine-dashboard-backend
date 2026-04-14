import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { AuthUser, GoogleAuthProfile } from './auth.service';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
type GoogleAuthenticatedRequest = Request & {
    user: GoogleAuthProfile;
};
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<AuthResponseDto>;
    login(req: AuthenticatedRequest, res: Response): Promise<AuthResponseDto>;
    googleAuth(): void;
    googleCallback(req: GoogleAuthenticatedRequest, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<AuthResponseDto>;
    logout(req: Request, res: Response): Promise<void>;
    forgotPassword(dto: ForgotPasswordDto): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    protected setRefreshCookie(res: Response, token: string): void;
    protected clearRefreshCookie(res: Response): void;
}
export {};
