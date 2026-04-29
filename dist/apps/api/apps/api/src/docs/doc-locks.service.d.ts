import { OnModuleDestroy } from '@nestjs/common';
export type DocBlockLock = {
    docId: string;
    blockId: string;
    userId: string;
    socketId: string;
    expiresAt: number;
};
export type LockAcquireResult = {
    acquired: true;
    lock: DocBlockLock;
} | {
    acquired: false;
    lock: DocBlockLock;
};
export declare class DocLocksService implements OnModuleDestroy {
    private readonly locks;
    private readonly cleanupTimer;
    constructor();
    onModuleDestroy(): void;
    acquire(docId: string, blockId: string, userId: string, socketId: string, now?: number): LockAcquireResult;
    heartbeat(docId: string, blockId: string, userId: string, socketId: string, now?: number): DocBlockLock | null;
    releaseBlock(docId: string, blockId: string, userId: string, socketId: string): boolean;
    releaseForSocket(socketId: string, docId?: string): DocBlockLock[];
    getSnapshot(docId: string, now?: number): DocBlockLock[];
    getOwnedBlockIds(docId: string, userId: string, now?: number): Set<string>;
    cleanupExpiredLocks(now?: number): DocBlockLock[];
    private getRoomLocks;
}
