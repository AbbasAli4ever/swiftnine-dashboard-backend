import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../../../libs/database/src";
import { RegisterDto } from './dto/register.dto';
export type AuthUser = {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    avatarColor: string;
};
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
    issueTokens(user: AuthUser): Promise<TokenPair>;
}
