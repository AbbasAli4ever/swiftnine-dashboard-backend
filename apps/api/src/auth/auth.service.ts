import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt, randomUUID } from 'node:crypto';
import { RegisterDto } from './dto/register.dto';
import {
  GOOGLE_ACCOUNT_CONFLICT_MESSAGE,
  GOOGLE_EMAIL_REQUIRED_MESSAGE,
  INACTIVE_ACCOUNT_MESSAGE,
  AUTH_USER_SELECT,
  INVALID_CREDENTIALS_MESSAGE,
  INVALID_OTP_MESSAGE,
  INVALID_REFRESH_TOKEN_MESSAGE,
  REFRESH_TOKEN_TTL_MS,
  RESET_OTP_TTL_MS,
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

export type GoogleAuthProfile = {
  googleId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
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

  async handleGoogleAuth(profile: GoogleAuthProfile): Promise<TokenPair> {
    const normalizedProfile = this.normalizeGoogleProfile(profile);

    await this.assertNoInactiveGoogleAccount(normalizedProfile);

    const existingGoogleUser = await this.prisma.user.findFirst({
      where: {
        googleId: normalizedProfile.googleId,
        deletedAt: null,
      },
      select: {
        ...AUTH_USER_SELECT,
        googleId: true,
      },
    });

    if (existingGoogleUser) {
      const syncedGoogleUser = await this.syncGoogleUser(
        existingGoogleUser,
        normalizedProfile,
      );

      return this.issueTokens(syncedGoogleUser);
    }

    const existingEmailUser = await this.prisma.user.findFirst({
      where: {
        email: normalizedProfile.email,
        deletedAt: null,
      },
      select: {
        ...AUTH_USER_SELECT,
        googleId: true,
      },
    });

    if (existingEmailUser) {
      if (
        existingEmailUser.googleId &&
        existingEmailUser.googleId !== normalizedProfile.googleId
      ) {
        throw new ConflictException(GOOGLE_ACCOUNT_CONFLICT_MESSAGE);
      }

      const linkedUser = await this.prisma.user.update({
        where: {
          id: existingEmailUser.id,
        },
        data: {
          googleId: normalizedProfile.googleId,
          avatarUrl:
            !existingEmailUser.avatarUrl &&
            normalizedProfile.avatarUrl &&
            normalizedProfile.avatarUrl !== existingEmailUser.avatarUrl
              ? normalizedProfile.avatarUrl
              : undefined,
        },
        select: AUTH_USER_SELECT,
      });

      return this.issueTokens(linkedUser);
    }

    const createdUser = await this.prisma.user.create({
      data: {
        googleId: normalizedProfile.googleId,
        email: normalizedProfile.email,
        fullName:
          normalizedProfile.fullName ??
          normalizedProfile.email.split('@')[0] ??
          'Google User',
        avatarUrl: normalizedProfile.avatarUrl,
      },
      select: AUTH_USER_SELECT,
    });

    return this.issueTokens(createdUser);
  }

  async refreshTokens(rawToken: string): Promise<TokenPair> {
    const tokenHash = this.hashRefreshToken(rawToken);

    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, userId: true },
    });

    if (!stored) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    const user = await this.prisma.user.findFirst({
      where: { id: stored.userId, deletedAt: null },
      select: AUTH_USER_SELECT,
    });

    if (!user) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    // Rotate: delete old token then issue fresh pair atomically
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.issueTokens(user);
  }

  async logout(rawToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        tokenHash: this.hashRefreshToken(rawToken),
      },
    });
  }

  // Shared by register, login, and Google OAuth
  async issueTokens(user: AuthUser): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    const rawRefreshToken = randomUUID();
    const tokenHash = this.hashRefreshToken(rawRefreshToken);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return { user, accessToken, refreshToken: rawRefreshToken };
  }

  async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);

    const user = await this.prisma.user.findFirst({
      where: { email: normalizedEmail, deletedAt: null },
      select: { id: true, passwordHash: true },
    });

    // Silent return: don't reveal whether the email exists or is Google-only
    if (!user || !user.passwordHash) return;

    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);

    // Replace any existing OTP for this user (one active OTP at a time)
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt: new Date(Date.now() + RESET_OTP_TTL_MS),
      },
    });

    // TODO: replace with Resend email
    console.log(`[ForgotPassword] OTP for ${normalizedEmail}: ${otp}`);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);
    const otpHash = this.hashOtp(otp);

    const stored = await this.prisma.passwordResetToken.findFirst({
      where: {
        otpHash,
        expiresAt: { gt: new Date() },
        user: { email: normalizedEmail, deletedAt: null },
      },
      select: { id: true, userId: true },
    });

    if (!stored) {
      throw new UnauthorizedException(INVALID_OTP_MESSAGE);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);

    await this.prisma.$transaction([
      // Update password
      this.prisma.user.update({
        where: { id: stored.userId },
        data: { passwordHash: newPasswordHash },
      }),
      // Consume the OTP
      this.prisma.passwordResetToken.delete({ where: { id: stored.id } }),
      // Force logout from all sessions
      this.prisma.refreshToken.deleteMany({ where: { userId: stored.userId } }),
    ]);
  }

  private generateOtp(): string {
    // randomInt(min, max) is exclusive of max, so 1000000 gives range 100000–999999
    return randomInt(100000, 1000000).toString();
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  private hashRefreshToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeGoogleProfile(
    profile: GoogleAuthProfile,
  ): GoogleAuthProfile {
    const googleId = profile.googleId.trim();
    const email = this.normalizeEmail(profile.email);
    const fullName = profile.fullName?.trim() || null;
    const avatarUrl = profile.avatarUrl?.trim() || null;

    if (!googleId || !email) {
      throw new UnauthorizedException(GOOGLE_EMAIL_REQUIRED_MESSAGE);
    }

    return {
      googleId,
      email,
      fullName,
      avatarUrl,
    };
  }

  private async assertNoInactiveGoogleAccount(
    profile: GoogleAuthProfile,
  ): Promise<void> {
    const inactiveUser = await this.prisma.user.findFirst({
      where: {
        deletedAt: {
          not: null,
        },
        OR: [
          {
            googleId: profile.googleId,
          },
          {
            email: profile.email,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (inactiveUser) {
      throw new ConflictException(INACTIVE_ACCOUNT_MESSAGE);
    }
  }

  private async syncGoogleUser(
    user: AuthUser & { googleId: string | null },
    profile: GoogleAuthProfile,
  ): Promise<AuthUser> {
    const updateData: Prisma.UserUpdateInput = {};

    if (user.email !== profile.email) {
      const conflictingEmailUser = await this.prisma.user.findFirst({
        where: {
          email: profile.email,
          deletedAt: null,
          id: {
            not: user.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (conflictingEmailUser) {
        throw new ConflictException(GOOGLE_ACCOUNT_CONFLICT_MESSAGE);
      }

      updateData.email = profile.email;
    }

    if (
      !user.avatarUrl &&
      profile.avatarUrl &&
      profile.avatarUrl !== user.avatarUrl
    ) {
      updateData.avatarUrl = profile.avatarUrl;
    }

    if (Object.keys(updateData).length === 0) {
      const { googleId: _googleId, ...authUser } = user;
      return authUser;
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
      select: AUTH_USER_SELECT,
    });
  }
}
