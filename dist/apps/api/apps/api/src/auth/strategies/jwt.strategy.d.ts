import { ConfigService } from '@nestjs/config';
import { AuthService, type AuthUser } from '../auth.service';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(config: ConfigService, authService: AuthService);
    validate(payload: unknown): Promise<AuthUser>;
}
export {};
