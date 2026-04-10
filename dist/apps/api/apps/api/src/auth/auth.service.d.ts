import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../../../libs/database/src";
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
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<TokenPair>;
    validateUser(email: string, password: string): Promise<AuthUser>;
    findActiveAuthUser(userId: string, email: string): Promise<AuthUser | null>;
    login(user: AuthUser): Promise<TokenPair>;
    issueTokens(user: AuthUser): Promise<TokenPair>;
    private normalizeEmail;
}
