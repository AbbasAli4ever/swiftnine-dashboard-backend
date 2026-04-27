import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../../../libs/database/src";
import { EmailService } from "../../../../libs/common/src";
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
import { RegisterDto } from './dto/register.dto';
import { AUTH_USER_SELECT } from './auth.constants';
export type AuthUser = Prisma.UserGetPayload<{
    select: typeof AUTH_USER_SELECT;
}>;
export type TokenPair = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
};
export type GoogleAuthProfile = {
    googleId: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
};
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly email;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService, email: EmailService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyEmail(email: string, otp: string): Promise<TokenPair>;
    validateUser(email: string, password: string): Promise<AuthUser>;
    findActiveAuthUser(userId: string, email: string): Promise<AuthUser | null>;
    login(user: AuthUser): Promise<TokenPair>;
    handleGoogleAuth(profile: GoogleAuthProfile): Promise<TokenPair>;
    refreshTokens(rawToken: string): Promise<TokenPair>;
    logout(rawToken: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    issueTokens(user: AuthUser): Promise<TokenPair>;
    private sendVerificationOtp;
    private generateOtp;
    private hashOtp;
    private hashToken;
    private normalizeEmail;
    private normalizeGoogleProfile;
    private assertNoInactiveGoogleAccount;
    private syncGoogleUser;
}
