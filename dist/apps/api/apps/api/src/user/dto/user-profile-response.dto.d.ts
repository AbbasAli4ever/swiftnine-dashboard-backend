import { UserPresenceStatus } from './profile-status.enum';
export declare class UserProfileResponseDto {
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
}
