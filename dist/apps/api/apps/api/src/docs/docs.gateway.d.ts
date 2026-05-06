import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { AuthService, type AuthUser } from '../auth/auth.service';
import { PresenceService } from '../presence/presence.service';
import { RealtimeMetricsService } from '../realtime/realtime-metrics.service';
import { DocLocksService } from './doc-locks.service';
import { DocPresenceService } from './doc-presence.service';
import { DocsService } from './docs.service';
type DocsSocketData = {
    user?: AuthUser;
};
type DocsSocket = Socket & {
    data: DocsSocketData;
};
type DocIdPayload = {
    docId?: unknown;
};
type BlockPayload = DocIdPayload & {
    blockId?: unknown;
};
type AutosavePayload = DocIdPayload & {
    contentJson?: unknown;
    baseVersion?: unknown;
};
export declare class DocsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly docs;
    private readonly docPresence;
    private readonly locks;
    private readonly jwt;
    private readonly auth;
    private readonly presence;
    private readonly metrics;
    private server;
    private readonly logger;
    constructor(docs: DocsService, docPresence: DocPresenceService, locks: DocLocksService, jwt: JwtService, auth: AuthService, presence: PresenceService, metrics: RealtimeMetricsService, config: ConfigService);
    handleConnection(client: DocsSocket): Promise<void>;
    handleDisconnect(client: DocsSocket): Promise<void>;
    handleJoin(client: DocsSocket, payload: DocIdPayload): Promise<void>;
    handleLeave(client: DocsSocket, payload: DocIdPayload): Promise<void>;
    handleLockBlock(client: DocsSocket, payload: BlockPayload): Promise<void>;
    handleLockHeartbeat(client: DocsSocket, payload: BlockPayload): Promise<void>;
    handleUnlockBlock(client: DocsSocket, payload: BlockPayload): Promise<void>;
    handleAutosave(client: DocsSocket, payload: AutosavePayload): Promise<void>;
    private authenticate;
    private requireUser;
    private requireString;
    private leaveAllRooms;
    private leaveRoom;
    private emitRoomState;
    private emitLockSnapshot;
    private presenceSnapshot;
    private roomName;
}
export {};
