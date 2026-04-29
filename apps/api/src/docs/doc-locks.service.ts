import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { BLOCK_LOCK_TTL_MS } from './doc-permissions.constants';

export type DocBlockLock = {
  docId: string;
  blockId: string;
  userId: string;
  socketId: string;
  expiresAt: number;
};

export type LockAcquireResult =
  | { acquired: true; lock: DocBlockLock }
  | { acquired: false; lock: DocBlockLock };

@Injectable()
export class DocLocksService implements OnModuleDestroy {
  // NOTE: single-instance only - this in-memory state needs Redis locks/pub-sub to scale out.
  private readonly locks = new Map<string, Map<string, DocBlockLock>>();
  private readonly cleanupTimer: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupTimer = setInterval(() => this.cleanupExpiredLocks(), BLOCK_LOCK_TTL_MS);
    this.cleanupTimer.unref?.();
  }

  onModuleDestroy(): void {
    clearInterval(this.cleanupTimer);
  }

  acquire(
    docId: string,
    blockId: string,
    userId: string,
    socketId: string,
    now = Date.now(),
  ): LockAcquireResult {
    const roomLocks = this.getRoomLocks(docId);
    const existing = roomLocks.get(blockId);

    if (existing && existing.expiresAt > now && existing.userId !== userId) {
      return { acquired: false, lock: existing };
    }

    const lock: DocBlockLock = {
      docId,
      blockId,
      userId,
      socketId,
      expiresAt: now + BLOCK_LOCK_TTL_MS,
    };
    roomLocks.set(blockId, lock);
    return { acquired: true, lock };
  }

  heartbeat(
    docId: string,
    blockId: string,
    userId: string,
    socketId: string,
    now = Date.now(),
  ): DocBlockLock | null {
    const lock = this.locks.get(docId)?.get(blockId);
    if (!lock || lock.userId !== userId || lock.socketId !== socketId || lock.expiresAt <= now) {
      return null;
    }

    lock.expiresAt = now + BLOCK_LOCK_TTL_MS;
    return lock;
  }

  releaseBlock(docId: string, blockId: string, userId: string, socketId: string): boolean {
    const roomLocks = this.locks.get(docId);
    const lock = roomLocks?.get(blockId);
    if (!roomLocks || !lock || lock.userId !== userId || lock.socketId !== socketId) {
      return false;
    }

    roomLocks.delete(blockId);
    if (roomLocks.size === 0) this.locks.delete(docId);
    return true;
  }

  releaseForSocket(socketId: string, docId?: string): DocBlockLock[] {
    const released: DocBlockLock[] = [];
    const docEntries = docId
      ? Array.from(this.locks.entries()).filter(([candidateDocId]) => candidateDocId === docId)
      : Array.from(this.locks.entries());

    for (const [roomDocId, roomLocks] of docEntries) {
      for (const [blockId, lock] of Array.from(roomLocks.entries())) {
        if (lock.socketId === socketId) {
          roomLocks.delete(blockId);
          released.push(lock);
        }
      }
      if (roomLocks.size === 0) this.locks.delete(roomDocId);
    }

    return released;
  }

  getSnapshot(docId: string, now = Date.now()): DocBlockLock[] {
    const roomLocks = this.locks.get(docId);
    if (!roomLocks) return [];

    return Array.from(roomLocks.values())
      .filter((lock) => lock.expiresAt > now)
      .map((lock) => ({ ...lock }));
  }

  getOwnedBlockIds(docId: string, userId: string, now = Date.now()): Set<string> {
    return new Set(
      this.getSnapshot(docId, now)
        .filter((lock) => lock.userId === userId)
        .map((lock) => lock.blockId),
    );
  }

  cleanupExpiredLocks(now = Date.now()): DocBlockLock[] {
    const released: DocBlockLock[] = [];
    for (const [docId, roomLocks] of Array.from(this.locks.entries())) {
      for (const [blockId, lock] of Array.from(roomLocks.entries())) {
        if (lock.expiresAt <= now) {
          roomLocks.delete(blockId);
          released.push(lock);
        }
      }
      if (roomLocks.size === 0) this.locks.delete(docId);
    }
    return released;
  }

  private getRoomLocks(docId: string): Map<string, DocBlockLock> {
    let roomLocks = this.locks.get(docId);
    if (!roomLocks) {
      roomLocks = new Map();
      this.locks.set(docId, roomLocks);
    }
    return roomLocks;
  }
}
