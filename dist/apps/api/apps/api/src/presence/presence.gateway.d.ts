import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { AuthService, type AuthUser } from '../auth/auth.service';
import { RealtimeMetricsService } from '../realtime/realtime-metrics.service';
import { PresenceService } from './presence.service';
type PresenceSocketData = {
    user?: AuthUser;
};
type PresenceSocket = Socket & {
    data: PresenceSocketData;
};
export declare class PresenceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly presence;
    private readonly jwt;
    private readonly auth;
    private readonly metrics;
    private server;
    private readonly logger;
    constructor(presence: PresenceService, jwt: JwtService, auth: AuthService, metrics: RealtimeMetricsService, config: ConfigService);
    afterInit(server: Server): void;
    handleConnection(client: PresenceSocket): Promise<void>;
    handleDisconnect(client: PresenceSocket): void;
    handleSubscribe(client: PresenceSocket, _payload?: unknown): Promise<void>;
    private authenticate;
    private requireUser;
    private roomName;
}
export {};
