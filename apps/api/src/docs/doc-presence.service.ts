import { Injectable } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.service';

export type DocPresenceEntry = {
  socketId: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  joinedAt: number;
};

export type DocPresenceUser = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  socketIds: string[];
  locks: string[];
};

@Injectable()
export class DocPresenceService {
  // NOTE: single-instance only - this in-memory presence needs Redis pub/sub to scale out.
  private readonly rooms = new Map<string, Map<string, DocPresenceEntry>>();

  join(docId: string, socketId: string, user: AuthUser, now = Date.now()): DocPresenceEntry {
    const room = this.getRoom(docId);
    const entry: DocPresenceEntry = {
      socketId,
      userId: user.id,
      name: user.fullName,
      avatarUrl: user.avatarUrl,
      joinedAt: now,
    };
    room.set(socketId, entry);
    return entry;
  }

  leave(socketId: string, docId?: string): string[] {
    const leftDocIds: string[] = [];
    const rooms = docId
      ? Array.from(this.rooms.entries()).filter(([candidateDocId]) => candidateDocId === docId)
      : Array.from(this.rooms.entries());

    for (const [roomDocId, room] of rooms) {
      if (room.delete(socketId)) leftDocIds.push(roomDocId);
      if (room.size === 0) this.rooms.delete(roomDocId);
    }

    return leftDocIds;
  }

  getJoinedDocIds(socketId: string): string[] {
    return Array.from(this.rooms.entries())
      .filter(([, room]) => room.has(socketId))
      .map(([docId]) => docId);
  }

  snapshot(docId: string, locksByUser = new Map<string, string[]>()): DocPresenceUser[] {
    const users = new Map<string, DocPresenceUser>();

    for (const entry of this.rooms.get(docId)?.values() ?? []) {
      const existing = users.get(entry.userId);
      if (existing) {
        existing.socketIds.push(entry.socketId);
        continue;
      }

      users.set(entry.userId, {
        userId: entry.userId,
        name: entry.name,
        avatarUrl: entry.avatarUrl,
        socketIds: [entry.socketId],
        locks: locksByUser.get(entry.userId) ?? [],
      });
    }

    return Array.from(users.values());
  }

  private getRoom(docId: string): Map<string, DocPresenceEntry> {
    let room = this.rooms.get(docId);
    if (!room) {
      room = new Map();
      this.rooms.set(docId, room);
    }
    return room;
  }
}
