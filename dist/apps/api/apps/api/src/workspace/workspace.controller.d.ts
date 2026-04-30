import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { BatchInviteMembersDto } from './dto/batch-invite-members.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { BatchAddMembersDto } from './dto/batch-add-members.dto';
import { ClaimInviteDto } from './dto/claim-invite.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { MemberDetailResponseDto } from './dto/member-detail-response.dto';
import type { WorkspaceRequest } from './workspace.types';
import type { AuthUser } from '../auth/auth.service';
import type { Request, Response } from 'express';
import { type ApiResponse as ApiRes } from '@app/common';
import type { BatchInviteResult, BatchAddResult, InviteClaimResult, InviteNextStep, WorkspaceData } from './workspace.service';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    create(dto: CreateWorkspaceDto, req: AuthenticatedRequest): Promise<ApiRes<WorkspaceData>>;
    findAll(req: AuthenticatedRequest): Promise<ApiRes<WorkspaceData[]>>;
    findOne(req: WorkspaceRequest): Promise<ApiRes<WorkspaceData & {
        memberCount: number;
    }>>;
    listMembers(req: WorkspaceRequest): Promise<ApiRes<MemberResponseDto[]>>;
    getMember(workspaceId: string, memberId: string): Promise<ApiRes<MemberDetailResponseDto>>;
    update(req: WorkspaceRequest, dto: UpdateWorkspaceDto): Promise<ApiRes<WorkspaceData>>;
    remove(req: WorkspaceRequest): Promise<ApiRes<null>>;
    sendInvite(req: WorkspaceRequest, dto: InviteMemberDto): Promise<ApiRes<null>>;
    sendBatchInvites(req: WorkspaceRequest, dto: BatchInviteMembersDto): Promise<ApiRes<BatchInviteResult>>;
    addMember(req: WorkspaceRequest, dto: AddMemberDto): Promise<ApiRes<null>>;
    addMembersBatch(req: WorkspaceRequest, dto: BatchAddMembersDto): Promise<ApiRes<BatchAddResult>>;
    getInviteDetails(token: string): Promise<ApiRes<{
        workspaceId: string;
        workspaceName: string;
        invitedEmail: string;
        role: string;
        inviterName: string;
        nextStep: InviteNextStep;
    }>>;
    claimInvite(dto: ClaimInviteDto, res: Response): Promise<ApiRes<Omit<InviteClaimResult, 'refreshToken'>>>;
    acceptInvite(req: AuthenticatedRequest, dto: AcceptInviteDto): Promise<ApiRes<{
        workspaceId: string;
    }>>;
    private setRefreshCookie;
}
export {};
