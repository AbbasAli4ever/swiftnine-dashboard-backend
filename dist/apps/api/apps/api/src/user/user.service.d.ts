import { PrismaService } from "../../../../libs/database/src";
import type { Role } from "../../../../libs/database/src/generated/prisma/client";
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UserPresenceStatus } from './dto/profile-status.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createProfile(userId: string, dto: CreateProfileDto): Promise<UserProfile>;
    getProfile(userId: string): Promise<UserProfile>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile>;
    updateStatus(userId: string, status: UserPresenceStatus): Promise<UserProfile>;
    updateNotificationPreferences(userId: string, dto: {
        inbox?: boolean;
        email?: boolean;
        browser?: boolean;
        mobile?: boolean;
    }): Promise<{
        inbox: boolean | null;
        email: boolean | null;
        browser: boolean | null;
        mobile: boolean | null;
    }>;
    deleteProfile(userId: string): Promise<void>;
    adminDeleteUser(workspaceId: string, actorId: string, actorRole: Role, targetUserId: string): Promise<void>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private findActiveUserOrThrow;
    private softDeleteUserInTransaction;
    private findActiveUserWithPasswordOrThrow;
    private toUserProfile;
    private getShowLocalTimePreference;
    private buildNotificationPreferences;
    private isJsonObject;
    private trimToNull;
    private normalizeProfilePicture;
    private usesInitialsAvatar;
    private normalizeTimezoneForCreate;
    private normalizeTimezoneForUpdate;
    private assertValidTimezone;
    private computeLocalTime;
    private getInitials;
}
