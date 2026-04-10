import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/database';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { RegisterDto } from './dto/register.dto';

// Must stay in sync with JWT_REFRESH_EXPIRES_IN env var
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d

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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
      },
    });

    return this.issueTokens(user as AuthUser);
  }

  // Shared by register, login, and Google OAuth
  async issueTokens(user: AuthUser): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    const rawRefreshToken = randomUUID();
    const tokenHash = await bcrypt.hash(rawRefreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return { user, accessToken, refreshToken: rawRefreshToken };
  }
}
