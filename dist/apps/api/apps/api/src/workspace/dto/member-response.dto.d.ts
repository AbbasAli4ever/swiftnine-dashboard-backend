export declare class MemberResponseDto {
    id: string;
    fullName: string;
    email: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    lastActive: Date | null;
    invitedBy: string | null;
    invitedOn: Date | null;
    inviteStatus: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | null;
}
