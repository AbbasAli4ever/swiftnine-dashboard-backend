import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import { EmailService } from '@app/common';
import type {
  Prisma,
  Role,
  InviteStatus,
  AiModelTier,
  UserRole,
} from '@app/database/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'node:crypto';
import {
  type AuthUser,
  AuthService,
  type TokenPair,
} from '../auth/auth.service';
import { AUTH_USER_SELECT, PLATFORM_ADMIN_ONLY } from '../auth/auth.constants';
import type { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type { InviteMemberDto } from './dto/invite-member.dto';
import type { ClaimInviteDto } from './dto/claim-invite.dto';
import type { BatchInviteMembersDto } from './dto/batch-invite-members.dto';
import { DEFAULT_BANK_ACCOUNTS } from '../bank-accounts/default-bank-accounts.data';
import { ChannelsService } from '../channels/channels.service';

const WORKSPACE_NOT_FOUND = 'Workspace not found';
// MANAGER is a full peer of OWNER for every workspace-management action in
// this file (settings, deletion, invites, adding/removing members, changing
// roles) — the same blast radius an invited "OWNER" used to have before
// OWNER became a single, invite-proof role. The one deliberate exception is
// changeMemberAccountingRole, which stays platform-admin-only (see its own
// comment) — granting financial access was never part of this parity.
const OWNER_OR_MANAGER_ONLY =
  'Only the workspace owner or a manager can perform this action';
const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PASSWORD_SALT_ROUNDS = 10;
const INVITE_ALREADY_REGISTERED_MESSAGE =
  'An account already exists for this email. Please log in to accept the invite.';

const WORKSPACE_SELECT = {
  id: true,
  name: true,
  logoUrl: true,
  workspaceUse: true,
  managementType: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.WorkspaceSelect;

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

type InviteContext = {
  workspaceId: string;
  workspaceName: string;
  inviterId: string;
  inviterName: string;
};

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly authService: AuthService,
    private readonly channels: ChannelsService,
  ) {}

  async create(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceData> {
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name.trim(),
          logoUrl: dto.logoUrl ?? null,
          workspaceUse: dto.workspaceUse,
          managementType: dto.managementType,
          createdBy: userId,
        },
        select: WORKSPACE_SELECT,
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: 'OWNER',
        },
      });

      // Every workspace gets the default bank accounts up front. They used to
      // be created on invite-accept, but only when that invite carried an
      // accountingRole — accounting access no longer rides on invites, so
      // that trigger is gone. Creating them here also decouples the two
      // concerns: the accounts exist from day one, and they simply stay
      // invisible until a platform admin grants someone accounting access
      // (the accounting endpoints are all behind AccountingRoleGuard).
      await this.provisionDefaultBankAccounts(tx, workspace.id);

      await tx.activityLog.create({
        data: {
          workspaceId: workspace.id,
          entityType: 'workspace',
          entityId: workspace.id,
          action: 'created',
          metadata: {
            workspaceName: workspace.name,
            workspaceUse: workspace.workspaceUse,
            managementType: workspace.managementType,
          },
          performedBy: userId,
        },
      });

      return workspace;
    });
  }

  async findAllForUser(userId: string): Promise<WorkspaceData[]> {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: {
        userId,
        deletedAt: null,
        workspace: { deletedAt: null },
      },
      select: {
        workspace: { select: WORKSPACE_SELECT },
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => m.workspace);
  }

  async findOne(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceData & { memberCount: number }> {
    const [workspace, memberCount] = await Promise.all([
      this.prisma.workspace.findFirst({
        where: { id: workspaceId, deletedAt: null },
        select: WORKSPACE_SELECT,
      }),
      this.prisma.workspaceMember.count({
        where: { workspaceId, deletedAt: null },
      }),
    ]);

    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    return { ...workspace, memberCount };
  }

  async listMembers(workspaceId: string): Promise<
    Array<{
      id: string;
      fullName: string;
      email: string;
      avatarUrl: string | null;
      avatarColor: string;
      role: Role;
      accountingRole: UserRole | null;
      aiModelTier: AiModelTier;
      lastActive: Date | null;
      invitedBy: string | null;
      invitedOn: Date | null;
      inviteStatus: InviteStatus | null;
    }>
  > {
    const [members, pendingInvites] = await Promise.all([
      this.prisma.workspaceMember.findMany({
        where: { workspaceId, deletedAt: null },
        select: {
          role: true,
          accountingRole: true,
          aiModelTier: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              lastSeenAt: true,
              // Member lists render avatars (assignee pickers, invite
              // dialogs, project members) — without these they can only ever
              // show initials, even for a user who has uploaded a picture.
              avatarUrl: true,
              avatarColor: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.workspaceInvite.findMany({
        where: { workspaceId, status: 'PENDING' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          status: true,
          sender: { select: { fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const inviteMap = new Map<
      string,
      {
        email: string;
        createdAt: Date;
        status?: InviteStatus;
        sender?: { fullName: string };
      }
    >();
    for (const inv of pendingInvites) {
      const key = inv.email.trim().toLowerCase();
      if (!inviteMap.has(key)) inviteMap.set(key, inv as any);
    }

    const memberRows = members.map((m) => {
      const u = m.user;
      const key = u.email.trim().toLowerCase();
      const inv = inviteMap.get(key);
      return {
        id: u.id,
        fullName: u.fullName,
        avatarUrl: u.avatarUrl,
        avatarColor: u.avatarColor,
        email: u.email,
        role: m.role,
        accountingRole: m.accountingRole,
        aiModelTier: m.aiModelTier,
        lastActive: (u as any).lastSeenAt ?? null,
        invitedBy: inv?.sender?.fullName ?? null,
        invitedOn: inv?.createdAt ?? null,
        inviteStatus: (inv as any)?.status ?? null,
      };
    });

    const pendingInviteRows = pendingInvites
      .filter(
        (invite) =>
          !members.some(
            (member) =>
              member.user.email.trim().toLowerCase() ===
              invite.email.trim().toLowerCase(),
          ),
      )
      .map((invite) => ({
        id: invite.id,
        fullName: invite.email,
        email: invite.email,
        // An invite has no user account behind it yet, so there is no avatar
        // to report — the client falls back to initials from the email.
        avatarUrl: null,
        // Matches the schema default on User.avatarColor.
        avatarColor: '#6366f1',
        role: invite.role,
        // No membership row exists until the invite is accepted, so there's
        // no accounting role to report yet, same reasoning as aiModelTier.
        accountingRole: null,
        // No membership row exists until the invite is accepted, so no tier
        // has been assigned yet — report the default rather than implying one.
        aiModelTier: 'STANDARD' as AiModelTier,
        lastActive: null,
        invitedBy: invite.sender?.fullName ?? null,
        invitedOn: invite.createdAt,
        inviteStatus: invite.status,
      }));

    return [...memberRows, ...pendingInviteRows];
  }

  async getMember(
    workspaceId: string,
    memberId: string,
  ): Promise<{
    id: string;
    workspaceMemberId: string;
    fullName: string;
    email: string;
    role: Role;
    accountingRole: UserRole | null;
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
  }> {
    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId, deletedAt: null },
      select: {
        id: true,
        role: true,
        accountingRole: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            avatarColor: true,
            designation: true,
            bio: true,
            isOnline: true,
            lastSeenAt: true,
            timezone: true,
            notificationPreferences: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId, deletedAt: null },
        select: {
          id: true,
          role: true,
          accountingRole: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              avatarColor: true,
              designation: true,
              bio: true,
              isOnline: true,
              lastSeenAt: true,
              timezone: true,
              notificationPreferences: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
    }

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const u = member.user;
    const invite = await this.prisma.workspaceInvite.findFirst({
      where: { workspaceId, email: u.email.trim().toLowerCase() },
      select: {
        createdAt: true,
        status: true,
        sender: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      id: u.id,
      workspaceMemberId: member.id,
      fullName: u.fullName,
      email: u.email,
      role: member.role,
      accountingRole: member.accountingRole,
      avatarUrl: u.avatarUrl ?? null,
      avatarColor: u.avatarColor ?? null,
      designation: u.designation ?? null,
      bio: u.bio ?? null,
      isOnline: (u as any).isOnline ?? false,
      lastActive: (u as any).lastSeenAt ?? null,
      timezone: u.timezone ?? null,
      notificationPreferences: u.notificationPreferences ?? null,
      invitedBy: (invite as any)?.sender?.fullName ?? null,
      invitedOn: (invite as any)?.createdAt ?? null,
      inviteStatus: (invite as any)?.status ?? null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  async update(
    workspaceId: string,
    userId: string,
    role: Role,
    dto: UpdateWorkspaceDto,
  ): Promise<WorkspaceData> {
    if (role !== 'OWNER' && role !== 'MANAGER') {
      throw new ForbiddenException(OWNER_OR_MANAGER_ONLY);
    }

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: WORKSPACE_SELECT,
    });
    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    const updateData: Prisma.WorkspaceUpdateInput = {};
    const logEntries: Array<{
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
    }> = [];

    if (dto.name !== undefined && dto.name !== workspace.name) {
      updateData.name = dto.name.trim();
      logEntries.push({
        fieldName: 'name',
        oldValue: workspace.name,
        newValue: dto.name.trim(),
      });
    }

    if (dto.logoUrl !== undefined && dto.logoUrl !== workspace.logoUrl) {
      updateData.logoUrl = dto.logoUrl;
      logEntries.push({
        fieldName: 'logoUrl',
        oldValue: workspace.logoUrl ?? null,
        newValue: dto.logoUrl ?? null,
      });
    }

    if (
      dto.workspaceUse !== undefined &&
      dto.workspaceUse !== workspace.workspaceUse
    ) {
      updateData.workspaceUse = dto.workspaceUse;
      logEntries.push({
        fieldName: 'workspaceUse',
        oldValue: workspace.workspaceUse,
        newValue: dto.workspaceUse,
      });
    }

    if (
      dto.managementType !== undefined &&
      dto.managementType !== workspace.managementType
    ) {
      updateData.managementType = dto.managementType;
      logEntries.push({
        fieldName: 'managementType',
        oldValue: workspace.managementType,
        newValue: dto.managementType,
      });
    }

    if (Object.keys(updateData).length === 0) return workspace;

    const updated = await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: updateData,
      select: WORKSPACE_SELECT,
    });

    if (logEntries.length > 0) {
      await this.prisma.activityLog.createMany({
        data: logEntries.map((entry) => ({
          workspaceId,
          entityType: 'workspace',
          entityId: workspaceId,
          action: 'updated',
          fieldName: entry.fieldName,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          metadata: { workspaceName: updated.name },
          performedBy: userId,
        })),
      });
    }

    return updated;
  }

  async remove(workspaceId: string, userId: string, role: Role): Promise<void> {
    if (role !== 'OWNER' && role !== 'MANAGER') {
      throw new ForbiddenException(OWNER_OR_MANAGER_ONLY);
    }

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    await this.prisma.$transaction([
      this.prisma.workspace.update({
        where: { id: workspaceId },
        data: { deletedAt: new Date() },
      }),
      this.prisma.activityLog.create({
        data: {
          workspaceId,
          entityType: 'workspace',
          entityId: workspaceId,
          action: 'deleted',
          metadata: { workspaceName: workspace.name },
          performedBy: userId,
        },
      }),
    ]);
  }

  // ─── Invite ───────────────────────────────────────────────────────────────────

  async sendInvite(
    workspaceId: string,
    inviterId: string,
    role: Role,
    dto: InviteMemberDto,
  ): Promise<void> {
    const inviteContext = await this.prepareInviteContext(
      workspaceId,
      inviterId,
      role,
    );
    const result = await this.sendInviteToEmail(
      inviteContext,
      dto.email,
      dto.role,
    );

    if (result.status === 'failed') {
      throw new InternalServerErrorException(
        result.message ?? 'Failed to send invite email',
      );
    }
  }

  async sendBatchInvites(
    workspaceId: string,
    inviterId: string,
    role: Role,
    dto: BatchInviteMembersDto,
  ): Promise<BatchInviteResult> {
    const inviteContext = await this.prepareInviteContext(
      workspaceId,
      inviterId,
      role,
    );
    const uniqueEmails = [
      ...new Set(dto.emails.map((email) => email.trim().toLowerCase())),
    ];
    const results: BatchInviteMemberResult[] = [];

    for (const email of uniqueEmails) {
      results.push(
        await this.sendInviteToEmail(inviteContext, email, dto.role),
      );
    }

    return {
      results,
      summary: {
        total: results.length,
        invited: results.filter((result) => result.status === 'invited').length,
        alreadyMember: results.filter(
          (result) => result.status === 'already_member',
        ).length,
        failed: results.filter((result) => result.status === 'failed').length,
      },
    };
  }

  async getInviteDetails(token: string): Promise<{
    workspaceId: string;
    workspaceName: string;
    invitedEmail: string;
    role: Role;
    inviterName: string;
    nextStep: InviteNextStep;
  }> {
    const invite = await this.findPendingInviteByToken(token, {
      email: true,
      role: true,
      workspace: { select: { id: true, name: true } },
      sender: { select: { fullName: true } },
    });

    const existingUser = await this.prisma.user.findFirst({
      where: { email: invite.email.trim().toLowerCase(), deletedAt: null },
      select: { id: true, isEmailVerified: true },
    });

    return {
      workspaceId: invite.workspace.id,
      workspaceName: invite.workspace.name,
      invitedEmail: invite.email,
      role: invite.role,
      inviterName: invite.sender.fullName,
      nextStep: existingUser?.isEmailVerified ? 'login' : 'claim_account',
    };
  }

  async claimInvite(dto: ClaimInviteDto): Promise<InviteClaimResult> {
    const invite = await this.findPendingInviteByToken(dto.token, {
      id: true,
      workspaceId: true,
      email: true,
      role: true,
    });

    const inviteEmail = invite.email.trim().toLowerCase();
    const fullName = dto.fullName.trim();
    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    const user = await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { email: inviteEmail, deletedAt: null },
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
          avatarColor: true,
          isEmailVerified: true,
        },
      });

      if (existingUser?.isEmailVerified) {
        throw new ConflictException(INVITE_ALREADY_REGISTERED_MESSAGE);
      }

      let authUser: AuthUser;

      if (existingUser) {
        authUser = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            fullName,
            passwordHash,
            isEmailVerified: true,
          },
          select: AUTH_USER_SELECT,
        });

        await tx.emailVerificationToken.deleteMany({
          where: { userId: existingUser.id },
        });
      } else {
        authUser = await tx.user.create({
          data: {
            fullName,
            email: inviteEmail,
            passwordHash,
            isEmailVerified: true,
          },
          select: AUTH_USER_SELECT,
        });
      }

      await tx.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      });

      await this.joinWorkspace(tx, invite.workspaceId, authUser.id, invite.role);

      return authUser;
    });

    const tokenPair = await this.authService.issueTokens(user);

    return {
      ...tokenPair,
      workspaceId: invite.workspaceId,
    };
  }

  async acceptInvite(
    token: string,
    userId: string,
    userEmail: string,
  ): Promise<{ workspaceId: string }> {
    const invite = await this.findPendingInviteByToken(token, {
      id: true,
      workspaceId: true,
      email: true,
      role: true,
    });

    if (invite.email !== userEmail.trim().toLowerCase()) {
      throw new BadRequestException(
        'This invite was sent to a different email address',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      });

      await this.joinWorkspace(tx, invite.workspaceId, userId, invite.role);
    });

    return { workspaceId: invite.workspaceId };
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  // Creates (or restores) the WorkspaceMember row for userId joining
  // workspaceId, then adds them to every PUBLIC channel. WorkspaceMember has
  // a hard @@unique([workspaceId, userId]) with no deletedAt exception, so a
  // user who was previously removed (soft-deleted) and is now being
  // re-invited/re-added still has a row occupying that pair — blindly
  // creating a new one throws P2002 ("already exists"). Restoring that row
  // instead avoids the conflict; it resets accountingRole/aiModelTier to
  // their just-joined defaults, since accounting access is only ever granted
  // fresh by a platform admin (see WorkspaceMember.accountingRole) and a
  // stale privileged tier shouldn't silently survive a removal.
  private async joinWorkspace(
    tx: Prisma.TransactionClient,
    workspaceId: string,
    userId: string,
    role: Role,
  ): Promise<void> {
    const existing = await tx.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (existing && !existing.deletedAt) return; // already an active member

    if (existing) {
      await tx.workspaceMember.update({
        where: { id: existing.id },
        data: { deletedAt: null, role, accountingRole: null, aiModelTier: 'STANDARD' },
      });
    } else {
      await tx.workspaceMember.create({ data: { workspaceId, userId, role } });
    }

    await this.channels.joinAllPublicChannels(workspaceId, userId, tx);
  }

  // Called once, from create(). Idempotent via the count check so it can be
  // safely re-pointed at another call site (or re-run) without duplicating
  // accounts.
  private async provisionDefaultBankAccounts(
    tx: Prisma.TransactionClient,
    workspaceId: string,
  ): Promise<void> {
    const existingCount = await tx.bankAccount.count({
      where: { workspaceId },
    });
    if (existingCount > 0) return;

    await tx.bankAccount.createMany({
      data: DEFAULT_BANK_ACCOUNTS.map((account) => ({
        workspaceId,
        bankName: account.bankName,
        accountType: account.accountType,
        currencyType: account.currencyType,
        logoUrl: account.logoUrl,
        amount: 0,
      })),
    });
  }

  private async prepareInviteContext(
    workspaceId: string,
    inviterId: string,
    role: Role,
  ): Promise<InviteContext> {
    if (role !== 'OWNER' && role !== 'MANAGER') {
      throw new ForbiddenException(OWNER_OR_MANAGER_ONLY);
    }

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    const inviter = await this.prisma.user.findFirst({
      where: { id: inviterId, deletedAt: null },
      select: { fullName: true },
    });

    return {
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      inviterId,
      inviterName: inviter?.fullName ?? 'A team member',
    };
  }

  private async findPendingInviteByToken<
    TSelect extends Prisma.WorkspaceInviteSelect,
  >(
    token: string,
    select: TSelect,
  ): Promise<Prisma.WorkspaceInviteGetPayload<{ select: TSelect }>> {
    const invite = await this.prisma.workspaceInvite.findFirst({
      where: {
        inviteToken: this.hashToken(token),
        status: 'PENDING',
        expiresAt: { gt: new Date() },
      },
      select,
    });

    if (!invite) {
      throw new NotFoundException('Invite not found, already used, or expired');
    }

    return invite;
  }

  // An invite carries a workspace role only. Accounting access is granted
  // separately, after acceptance, by a platform admin — so there is no
  // accountingRole parameter here to pass through, and no way for a
  // workspace owner to grant accounting access by inviting someone.
  private async sendInviteToEmail(
    inviteContext: InviteContext,
    email: string,
    inviteRole: Role,
  ): Promise<BatchInviteMemberResult> {
    const inviteeEmail = email.trim().toLowerCase();

    const alreadyMember = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId: inviteContext.workspaceId,
        deletedAt: null,
        user: { email: inviteeEmail, deletedAt: null },
      },
      select: { id: true },
    });

    if (alreadyMember) {
      return {
        email: inviteeEmail,
        status: 'already_member',
        message: null,
      };
    }

    await this.prisma.workspaceInvite.updateMany({
      where: {
        workspaceId: inviteContext.workspaceId,
        email: inviteeEmail,
        status: 'PENDING',
      },
      data: { status: 'REVOKED' },
    });

    const rawToken = randomUUID();
    const tokenHash = this.hashToken(rawToken);
    const invite = await this.prisma.workspaceInvite.create({
      data: {
        workspaceId: inviteContext.workspaceId,
        email: inviteeEmail,
        role: inviteRole,
        inviteToken: tokenHash,
        invitedBy: inviteContext.inviterId,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
      },
      select: { id: true },
    });

    const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
    const inviteUrl = `${frontendUrl}/invite?token=${rawToken}`;

    try {
      await this.email.sendWorkspaceInviteEmail(
        inviteeEmail,
        inviteContext.inviterName,
        inviteContext.workspaceName,
        inviteUrl,
      );

      return {
        email: inviteeEmail,
        status: 'invited',
        message: null,
      };
    } catch {
      await this.prisma.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'REVOKED' },
      });

      return {
        email: inviteeEmail,
        status: 'failed',
        message: 'Failed to send invite email',
      };
    }
  }

  // MANAGER is a full peer of OWNER here — see OWNER_OR_MANAGER_ONLY's
  // comment for why, and for the one deliberate exception
  // (changeMemberAccountingRole uses assertActorIsPlatformAdmin instead).
  private async assertActorIsOwnerOrManager(
    workspaceId: string,
    actorId: string,
  ): Promise<void> {
    const actor = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: actorId, deletedAt: null },
      select: { role: true },
    });

    if (!actor) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    if (actor.role !== 'OWNER' && actor.role !== 'MANAGER') {
      throw new ForbiddenException(OWNER_OR_MANAGER_ONLY);
    }
  }

  // Company-level check, deliberately not workspace-scoped: no membership
  // lookup, so a platform admin can manage accounting access regardless of
  // which workspaces they belong to. Reads the flag fresh from the database
  // rather than trusting anything on the request.
  private async assertActorIsPlatformAdmin(actorId: string): Promise<void> {
    const actor = await this.prisma.user.findFirst({
      where: { id: actorId, deletedAt: null },
      select: { isPlatformAdmin: true },
    });

    if (!actor?.isPlatformAdmin) {
      throw new ForbiddenException(PLATFORM_ADMIN_ONLY);
    }
  }

  async removeMember(
    workspaceId: string,
    memberId: string,
    actorId: string,
  ): Promise<void> {
    await this.assertActorIsOwnerOrManager(workspaceId, actorId);

    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId, deletedAt: null },
      select: { id: true, userId: true, user: { select: { fullName: true } } },
    });

    // Fallback: if client passed a userId instead of workspaceMember id,
    // try to resolve membership by userId.
    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId, deletedAt: null },
        select: {
          id: true,
          userId: true,
          user: { select: { fullName: true } },
        },
      });
    }

    if (!member) {
      // Not an actual member yet — listMembers() merges still-pending invites
      // into the same list, keyed by WorkspaceInvite.id (no WorkspaceMember
      // row exists until an invite is accepted), so a "remove" on one of
      // those rows lands here rather than as a memberId/userId match.
      const invite = await this.prisma.workspaceInvite.findFirst({
        where: { id: memberId, workspaceId, status: 'PENDING' },
        select: { id: true, email: true },
      });

      if (invite) {
        await this.prisma.workspaceInvite.update({
          where: { id: invite.id },
          data: { status: 'REVOKED' },
        });
        await this.prisma.activityLog.create({
          data: {
            workspaceId,
            entityType: 'workspace',
            entityId: workspaceId,
            action: 'invite_revoked',
            metadata: { email: invite.email },
            performedBy: actorId,
          },
        });
        return;
      }

      throw new NotFoundException('Member not found');
    }

    await this.prisma.workspaceMember.update({
      where: { id: member.id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'workspace',
        entityId: workspaceId,
        action: 'member_removed',
        metadata: {
          memberId: member.userId,
          memberName: member.user?.fullName ?? null,
        },
        performedBy: actorId,
      },
    });
  }

  async changeMemberRole(
    workspaceId: string,
    memberId: string,
    newRole: Role,
    actorId: string,
  ): Promise<void> {
    // ChangeMemberRoleDto's own enum already excludes OWNER, so this can't
    // be reached over HTTP today — kept anyway as the same defense-in-depth
    // this codebase already uses elsewhere (e.g. the LOCAL-account/PKR
    // currency rule is checked at both the DTO and the service). OWNER is
    // set exactly once, at workspace creation, and is never granted again by
    // any path — this is what actually keeps that true, not just the DTO.
    if (newRole === 'OWNER') {
      throw new BadRequestException(
        'OWNER cannot be granted this way — it is set once, at workspace creation',
      );
    }

    await this.assertActorIsOwnerOrManager(workspaceId, actorId);

    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId, deletedAt: null },
      select: {
        id: true,
        userId: true,
        role: true,
        user: { select: { fullName: true } },
      },
    });

    // Fallback: allow passing a userId in place of workspaceMember id
    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId, deletedAt: null },
        select: {
          id: true,
          userId: true,
          role: true,
          user: { select: { fullName: true } },
        },
      });
    }

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const oldRole = member.role;
    if (oldRole === newRole) return;

    await this.prisma.workspaceMember.update({
      where: { id: member.id },
      data: { role: newRole },
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'workspace',
        entityId: workspaceId,
        action: 'member_role_changed',
        fieldName: 'role',
        oldValue: oldRole,
        newValue: newRole,
        metadata: {
          memberId: member.userId,
          memberName: member.user?.fullName ?? null,
        },
        performedBy: actorId,
      },
    });
  }

  // The ONLY place WorkspaceMember.accountingRole is ever written. Restricted
  // to platform admins, NOT workspace owners: a workspace can have several
  // owners, and granting financial access is a company-level decision rather
  // than a workspace-management one. PlatformAdminGuard already blocks this
  // at the route, and the assert below repeats it here so the service can't
  // be reached around by a future caller that forgets the guard.
  async changeMemberAccountingRole(
    workspaceId: string,
    memberId: string,
    newAccountingRole: UserRole | null,
    actorId: string,
  ): Promise<void> {
    await this.assertActorIsPlatformAdmin(actorId);

    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId, deletedAt: null },
      select: {
        id: true,
        userId: true,
        accountingRole: true,
        user: { select: { fullName: true } },
      },
    });

    // Fallback: allow passing a userId in place of workspaceMember id
    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId, deletedAt: null },
        select: {
          id: true,
          userId: true,
          accountingRole: true,
          user: { select: { fullName: true } },
        },
      });
    }

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const oldAccountingRole = member.accountingRole;
    if (oldAccountingRole === newAccountingRole) return;

    await this.prisma.workspaceMember.update({
      where: { id: member.id },
      data: { accountingRole: newAccountingRole },
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'workspace',
        entityId: workspaceId,
        action: 'member_accounting_role_changed',
        fieldName: 'accountingRole',
        oldValue: oldAccountingRole,
        newValue: newAccountingRole,
        metadata: {
          memberId: member.userId,
          memberName: member.user?.fullName ?? null,
        },
        performedBy: actorId,
      },
    });
  }

  async addMemberByUserId(
    workspaceId: string,
    userId: string,
    role: Role,
    actorId: string,
  ): Promise<void> {
    await this.assertActorIsOwnerOrManager(workspaceId, actorId);

    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, fullName: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: user.id, deletedAt: null },
      select: { id: true },
    });

    if (existing)
      throw new ConflictException('User is already a member of the workspace');

    await this.prisma.$transaction(async (tx) => {
      await this.joinWorkspace(tx, workspaceId, user.id, role);
      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'workspace',
          entityId: workspaceId,
          action: 'member_added',
          metadata: { memberId: user.id, memberName: user.fullName },
          performedBy: actorId,
        },
      });
    });
  }

  async addMembersByUserIds(
    workspaceId: string,
    userIds: string[],
    role: Role,
    actorId: string,
  ): Promise<BatchAddResult> {
    await this.assertActorIsOwnerOrManager(workspaceId, actorId);

    const uniqueIds = [...new Set(userIds.map((id) => id.trim()))];
    const results: BatchAddMemberResult[] = [];

    for (const uid of uniqueIds) {
      try {
        const user = await this.prisma.user.findFirst({
          where: { id: uid, deletedAt: null },
          select: { id: true, fullName: true },
        });

        if (!user) {
          results.push({
            userId: uid,
            status: 'failed',
            message: 'User not found',
          });
          continue;
        }

        const existing = await this.prisma.workspaceMember.findFirst({
          where: { workspaceId, userId: user.id, deletedAt: null },
          select: { id: true },
        });

        if (existing) {
          results.push({
            userId: uid,
            status: 'already_member',
            message: null,
          });
          continue;
        }

        await this.prisma.$transaction(async (tx) => {
          await this.joinWorkspace(tx, workspaceId, user.id, role);
          await tx.activityLog.create({
            data: {
              workspaceId,
              entityType: 'workspace',
              entityId: workspaceId,
              action: 'member_added',
              metadata: { memberId: user.id, memberName: user.fullName },
              performedBy: actorId,
            },
          });
        });

        results.push({ userId: uid, status: 'added', message: null });
      } catch (err: any) {
        results.push({
          userId: uid,
          status: 'failed',
          message: err?.message ?? 'Failed to add user',
        });
      }
    }

    return {
      results,
      summary: {
        total: results.length,
        added: results.filter((r) => r.status === 'added').length,
        alreadyMember: results.filter((r) => r.status === 'already_member')
          .length,
        failed: results.filter((r) => r.status === 'failed').length,
      },
    };
  }
}
