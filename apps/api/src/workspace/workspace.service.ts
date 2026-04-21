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
import type { Prisma, Role, InviteStatus } from '@app/database/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'node:crypto';
import {
  type AuthUser,
  AuthService,
  type TokenPair,
} from '../auth/auth.service';
import type { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type { InviteMemberDto } from './dto/invite-member.dto';
import type { ClaimInviteDto } from './dto/claim-invite.dto';
import type { BatchInviteMembersDto } from './dto/batch-invite-members.dto';

const WORKSPACE_NOT_FOUND = 'Workspace not found';
const OWNER_ONLY = 'Only the workspace owner can perform this action';
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
  ) {}

  async create(userId: string, dto: CreateWorkspaceDto): Promise<WorkspaceData> {
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

  async findOne(workspaceId: string, userId: string): Promise<WorkspaceData & { memberCount: number }> {
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

  async listMembers(
    workspaceId: string,
  ): Promise<
    Array<{
      id: string;
      fullName: string;
      email: string;
      role: Role;
      lastActive: Date | null;
      invitedBy: string | null;
      invitedOn: Date | null;
      inviteStatus: InviteStatus | null;
    }>
  > {
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId, deletedAt: null },
      select: {
        role: true,
        createdAt: true,
        user: { select: { id: true, fullName: true, email: true, lastSeenAt: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const emails = [...new Set(members.map((m) => m.user.email.trim().toLowerCase()))];

    const invites =
      emails.length > 0
        ? await this.prisma.workspaceInvite.findMany({
              where: { workspaceId, email: { in: emails } },
              select: { email: true, createdAt: true, status: true, sender: { select: { fullName: true } } },
              orderBy: { createdAt: 'desc' },
            })
        : [];

      const inviteMap = new Map<
        string,
        { email: string; createdAt: Date; status?: InviteStatus; sender?: { fullName: string } }
      >();
    for (const inv of invites) {
      const key = inv.email.trim().toLowerCase();
      if (!inviteMap.has(key)) inviteMap.set(key, inv as any);
    }

    return members.map((m) => {
      const u = m.user;
      const key = u.email.trim().toLowerCase();
      const inv = inviteMap.get(key);
      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: m.role,
        lastActive: (u as any).lastSeenAt ?? null,
        invitedBy: inv?.sender?.fullName ?? null,
        invitedOn: inv?.createdAt ?? null,
        inviteStatus: (inv as any)?.status ?? null,
      };
    });
  }

  async update(
    workspaceId: string,
    userId: string,
    role: Role,
    dto: UpdateWorkspaceDto,
  ): Promise<WorkspaceData> {
    if (role !== 'OWNER') throw new ForbiddenException(OWNER_ONLY);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: WORKSPACE_SELECT,
    });
    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    const updateData: Prisma.WorkspaceUpdateInput = {};
    const logEntries: Array<{ fieldName: string; oldValue: string | null; newValue: string | null }> = [];

    if (dto.name !== undefined && dto.name !== workspace.name) {
      updateData.name = dto.name.trim();
      logEntries.push({ fieldName: 'name', oldValue: workspace.name, newValue: dto.name.trim() });
    }

    if (dto.logoUrl !== undefined && dto.logoUrl !== workspace.logoUrl) {
      updateData.logoUrl = dto.logoUrl;
      logEntries.push({ fieldName: 'logoUrl', oldValue: workspace.logoUrl ?? null, newValue: dto.logoUrl ?? null });
    }

    if (dto.workspaceUse !== undefined && dto.workspaceUse !== workspace.workspaceUse) {
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
    if (role !== 'OWNER') throw new ForbiddenException(OWNER_ONLY);

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
    const inviteContext = await this.prepareInviteContext(workspaceId, inviterId, role);
    const result = await this.sendInviteToEmail(inviteContext, dto.email, dto.role);

    if (result.status === 'failed') {
      throw new InternalServerErrorException(result.message ?? 'Failed to send invite email');
    }
  }

  async sendBatchInvites(
    workspaceId: string,
    inviterId: string,
    role: Role,
    dto: BatchInviteMembersDto,
  ): Promise<BatchInviteResult> {
    const inviteContext = await this.prepareInviteContext(workspaceId, inviterId, role);
    const uniqueEmails = [...new Set(dto.emails.map((email) => email.trim().toLowerCase()))];
    const results: BatchInviteMemberResult[] = [];

    for (const email of uniqueEmails) {
      results.push(await this.sendInviteToEmail(inviteContext, email, dto.role));
    }

    return {
      results,
      summary: {
        total: results.length,
        invited: results.filter((result) => result.status === 'invited').length,
        alreadyMember: results.filter((result) => result.status === 'already_member').length,
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
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            avatarColor: true,
          },
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
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            avatarColor: true,
          },
        });
      }

      const existingMember = await tx.workspaceMember.findFirst({
        where: {
          workspaceId: invite.workspaceId,
          userId: authUser.id,
          deletedAt: null,
        },
        select: { id: true },
      });

      await tx.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      });

      if (!existingMember) {
        await tx.workspaceMember.create({
          data: {
            workspaceId: invite.workspaceId,
            userId: authUser.id,
            role: invite.role,
          },
        });
      }

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
      throw new BadRequestException('This invite was sent to a different email address');
    }

    // Idempotent: if already a member, just mark invite accepted
    const existingMember = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: invite.workspaceId, userId, deletedAt: null },
      select: { id: true },
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.workspaceInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() },
      });

      if (!existingMember) {
        await tx.workspaceMember.create({
          data: {
            workspaceId: invite.workspaceId,
            userId,
            role: invite.role,
          },
        });
      }
    });

    return { workspaceId: invite.workspaceId };
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private async prepareInviteContext(
    workspaceId: string,
    inviterId: string,
    role: Role,
  ): Promise<InviteContext> {
    if (role !== 'OWNER') throw new ForbiddenException(OWNER_ONLY);

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

  private async findPendingInviteByToken<TSelect extends Prisma.WorkspaceInviteSelect>(
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

  private async assertActorIsOwnerOrAdmin(
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

    const roleStr = String(actor.role);
    if (!['OWNER', 'ADMIN'].includes(roleStr)) {
      throw new ForbiddenException('Only owner or admin can perform this action');
    }
  }

  async removeMember(
    workspaceId: string,
    memberId: string,
    actorId: string,
  ): Promise<void> {
    await this.assertActorIsOwnerOrAdmin(workspaceId, actorId);

    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId, deletedAt: null },
      select: { id: true, userId: true, user: { select: { fullName: true } } },
    });

    // Fallback: if client passed a userId instead of workspaceMember id,
    // try to resolve membership by userId.
    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId, deletedAt: null },
        select: { id: true, userId: true, user: { select: { fullName: true } } },
      });
    }

    if (!member) {
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
    await this.assertActorIsOwnerOrAdmin(workspaceId, actorId);

    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId, deletedAt: null },
      select: { id: true, userId: true, role: true, user: { select: { fullName: true } } },
    });

    // Fallback: allow passing a userId in place of workspaceMember id
    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId, deletedAt: null },
        select: { id: true, userId: true, role: true, user: { select: { fullName: true } } },
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
}
