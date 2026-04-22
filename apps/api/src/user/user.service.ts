import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UserPresenceStatus } from './dto/profile-status.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
} satisfies Prisma.UserSelect;

const USER_PASSWORD_SELECT = {
  id: true,
  passwordHash: true,
} satisfies Prisma.UserSelect;

type UserProfileRecord = Prisma.UserGetPayload<{
  select: typeof USER_PROFILE_SELECT;
}>;

type UserPasswordRecord = Prisma.UserGetPayload<{
  select: typeof USER_PASSWORD_SELECT;
}>;

export type UserProfile = {
  id: string;
  fullName: string;
  designation: string | null;
  email: string;
  profilePicture: string;
  status: UserPresenceStatus;
  bio: string | null;
  timezone: string | null;
  showLocalTime: boolean;
  localTime: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(
    userId: string,
    dto: CreateProfileDto,
  ): Promise<UserProfile> {
    const existingUser = await this.findActiveUserOrThrow(userId);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        designation: this.trimToNull(dto.designation),
        avatarUrl:
          dto.profilePicture !== undefined
            ? this.normalizeProfilePicture(dto.profilePicture)
            : `initials:${this.getInitials(existingUser.fullName)}`,
        isOnline:
          dto.status !== undefined
            ? dto.status === UserPresenceStatus.ONLINE
            : undefined,
        bio: this.trimToNull(dto.bio),
        timezone: this.normalizeTimezoneForCreate(dto.timezone),
        notificationPreferences: this.buildNotificationPreferences(
          existingUser.notificationPreferences,
          dto.showLocalTime ?? true,
        ),
      },
      select: USER_PROFILE_SELECT,
    });

    return this.toUserProfile(updatedUser);
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.findActiveUserOrThrow(userId);
    return this.toUserProfile(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfile> {
    const existingUser = await this.findActiveUserOrThrow(userId);
    const updateData: Prisma.UserUpdateInput = {};
    const nextFullName =
      dto.fullName !== undefined ? dto.fullName.trim() : existingUser.fullName;

    if (dto.fullName !== undefined) {
      updateData.fullName = nextFullName;
    }

    if (dto.designation !== undefined) {
      updateData.designation = this.trimToNull(dto.designation);
    }

    if (dto.profilePicture !== undefined) {
      updateData.avatarUrl = this.normalizeProfilePicture(dto.profilePicture);
    } else if (
      dto.fullName !== undefined &&
      this.usesInitialsAvatar(existingUser.avatarUrl)
    ) {
      updateData.avatarUrl = `initials:${this.getInitials(nextFullName)}`;
    }

    if (dto.status !== undefined) {
      updateData.isOnline = dto.status === UserPresenceStatus.ONLINE;
    }

    if (dto.bio !== undefined) {
      updateData.bio = this.trimToNull(dto.bio);
    }

    if (dto.timezone !== undefined) {
      updateData.timezone = this.normalizeTimezoneForUpdate(dto.timezone);
    }

    if (dto.showLocalTime !== undefined) {
      updateData.notificationPreferences = this.buildNotificationPreferences(
        existingUser.notificationPreferences,
        dto.showLocalTime,
      );
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'At least one profile field is required for update',
      );
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

  async updateStatus(
    userId: string,
    status: UserPresenceStatus,
  ): Promise<UserProfile> {
    await this.findActiveUserOrThrow(userId);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isOnline: status === UserPresenceStatus.ONLINE,
        lastSeenAt:
          status === UserPresenceStatus.OFFLINE ? new Date() : undefined,
      },
      select: USER_PROFILE_SELECT,
    });

    return this.toUserProfile(updatedUser);
  }

  async updateNotificationPreferences(
    userId: string,
    dto: {
      inbox?: boolean;
      email?: boolean;
      browser?: boolean;
      mobile?: boolean;
    },
  ): Promise<{
    inbox: boolean | null;
    email: boolean | null;
    browser: boolean | null;
    mobile: boolean | null;
  }> {
    const existingUser = await this.findActiveUserOrThrow(userId);

    const safePreferences: Prisma.JsonObject = this.isJsonObject(
      existingUser.notificationPreferences,
    )
      ? { ...(existingUser.notificationPreferences as Prisma.JsonObject) }
      : {};

    if (dto.inbox !== undefined) safePreferences['inbox'] = dto.inbox;
    if (dto.email !== undefined) safePreferences['email'] = dto.email;
    if (dto.browser !== undefined) safePreferences['browser'] = dto.browser;
    if (dto.mobile !== undefined) safePreferences['mobile'] = dto.mobile;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { notificationPreferences: safePreferences as Prisma.InputJsonValue },
      select: USER_PROFILE_SELECT,
    });

    const prefs = this.isJsonObject(updatedUser.notificationPreferences)
      ? (updatedUser.notificationPreferences as Prisma.JsonObject)
      : {};

    return {
      inbox: typeof prefs['inbox'] === 'boolean' ? prefs['inbox'] : null,
      email: typeof prefs['email'] === 'boolean' ? prefs['email'] : null,
      browser: typeof prefs['browser'] === 'boolean' ? prefs['browser'] : null,
      mobile: typeof prefs['mobile'] === 'boolean' ? prefs['mobile'] : null,
    };
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.findActiveUserOrThrow(userId);

    await this.prisma.$transaction((tx) => this.softDeleteUserInTransaction(userId, tx));
  }

  async adminDeleteUser(
    workspaceId: string,
    actorId: string,
    actorRole: Role,
    targetUserId: string,
  ): Promise<void> {
    if (actorRole !== 'OWNER') {
      throw new ForbiddenException('Only the workspace owner can delete users');
    }

    if (actorId === targetUserId) {
      throw new BadRequestException(
        'Use DELETE /user/profile to delete your own account',
      );
    }

    const membership = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: targetUserId,
        deletedAt: null,
        user: { deletedAt: null },
      },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('User not found in this workspace');
    }

    if (membership.role === 'OWNER') {
      throw new ForbiddenException('Workspace owners cannot be deleted by another owner');
    }

    await this.prisma.$transaction(async (tx) => {
      await this.softDeleteUserInTransaction(targetUserId, tx);

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'user',
          entityId: targetUserId,
          action: 'deleted_by_owner',
          metadata: {
            targetUserName: membership.user.fullName,
          },
          performedBy: actorId,
        },
      });
    });
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findActiveUserWithPasswordOrThrow(userId);

    if (!user.passwordHash) {
      throw new ForbiddenException(
        'Password is not set for this account. Please use social login.',
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(
      dto.newPassword,
      user.passwordHash,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const newPasswordHash = await bcrypt.hash(
      dto.newPassword,
      PASSWORD_SALT_ROUNDS,
    );

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

  //   async getMe(userId: string): Promise<UserProfile> {
  //     return this.getProfile(userId);
  //   }

  private async findActiveUserOrThrow(
    userId: string,
  ): Promise<UserProfileRecord> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: USER_PROFILE_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async softDeleteUserInTransaction(
    userId: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const now = new Date();

    await tx.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: now,
        isOnline: false,
        lastSeenAt: now,
      },
    });
  }

  private async findActiveUserWithPasswordOrThrow(
    userId: string,
  ): Promise<UserPasswordRecord> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: USER_PASSWORD_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private toUserProfile(user: UserProfileRecord): UserProfile {
    const showLocalTime = this.getShowLocalTimePreference(
      user.notificationPreferences,
    );

    return {
      id: user.id,
      fullName: user.fullName,
      designation: user.designation,
      email: user.email,
      profilePicture:
        user.avatarUrl ?? `initials:${this.getInitials(user.fullName)}`,
      status: user.isOnline
        ? UserPresenceStatus.ONLINE
        : UserPresenceStatus.OFFLINE,
      bio: user.bio,
      timezone: user.timezone,
      showLocalTime,
      localTime: this.computeLocalTime(user.timezone, showLocalTime),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private getShowLocalTimePreference(preferences: Prisma.JsonValue): boolean {
    if (!this.isJsonObject(preferences)) {
      return true;
    }

    const showLocalTime = preferences['showLocalTime'];
    return typeof showLocalTime === 'boolean' ? showLocalTime : true;
  }

  private buildNotificationPreferences(
    preferences: Prisma.JsonValue,
    showLocalTime?: boolean,
  ): Prisma.InputJsonValue | undefined {
    if (showLocalTime === undefined) {
      return undefined;
    }

    const safePreferences: Prisma.JsonObject = this.isJsonObject(preferences)
      ? { ...preferences }
      : {};

    return {
      ...safePreferences,
      showLocalTime,
    } as Prisma.InputJsonValue;
  }

  private isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private trimToNull(value?: string): string | null {
    if (value === undefined) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeProfilePicture(profilePicture: string): string {
    const trimmedValue = profilePicture.trim();

    if (trimmedValue.length === 0) {
      throw new BadRequestException('profilePicture cannot be empty');
    }

    if (/^initials:/i.test(trimmedValue)) {
      const initials = trimmedValue.split(':')[1]?.trim();

      if (!initials || !/^[A-Za-z]{1,4}$/.test(initials)) {
        throw new BadRequestException(
          'Initials avatar must contain 1 to 4 alphabetic characters',
        );
      }

      return `initials:${initials.toUpperCase()}`;
    }

    if (/^[A-Za-z]{1,4}$/.test(trimmedValue)) {
      return `initials:${trimmedValue.toUpperCase()}`;
    }

    try {
      const url = new URL(trimmedValue);

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new BadRequestException(
          'profilePicture URL must start with http:// or https://',
        );
      }

      return url.toString();
    } catch {
      throw new BadRequestException(
        'profilePicture must be a valid URL or initials',
      );
    }
  }

  private usesInitialsAvatar(profilePicture: string | null): boolean {
    return (
      profilePicture === null ||
      /^initials:[A-Za-z]{1,4}$/i.test(profilePicture)
    );
  }

  private normalizeTimezoneForCreate(timezone?: string): string | null {
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

  private normalizeTimezoneForUpdate(
    timezone?: string,
  ): string | null | undefined {
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

  private assertValidTimezone(timezone: string): void {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(
        new Date(),
      );
    } catch {
      throw new BadRequestException('Invalid timezone');
    }
  }

  private computeLocalTime(
    timezone: string | null,
    showLocalTime: boolean,
  ): string | null {
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
    } catch {
      return null;
    }
  }

  private getInitials(fullName: string): string {
    const words = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2);

    if (words.length === 0) {
      return 'NA';
    }

    return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
  }
}
