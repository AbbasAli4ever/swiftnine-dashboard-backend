"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_1 = require("../../../../libs/database/src");
const common_2 = require("../../../../libs/common/src");
const bcrypt = __importStar(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
const auth_constants_1 = require("./auth.constants");
const PASSWORD_SALT_ROUNDS = 10;
const INVALID_PASSWORD_SENTINEL_HASH = '$2b$10$Cpe5hcMUx8Lu80OFuFzGs.zvfGbrX44sec3nfV9UJobelf8reAm2q';
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwt;
    email;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwt, email) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.email = email;
    }
    async register(dto) {
        const normalizedEmail = this.normalizeEmail(dto.email);
        const existingUser = await this.prisma.user.findFirst({
            where: { email: normalizedEmail, deletedAt: null },
            select: { id: true, isEmailVerified: true },
        });
        if (existingUser) {
            if (existingUser.isEmailVerified) {
                throw new common_1.ConflictException('Email already in use');
            }
            await this.sendVerificationOtp(existingUser.id, normalizedEmail, dto.fullName.trim());
            return { message: auth_constants_1.EMAIL_ALREADY_REGISTERED_MESSAGE };
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
    async verifyEmail(email, otp) {
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
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_OTP_MESSAGE);
        }
        const user = await this.prisma.$transaction(async (tx) => {
            await tx.emailVerificationToken.delete({ where: { id: stored.id } });
            return tx.user.update({
                where: { id: stored.userId },
                data: { isEmailVerified: true },
                select: auth_constants_1.AUTH_USER_SELECT,
            });
        });
        return this.issueTokens(user);
    }
    async validateUser(email, password) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.prisma.user.findFirst({
            where: { email: normalizedEmail, deletedAt: null },
            select: {
                ...auth_constants_1.AUTH_USER_SELECT,
                passwordHash: true,
                isEmailVerified: true,
            },
        });
        const passwordHash = user?.passwordHash ?? INVALID_PASSWORD_SENTINEL_HASH;
        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        if (!user?.passwordHash || !isPasswordValid) {
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        if (!user.isEmailVerified) {
            throw new common_1.ForbiddenException(auth_constants_1.EMAIL_NOT_VERIFIED_MESSAGE);
        }
        const { passwordHash: _h, isEmailVerified: _v, ...authUser } = user;
        return authUser;
    }
    async findActiveAuthUser(userId, email) {
        return this.prisma.user.findFirst({
            where: {
                id: userId,
                email: this.normalizeEmail(email),
                deletedAt: null,
                isEmailVerified: true,
            },
            select: auth_constants_1.AUTH_USER_SELECT,
        });
    }
    async login(user) {
        return this.issueTokens(user);
    }
    async handleGoogleAuth(profile) {
        const normalizedProfile = this.normalizeGoogleProfile(profile);
        await this.assertNoInactiveGoogleAccount(normalizedProfile);
        const existingGoogleUser = await this.prisma.user.findFirst({
            where: { googleId: normalizedProfile.googleId, deletedAt: null },
            select: { ...auth_constants_1.AUTH_USER_SELECT, googleId: true },
        });
        if (existingGoogleUser) {
            const syncedGoogleUser = await this.syncGoogleUser(existingGoogleUser, normalizedProfile);
            return this.issueTokens(syncedGoogleUser);
        }
        const existingEmailUser = await this.prisma.user.findFirst({
            where: { email: normalizedProfile.email, deletedAt: null },
            select: { ...auth_constants_1.AUTH_USER_SELECT, googleId: true },
        });
        if (existingEmailUser) {
            if (existingEmailUser.googleId &&
                existingEmailUser.googleId !== normalizedProfile.googleId) {
                throw new common_1.ConflictException(auth_constants_1.GOOGLE_ACCOUNT_CONFLICT_MESSAGE);
            }
            const linkedUser = await this.prisma.user.update({
                where: { id: existingEmailUser.id },
                data: {
                    googleId: normalizedProfile.googleId,
                    isEmailVerified: true,
                    avatarUrl: !existingEmailUser.avatarUrl && normalizedProfile.avatarUrl
                        ? normalizedProfile.avatarUrl
                        : undefined,
                },
                select: auth_constants_1.AUTH_USER_SELECT,
            });
            return this.issueTokens(linkedUser);
        }
        const createdUser = await this.prisma.user.create({
            data: {
                googleId: normalizedProfile.googleId,
                email: normalizedProfile.email,
                fullName: normalizedProfile.fullName ??
                    normalizedProfile.email.split('@')[0] ??
                    'Google User',
                avatarUrl: normalizedProfile.avatarUrl,
                isEmailVerified: true,
            },
            select: auth_constants_1.AUTH_USER_SELECT,
        });
        return this.issueTokens(createdUser);
    }
    async refreshTokens(rawToken) {
        const tokenHash = this.hashToken(rawToken);
        const stored = await this.prisma.refreshToken.findFirst({
            where: { tokenHash, isRevoked: false, expiresAt: { gt: new Date() } },
            select: { id: true, userId: true },
        });
        if (!stored) {
            this.logger.warn(`Refresh token rejected: ${JSON.stringify({
                tokenHashPrefix: tokenHash.slice(0, 12),
                reason: 'token_not_found_or_expired',
            })}`);
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_REFRESH_TOKEN_MESSAGE);
        }
        const user = await this.prisma.user.findFirst({
            where: { id: stored.userId, deletedAt: null },
            select: auth_constants_1.AUTH_USER_SELECT,
        });
        if (!user) {
            this.logger.warn(`Refresh token rejected: ${JSON.stringify({
                tokenHashPrefix: tokenHash.slice(0, 12),
                userId: stored.userId,
                reason: 'user_not_found_or_inactive',
            })}`);
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_REFRESH_TOKEN_MESSAGE);
        }
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
        return this.issueTokens(user);
    }
    async logout(rawToken) {
        await this.prisma.refreshToken.deleteMany({
            where: { tokenHash: this.hashToken(rawToken) },
        });
    }
    async forgotPassword(email) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.prisma.user.findFirst({
            where: { email: normalizedEmail, deletedAt: null },
            select: { id: true, fullName: true, passwordHash: true },
        });
        if (!user || !user.passwordHash)
            return;
        const rawToken = (0, node_crypto_1.randomUUID)();
        const tokenHash = this.hashToken(rawToken);
        await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(Date.now() + auth_constants_1.RESET_TOKEN_TTL_MS),
            },
        });
        const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
        await this.email.sendPasswordResetEmail(normalizedEmail, user.fullName, resetUrl);
    }
    async resetPassword(token, newPassword) {
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
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_RESET_TOKEN_MESSAGE);
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
    async issueTokens(user) {
        const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });
        const rawRefreshToken = (0, node_crypto_1.randomUUID)();
        const tokenHash = this.hashToken(rawRefreshToken);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(Date.now() + auth_constants_1.REFRESH_TOKEN_TTL_MS),
            },
        });
        return { user, accessToken, refreshToken: rawRefreshToken };
    }
    async sendVerificationOtp(userId, email, fullName) {
        const otp = this.generateOtp();
        const otpHash = this.hashOtp(otp);
        await this.prisma.emailVerificationToken.deleteMany({ where: { userId } });
        await this.prisma.emailVerificationToken.create({
            data: {
                userId,
                otpHash,
                expiresAt: new Date(Date.now() + auth_constants_1.VERIFICATION_OTP_TTL_MS),
            },
        });
        await this.email.sendOtpEmail(email, fullName, otp);
    }
    generateOtp() {
        return (0, node_crypto_1.randomInt)(100000, 1000000).toString();
    }
    hashOtp(otp) {
        return (0, node_crypto_1.createHash)('sha256').update(otp).digest('hex');
    }
    hashToken(rawToken) {
        return (0, node_crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    normalizeGoogleProfile(profile) {
        const googleId = profile.googleId.trim();
        const email = this.normalizeEmail(profile.email);
        const fullName = profile.fullName?.trim() || null;
        const avatarUrl = profile.avatarUrl?.trim() || null;
        if (!googleId || !email) {
            throw new common_1.UnauthorizedException(auth_constants_1.GOOGLE_EMAIL_REQUIRED_MESSAGE);
        }
        return { googleId, email, fullName, avatarUrl };
    }
    async assertNoInactiveGoogleAccount(profile) {
        const inactiveUser = await this.prisma.user.findFirst({
            where: {
                deletedAt: { not: null },
                OR: [{ googleId: profile.googleId }, { email: profile.email }],
            },
            select: { id: true },
        });
        if (inactiveUser) {
            throw new common_1.ConflictException(auth_constants_1.INACTIVE_ACCOUNT_MESSAGE);
        }
    }
    async syncGoogleUser(user, profile) {
        const updateData = {};
        if (user.email !== profile.email) {
            const conflictingEmailUser = await this.prisma.user.findFirst({
                where: { email: profile.email, deletedAt: null, id: { not: user.id } },
                select: { id: true },
            });
            if (conflictingEmailUser) {
                throw new common_1.ConflictException(auth_constants_1.GOOGLE_ACCOUNT_CONFLICT_MESSAGE);
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
            select: auth_constants_1.AUTH_USER_SELECT,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, common_2.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map