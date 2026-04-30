import { PrismaService } from "../../../../libs/database/src";
import { EmailService } from "../../../../libs/common/src";
import type { Prisma, Role, InviteStatus } from "../../../../libs/database/src/generated/prisma/client";
import { AuthService, type TokenPair } from '../auth/auth.service';
import type { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type { InviteMemberDto } from './dto/invite-member.dto';
import type { ClaimInviteDto } from './dto/claim-invite.dto';
import type { BatchInviteMembersDto } from './dto/batch-invite-members.dto';
declare const WORKSPACE_SELECT: {
    id: true;
    name: true;
    logoUrl: true;
    workspaceUse: true;
    managementType: true;
    createdBy: true;
    createdAt: true;
    updatedAt: true;
};
export type WorkspaceData = Prisma.WorkspaceGetPayload<{
    select: typeof WORKSPACE_SELECT;
}>;
export type InviteClaimResult = Omit<TokenPair, 'refreshToken'> & {
    refreshToken: string;
    workspaceId: string;
};
export type InviteNextStep = 'claim_account' | 'login';
export type BatchInviteStatus = 'invited' | 'already_member' | 'failed';
export type BatchInviteMemberResult = {
    email: string;
    status: BatchInviteStatus;
    message: string | null;
};
export type BatchInviteResult = {
    results: BatchInviteMemberResult[];
    summary: {
        total: number;
        invited: number;
        alreadyMember: number;
        failed: number;
    };
};
export type BatchAddStatus = 'added' | 'already_member' | 'failed';
export type BatchAddMemberResult = {
    userId: string;
    status: BatchAddStatus;
    message: string | null;
};
export type BatchAddResult = {
    results: BatchAddMemberResult[];
    summary: {
        total: number;
        added: number;
        alreadyMember: number;
        failed: number;
    };
};
export declare class WorkspaceService {
    private readonly prisma;
    private readonly email;
    private readonly authService;
    constructor(prisma: PrismaService, email: EmailService, authService: AuthService);
    create(userId: string, dto: CreateWorkspaceDto): Promise<WorkspaceData>;
    findAllForUser(userId: string): Promise<WorkspaceData[]>;
    findOne(workspaceId: string, userId: string): Promise<WorkspaceData & {
        memberCount: number;
    }>;
    listMembers(workspaceId: string): Promise<Array<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        lastActive: Date | null;
        invitedBy: string | null;
        invitedOn: Date | null;
        inviteStatus: InviteStatus | null;
    }>>;
    getMember(workspaceId: string, memberId: string): Promise<{
        id: string;
        workspaceMemberId: string;
        fullName: string;
        email: string;
        role: Role;
        avatarUrl: string | null;
        avatarColor: string | null;
        designation: string | null;
        bio: string | null;
        isOnline: boolean;
        lastActive: Date | null;
        timezone: string | null;
        notificationPreferences: any;
        invitedBy: string | null;
        invitedOn: Date | null;
        inviteStatus: InviteStatus | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(workspaceId: string, userId: string, role: Role, dto: UpdateWorkspaceDto): Promise<WorkspaceData>;
    remove(workspaceId: string, userId: string, role: Role): Promise<void>;
    sendInvite(workspaceId: string, inviterId: string, role: Role, dto: InviteMemberDto): Promise<void>;
    sendBatchInvites(workspaceId: string, inviterId: string, role: Role, dto: BatchInviteMembersDto): Promise<BatchInviteResult>;
    getInviteDetails(token: string): Promise<{
        workspaceId: string;
        workspaceName: string;
        invitedEmail: string;
        role: Role;
        inviterName: string;
        nextStep: InviteNextStep;
    }>;
    claimInvite(dto: ClaimInviteDto): Promise<InviteClaimResult>;
    acceptInvite(token: string, userId: string, userEmail: string): Promise<{
        workspaceId: string;
    }>;
    private hashToken;
    private prepareInviteContext;
    private findPendingInviteByToken;
    private sendInviteToEmail;
    private assertActorIsOwner;
    removeMember(workspaceId: string, memberId: string, actorId: string): Promise<void>;
    changeMemberRole(workspaceId: string, memberId: string, newRole: Role, actorId: string): Promise<void>;
    addMemberByUserId(workspaceId: string, userId: string, role: Role, actorId: string): Promise<void>;
    addMembersByUserIds(workspaceId: string, userIds: string[], role: Role, actorId: string): Promise<BatchAddResult>;
}
export {};
