export declare class MemberDetailResponseDto {
    id: string;
    workspaceMemberId: string;
    fullName: string;
    email: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    avatarUrl: string | null;
    avatarColor: string | null;
    designation: string | null;
    bio: string | null;
    isOnline: boolean;
    lastActive: Date | null;
    timezone: string | null;
    notificationPreferences: Record<string, unknown> | null;
    invitedBy: string | null;
    invitedOn: Date | null;
    inviteStatus: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | null;
    createdAt: Date;
    updatedAt: Date;
}
