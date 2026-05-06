import { PrismaService } from "../../../../libs/database/src";
import type { Server } from 'socket.io';
import type { AuthUser } from '../auth/auth.service';
export declare class PresenceService {
    private readonly prisma;
    private readonly socketToUser;
    private readonly userToSockets;
    private server;
    constructor(prisma: PrismaService);
    bindServer(server: Server): void;
    connect(socketId: string, user: AuthUser): Promise<void>;
    disconnect(socketId: string): Promise<void>;
    listWorkspaceIdsForUser(userId: string): Promise<string[]>;
    private broadcast;
    private roomName;
}
