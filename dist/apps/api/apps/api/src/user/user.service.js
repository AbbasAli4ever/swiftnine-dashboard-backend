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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const bcrypt = __importStar(require("bcrypt"));
const profile_status_enum_1 = require("./dto/profile-status.enum");
const PASSWORD_SALT_ROUNDS = 10;
const USER_PROFILE_SELECT = {
    id: true,
    fullName: true,
    email: true,
    avatarUrl: true,
    designation: true,
    bio: true,
    timezone: true,
    isOnline: true,
    notificationPreferences: true,
    createdAt: true,
    updatedAt: true,
};
const USER_PASSWORD_SELECT = {
    id: true,
    passwordHash: true,
};
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProfile(userId, dto) {
        const existingUser = await this.findActiveUserOrThrow(userId);
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                designation: this.trimToNull(dto.designation),
                avatarUrl: dto.profilePicture !== undefined
                    ? this.normalizeProfilePicture(dto.profilePicture)
                    : `initials:${this.getInitials(existingUser.fullName)}`,
                isOnline: dto.status !== undefined
                    ? dto.status === profile_status_enum_1.UserPresenceStatus.ONLINE
                    : undefined,
                bio: this.trimToNull(dto.bio),
                timezone: this.normalizeTimezoneForCreate(dto.timezone),
                notificationPreferences: this.buildNotificationPreferences(existingUser.notificationPreferences, dto.showLocalTime ?? true),
            },
            select: USER_PROFILE_SELECT,
        });
        return this.toUserProfile(updatedUser);
    }
    async getProfile(userId) {
        const user = await this.findActiveUserOrThrow(userId);
        return this.toUserProfile(user);
    }
    async updateProfile(userId, dto) {
        const existingUser = await this.findActiveUserOrThrow(userId);
        const updateData = {};
        const nextFullName = dto.fullName !== undefined ? dto.fullName.trim() : existingUser.fullName;
        if (dto.fullName !== undefined) {
            updateData.fullName = nextFullName;
        }
        if (dto.designation !== undefined) {
            updateData.designation = this.trimToNull(dto.designation);
        }
        if (dto.profilePicture !== undefined) {
            updateData.avatarUrl = this.normalizeProfilePicture(dto.profilePicture);
        }
        else if (dto.fullName !== undefined &&
            this.usesInitialsAvatar(existingUser.avatarUrl)) {
            updateData.avatarUrl = `initials:${this.getInitials(nextFullName)}`;
        }
        if (dto.status !== undefined) {
            updateData.isOnline = dto.status === profile_status_enum_1.UserPresenceStatus.ONLINE;
        }
        if (dto.bio !== undefined) {
            updateData.bio = this.trimToNull(dto.bio);
        }
        if (dto.timezone !== undefined) {
            updateData.timezone = this.normalizeTimezoneForUpdate(dto.timezone);
        }
        if (dto.showLocalTime !== undefined) {
            updateData.notificationPreferences = this.buildNotificationPreferences(existingUser.notificationPreferences, dto.showLocalTime);
        }
        if (Object.keys(updateData).length === 0) {
            throw new common_1.BadRequestException('At least one profile field is required for update');
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: USER_PROFILE_SELECT,
        });
        return this.toUserProfile(updatedUser);
    }
    async updateStatus(userId, status) {
        await this.findActiveUserOrThrow(userId);
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isOnline: status === profile_status_enum_1.UserPresenceStatus.ONLINE,
                lastSeenAt: status === profile_status_enum_1.UserPresenceStatus.OFFLINE ? new Date() : undefined,
            },
            select: USER_PROFILE_SELECT,
        });
        return this.toUserProfile(updatedUser);
    }
    async deleteProfile(userId) {
        await this.findActiveUserOrThrow(userId);
        await this.prisma.$transaction([
            this.prisma.refreshToken.deleteMany({
                where: {
                    userId,
                },
            }),
            this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    deletedAt: new Date(),
                    isOnline: false,
                    lastSeenAt: new Date(),
                },
            }),
        ]);
    }
    async changePassword(userId, dto) {
        const user = await this.findActiveUserWithPasswordOrThrow(userId);
        if (!user.passwordHash) {
            throw new common_1.ForbiddenException('Password is not set for this account. Please use social login.');
        }
        const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.ForbiddenException('Current password is incorrect');
        }
        const isSamePassword = await bcrypt.compare(dto.newPassword, user.passwordHash);
        if (isSamePassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const newPasswordHash = await bcrypt.hash(dto.newPassword, PASSWORD_SALT_ROUNDS);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    passwordHash: newPasswordHash,
                },
            }),
            this.prisma.refreshToken.deleteMany({
                where: {
                    userId,
                },
            }),
        ]);
        return {
            message: 'Password changed successfully. Please login again.',
        };
    }
    async findActiveUserOrThrow(userId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null,
            },
            select: USER_PROFILE_SELECT,
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findActiveUserWithPasswordOrThrow(userId) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null,
            },
            select: USER_PASSWORD_SELECT,
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    toUserProfile(user) {
        const showLocalTime = this.getShowLocalTimePreference(user.notificationPreferences);
        return {
            id: user.id,
            fullName: user.fullName,
            designation: user.designation,
            email: user.email,
            profilePicture: user.avatarUrl ?? `initials:${this.getInitials(user.fullName)}`,
            status: user.isOnline
                ? profile_status_enum_1.UserPresenceStatus.ONLINE
                : profile_status_enum_1.UserPresenceStatus.OFFLINE,
            bio: user.bio,
            timezone: user.timezone,
            showLocalTime,
            localTime: this.computeLocalTime(user.timezone, showLocalTime),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    getShowLocalTimePreference(preferences) {
        if (!this.isJsonObject(preferences)) {
            return true;
        }
        const showLocalTime = preferences['showLocalTime'];
        return typeof showLocalTime === 'boolean' ? showLocalTime : true;
    }
    buildNotificationPreferences(preferences, showLocalTime) {
        if (showLocalTime === undefined) {
            return undefined;
        }
        const safePreferences = this.isJsonObject(preferences)
            ? { ...preferences }
            : {};
        return {
            ...safePreferences,
            showLocalTime,
        };
    }
    isJsonObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
    trimToNull(value) {
        if (value === undefined) {
            return null;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    normalizeProfilePicture(profilePicture) {
        const trimmedValue = profilePicture.trim();
        if (trimmedValue.length === 0) {
            throw new common_1.BadRequestException('profilePicture cannot be empty');
        }
        if (/^initials:/i.test(trimmedValue)) {
            const initials = trimmedValue.split(':')[1]?.trim();
            if (!initials || !/^[A-Za-z]{1,4}$/.test(initials)) {
                throw new common_1.BadRequestException('Initials avatar must contain 1 to 4 alphabetic characters');
            }
            return `initials:${initials.toUpperCase()}`;
        }
        if (/^[A-Za-z]{1,4}$/.test(trimmedValue)) {
            return `initials:${trimmedValue.toUpperCase()}`;
        }
        try {
            const url = new URL(trimmedValue);
            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new common_1.BadRequestException('profilePicture URL must start with http:// or https://');
            }
            return url.toString();
        }
        catch {
            throw new common_1.BadRequestException('profilePicture must be a valid URL or initials');
        }
    }
    usesInitialsAvatar(profilePicture) {
        return (profilePicture === null ||
            /^initials:[A-Za-z]{1,4}$/i.test(profilePicture));
    }
    normalizeTimezoneForCreate(timezone) {
        if (timezone === undefined) {
            return null;
        }
        const trimmedTimezone = timezone.trim();
        if (!trimmedTimezone) {
            return null;
        }
        this.assertValidTimezone(trimmedTimezone);
        return trimmedTimezone;
    }
    normalizeTimezoneForUpdate(timezone) {
        if (timezone === undefined) {
            return undefined;
        }
        const trimmedTimezone = timezone.trim();
        if (!trimmedTimezone) {
            return null;
        }
        this.assertValidTimezone(trimmedTimezone);
        return trimmedTimezone;
    }
    assertValidTimezone(timezone) {
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
        }
        catch {
            throw new common_1.BadRequestException('Invalid timezone');
        }
    }
    computeLocalTime(timezone, showLocalTime) {
        if (!showLocalTime || !timezone) {
            return null;
        }
        try {
            return new Intl.DateTimeFormat('en-GB', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(new Date());
        }
        catch {
            return null;
        }
    }
    getInitials(fullName) {
        const words = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
        if (words.length === 0) {
            return 'NA';
        }
        return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map