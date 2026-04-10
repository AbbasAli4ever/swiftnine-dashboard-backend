import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { RegisterDto } from './dto/register.dto';
import {
  AUTH_USER_SELECT,
  INVALID_CREDENTIALS_MESSAGE,
  REFRESH_TOKEN_TTL_MS,
} from './auth.constants';

const PASSWORD_SALT_ROUNDS = 10;
const INVALID_PASSWORD_SENTINEL_HASH =
  '$2b$10$Cpe5hcMUx8Lu80OFuFzGs.zvfGbrX44sec3nfV9UJobelf8reAm2q';

export type AuthUser = Prisma.UserGetPayload<{
  select: typeof AUTH_USER_SELECT;
}>;

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
    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName.trim(),
        email: this.normalizeEmail(dto.email),
        passwordHash,
      },
      select: AUTH_USER_SELECT,
    });

    return this.issueTokens(user);
  }

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null,
      },
      select: {
        ...AUTH_USER_SELECT,
        passwordHash: true,
      },
    });

    const passwordHash = user?.passwordHash ?? INVALID_PASSWORD_SENTINEL_HASH;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!user?.passwordHash || !isPasswordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const { passwordHash: _passwordHash, ...authUser } = user;
    return authUser;
  }

  async findActiveAuthUser(
    userId: string,
    email: string,
  ): Promise<AuthUser | null> {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        email: this.normalizeEmail(email),
        deletedAt: null,
      },
      select: AUTH_USER_SELECT,
    });
  }

  async login(user: AuthUser): Promise<TokenPair> {
    return this.issueTokens(user);
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

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
