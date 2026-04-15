import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/database';
import { EmailService } from '@app/common';
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
  INVALID_RESET_TOKEN_MESSAGE,
  REFRESH_TOKEN_TTL_MS,
  RESET_TOKEN_TTL_MS,
  VERIFICATION_OTP_TTL_MS,
  EMAIL_NOT_VERIFIED_MESSAGE,
  EMAIL_ALREADY_REGISTERED_MESSAGE,
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}

  // ─── Register ────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const normalizedEmail = this.normalizeEmail(dto.email);

    const existingUser = await this.prisma.user.findFirst({
      where: { email: normalizedEmail, deletedAt: null },
      select: { id: true, isEmailVerified: true },
    });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new ConflictException('Email already in use');
      }

      // Unverified: resend OTP, don't create a new user
      await this.sendVerificationOtp(existingUser.id, normalizedEmail, dto.fullName.trim());
      return { message: EMAIL_ALREADY_REGISTERED_MESSAGE };
    }

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        isEmailVerified: false,
      },
      select: { id: true, fullName: true },
    });

    await this.sendVerificationOtp(user.id, normalizedEmail, user.fullName);

    return { message: 'Account created. Check your email for the verification code.' };
  }

  async verifyEmail(email: string, otp: string): Promise<TokenPair> {
    const normalizedEmail = this.normalizeEmail(email);
    const otpHash = this.hashOtp(otp);

    const stored = await this.prisma.emailVerificationToken.findFirst({
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

    const user = await this.prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.delete({ where: { id: stored.id } });

      return tx.user.update({
        where: { id: stored.userId },
        data: { isEmailVerified: true },
        select: AUTH_USER_SELECT,
      });
    });

    return this.issueTokens(user);
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.prisma.user.findFirst({
      where: { email: normalizedEmail, deletedAt: null },
      select: {
        ...AUTH_USER_SELECT,
        passwordHash: true,
        isEmailVerified: true,
      },
    });

    const passwordHash = user?.passwordHash ?? INVALID_PASSWORD_SENTINEL_HASH;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!user?.passwordHash || !isPasswordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(EMAIL_NOT_VERIFIED_MESSAGE);
    }

    const { passwordHash: _h, isEmailVerified: _v, ...authUser } = user;
    return authUser;
  }

  async findActiveAuthUser(userId: string, email: string): Promise<AuthUser | null> {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        email: this.normalizeEmail(email),
        deletedAt: null,
        isEmailVerified: true,
      },
      select: AUTH_USER_SELECT,
    });
  }

  async login(user: AuthUser): Promise<TokenPair> {
    return this.issueTokens(user);
  }

  // ─── Google OAuth ────────────────────────────────────────────────────────────

  async handleGoogleAuth(profile: GoogleAuthProfile): Promise<TokenPair> {
    const normalizedProfile = this.normalizeGoogleProfile(profile);

    await this.assertNoInactiveGoogleAccount(normalizedProfile);

    const existingGoogleUser = await this.prisma.user.findFirst({
      where: { googleId: normalizedProfile.googleId, deletedAt: null },
      select: { ...AUTH_USER_SELECT, googleId: true },
    });

    if (existingGoogleUser) {
      const syncedGoogleUser = await this.syncGoogleUser(existingGoogleUser, normalizedProfile);
      return this.issueTokens(syncedGoogleUser);
    }

    const existingEmailUser = await this.prisma.user.findFirst({
      where: { email: normalizedProfile.email, deletedAt: null },
      select: { ...AUTH_USER_SELECT, googleId: true },
    });

    if (existingEmailUser) {
      if (
        existingEmailUser.googleId &&
        existingEmailUser.googleId !== normalizedProfile.googleId
      ) {
        throw new ConflictException(GOOGLE_ACCOUNT_CONFLICT_MESSAGE);
      }

      const linkedUser = await this.prisma.user.update({
        where: { id: existingEmailUser.id },
        data: {
          googleId: normalizedProfile.googleId,
          isEmailVerified: true, // Google already verified
          avatarUrl:
            !existingEmailUser.avatarUrl && normalizedProfile.avatarUrl
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
        isEmailVerified: true, // Google already verified
      },
      select: AUTH_USER_SELECT,
    });

    return this.issueTokens(createdUser);
  }

  // ─── Token refresh / logout ──────────────────────────────────────────────────

  async refreshTokens(rawToken: string): Promise<TokenPair> {
    const tokenHash = this.hashToken(rawToken);

    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, isRevoked: false, expiresAt: { gt: new Date() } },
      select: { id: true, userId: true },
    });

    if (!stored) {
      this.logger.warn(
        `Refresh token rejected: ${JSON.stringify({
          tokenHashPrefix: tokenHash.slice(0, 12),
          reason: 'token_not_found_or_expired',
        })}`,
      );
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    const user = await this.prisma.user.findFirst({
      where: { id: stored.userId, deletedAt: null },
      select: AUTH_USER_SELECT,
    });

    if (!user) {
      this.logger.warn(
        `Refresh token rejected: ${JSON.stringify({
          tokenHashPrefix: tokenHash.slice(0, 12),
          userId: stored.userId,
          reason: 'user_not_found_or_inactive',
        })}`,
      );
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.issueTokens(user);
  }

  async logout(rawToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash: this.hashToken(rawToken) },
    });
  }

  // ─── Forgot / reset password ─────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);

    const user = await this.prisma.user.findFirst({
      where: { email: normalizedEmail, deletedAt: null },
      select: { id: true, fullName: true, passwordHash: true },
    });

    // Silent return: don't reveal whether email exists or is Google-only
    if (!user || !user.passwordHash) return;

    const rawToken = randomUUID();
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    await this.email.sendPasswordResetEmail(normalizedEmail, user.fullName, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    const stored = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
        user: { deletedAt: null },
      },
      select: { id: true, userId: true },
    });

    if (!stored) {
      throw new UnauthorizedException(INVALID_RESET_TOKEN_MESSAGE);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: stored.userId },
        data: { passwordHash: newPasswordHash },
      }),
      this.prisma.passwordResetToken.delete({ where: { id: stored.id } }),
      this.prisma.refreshToken.deleteMany({ where: { userId: stored.userId } }),
    ]);
  }

  // ─── Shared ───────────────────────────────────────────────────────────────────

  async issueTokens(user: AuthUser): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });

    const rawRefreshToken = randomUUID();
    const tokenHash = this.hashToken(rawRefreshToken);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return { user, accessToken, refreshToken: rawRefreshToken };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private async sendVerificationOtp(userId: string, email: string, fullName: string): Promise<void> {
    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);

    await this.prisma.emailVerificationToken.deleteMany({ where: { userId } });

    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        otpHash,
        expiresAt: new Date(Date.now() + VERIFICATION_OTP_TTL_MS),
      },
    });

    await this.email.sendOtpEmail(email, fullName, otp);
  }

  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeGoogleProfile(profile: GoogleAuthProfile): GoogleAuthProfile {
    const googleId = profile.googleId.trim();
    const email = this.normalizeEmail(profile.email);
    const fullName = profile.fullName?.trim() || null;
    const avatarUrl = profile.avatarUrl?.trim() || null;

    if (!googleId || !email) {
      throw new UnauthorizedException(GOOGLE_EMAIL_REQUIRED_MESSAGE);
    }

    return { googleId, email, fullName, avatarUrl };
  }

  private async assertNoInactiveGoogleAccount(profile: GoogleAuthProfile): Promise<void> {
    const inactiveUser = await this.prisma.user.findFirst({
      where: {
        deletedAt: { not: null },
        OR: [{ googleId: profile.googleId }, { email: profile.email }],
      },
      select: { id: true },
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
        where: { email: profile.email, deletedAt: null, id: { not: user.id } },
        select: { id: true },
      });

      if (conflictingEmailUser) {
        throw new ConflictException(GOOGLE_ACCOUNT_CONFLICT_MESSAGE);
      }

      updateData.email = profile.email;
    }

    if (!user.avatarUrl && profile.avatarUrl && profile.avatarUrl !== user.avatarUrl) {
      updateData.avatarUrl = profile.avatarUrl;
    }

    if (Object.keys(updateData).length === 0) {
      const { googleId: _googleId, ...authUser } = user;
      return authUser;
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: AUTH_USER_SELECT,
    });
  }
}
