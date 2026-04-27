import { UserPresenceStatus } from './profile-status.enum';
export declare class UpdateProfileDto {
    fullName?: string;
    designation?: string;
    profilePicture?: string;
    status?: UserPresenceStatus;
    bio?: string;
    timezone?: string;
    showLocalTime?: boolean;
}
