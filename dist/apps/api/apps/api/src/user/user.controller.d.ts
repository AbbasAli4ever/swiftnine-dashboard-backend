import type { Request, Response } from 'express';
import type { AuthUser } from '../auth/auth.service';
import { AuthService } from '../auth/auth.service';
import { UserService, type UserProfile } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationPreferencesResponseDto } from './dto/notification-preferences-response.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    createProfile(req: AuthenticatedRequest, dto: CreateProfileDto): Promise<UserProfile>;
    getProfile(req: AuthenticatedRequest): Promise<UserProfile>;
    getById(id: string): Promise<UserProfile>;
    updateProfile(req: AuthenticatedRequest, dto: UpdateProfileDto): Promise<UserProfile>;
    updateStatus(req: AuthenticatedRequest, dto: SetStatusDto): Promise<UserProfile>;
    deleteProfile(req: AuthenticatedRequest): Promise<void>;
    deleteWorkspaceMemberUser(req: WorkspaceRequest, id: string): Promise<void>;
    logoutAll(req: AuthenticatedRequest, res: Response): Promise<{
        message: string;
    }>;
    changePassword(req: AuthenticatedRequest, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    updateNotificationPreferences(req: AuthenticatedRequest, dto: UpdateNotificationPreferencesDto): Promise<NotificationPreferencesResponseDto>;
}
export {};
