import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import type { AuthUser } from './auth.service';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<AuthResponseDto>;
    login(req: AuthenticatedRequest, res: Response): Promise<AuthResponseDto>;
    protected setRefreshCookie(res: Response, token: string): void;
}
export {};
