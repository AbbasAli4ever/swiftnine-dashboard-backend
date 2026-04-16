import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import { EmailService } from '@app/common';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
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
          metadata: { workspaceName: workspace.name },
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
    if (role !== 'OWNER') throw new ForbiddenException(OWNER_ONLY);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    const inviteeEmail = dto.email.trim().toLowerCase();

    // Silent return if already an active member
    const alreadyMember = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        deletedAt: null,
        user: { email: inviteeEmail, deletedAt: null },
      },
      select: { id: true },
    });
    if (alreadyMember) return;

    const inviter = await this.prisma.user.findFirst({
      where: { id: inviterId, deletedAt: null },
      select: { fullName: true },
    });

    // Revoke any existing pending invite for this email in this workspace
    await this.prisma.workspaceInvite.updateMany({
      where: { workspaceId, email: inviteeEmail, status: 'PENDING' },
      data: { status: 'REVOKED' },
    });

    const rawToken = randomUUID();
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.workspaceInvite.create({
      data: {
        workspaceId,
        email: inviteeEmail,
        role: dto.role,
        inviteToken: tokenHash,
        invitedBy: inviterId,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
    const inviteUrl = `${frontendUrl}/invite?token=${rawToken}`;

    await this.email.sendWorkspaceInviteEmail(
      inviteeEmail,
      inviter?.fullName ?? 'A team member',
      workspace.name,
      inviteUrl,
    );
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
}
