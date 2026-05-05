import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Server } from 'socket.io';
import type { AuthUser } from '../auth/auth.service';

type PresenceChangedPayload = {
  userId: string;
  isOnline: boolean;
  lastSeenAt: Date | null;
};

@Injectable()
export class PresenceService {
  // NOTE: single-instance only - this in-memory socket registry needs Redis to scale out.
  private readonly socketToUser = new Map<string, string>();
  private readonly userToSockets = new Map<string, Set<string>>();
  private server: Server | null = null;

  constructor(private readonly prisma: PrismaService) {}

  bindServer(server: Server): void {
    this.server = server;
  }

  async connect(socketId: string, user: AuthUser): Promise<void> {
    const existingUserId = this.socketToUser.get(socketId);
    if (existingUserId === user.id) {
      return;
    }
    if (existingUserId && existingUserId !== user.id) {
      await this.disconnect(socketId);
    }

    const sockets = this.userToSockets.get(user.id) ?? new Set<string>();
    const wasOffline = sockets.size === 0;

    sockets.add(socketId);
    this.userToSockets.set(user.id, sockets);
    this.socketToUser.set(socketId, user.id);

    if (!wasOffline) {
      return;
    }

    const [updatedUser, workspaceIds] = await Promise.all([
      this.prisma.user.update({
        where: { id: user.id },
        data: { isOnline: true },
        select: { id: true, lastSeenAt: true },
      }),
      this.listWorkspaceIdsForUser(user.id),
    ]);

    this.broadcast(workspaceIds, {
      userId: updatedUser.id,
      isOnline: true,
      lastSeenAt: updatedUser.lastSeenAt,
    });
  }

  async disconnect(socketId: string): Promise<void> {
    const userId = this.socketToUser.get(socketId);
    if (!userId) {
      return;
    }

    this.socketToUser.delete(socketId);
    const sockets = this.userToSockets.get(userId);
    if (!sockets) {
      return;
    }

    sockets.delete(socketId);
    if (sockets.size > 0) {
      return;
    }

    this.userToSockets.delete(userId);
    const lastSeenAt = new Date();

    const [updatedUser, workspaceIds] = await Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
          lastSeenAt,
        },
        select: { id: true, lastSeenAt: true },
      }),
      this.listWorkspaceIdsForUser(userId),
    ]);

    this.broadcast(workspaceIds, {
      userId: updatedUser.id,
      isOnline: false,
      lastSeenAt: updatedUser.lastSeenAt,
    });
  }

  async listWorkspaceIdsForUser(userId: string): Promise<string[]> {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: {
        userId,
        deletedAt: null,
        workspace: { deletedAt: null },
      },
      select: { workspaceId: true },
    });

    return memberships.map((membership) => membership.workspaceId);
  }

  private broadcast(
    workspaceIds: string[],
    payload: PresenceChangedPayload,
  ): void {
    if (!this.server || workspaceIds.length === 0) {
      return;
    }

    for (const workspaceId of workspaceIds) {
      this.server.to(this.roomName(workspaceId)).emit('presence:changed', payload);
    }
  }

  private roomName(workspaceId: string): string {
    return `workspace:${workspaceId}`;
  }
}
