import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.service';
import { UserService, type UserProfile } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createProfile(req: AuthenticatedRequest, dto: CreateProfileDto): Promise<UserProfile>;
    getProfile(req: AuthenticatedRequest): Promise<UserProfile>;
    updateProfile(req: AuthenticatedRequest, dto: UpdateProfileDto): Promise<UserProfile>;
    updateStatus(req: AuthenticatedRequest, dto: SetStatusDto): Promise<UserProfile>;
    deleteProfile(req: AuthenticatedRequest): Promise<void>;
    changePassword(req: AuthenticatedRequest, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
export {};
