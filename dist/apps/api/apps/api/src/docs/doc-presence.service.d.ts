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
export declare class DocPresenceService {
    private readonly rooms;
    join(docId: string, socketId: string, user: AuthUser, now?: number): DocPresenceEntry;
    leave(socketId: string, docId?: string): string[];
    getJoinedDocIds(socketId: string): string[];
    snapshot(docId: string, locksByUser?: Map<string, string[]>): DocPresenceUser[];
    private getRoom;
}
