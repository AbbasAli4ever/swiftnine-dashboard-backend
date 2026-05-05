import {
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import {
  ACCESS_TOKEN_PAYLOAD_SCHEMA,
  INVALID_ACCESS_TOKEN_MESSAGE,
} from '../auth/auth.constants';
import { AuthService, type AuthUser } from '../auth/auth.service';
import { PresenceService } from './presence.service';

type PresenceSocketData = {
  user?: AuthUser;
};

type PresenceSocket = Socket & {
  data: PresenceSocketData;
};

@WebSocketGateway({
  namespace: '/presence',
  cors: { origin: true, credentials: true },
})
export class PresenceGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  private server!: Server;

  private readonly logger = new Logger(PresenceGateway.name);

  constructor(
    private readonly presence: PresenceService,
    private readonly jwt: JwtService,
    private readonly auth: AuthService,
    config: ConfigService,
  ) {
    if (Number(config.get<string>('INSTANCE_COUNT') ?? '1') > 1) {
      this.logger.warn(
        'Presence realtime uses an in-memory socket registry; configure Redis before scaling instances',
      );
    }
  }

  afterInit(server: Server): void {
    this.presence.bindServer(server);
  }

  async handleConnection(client: PresenceSocket): Promise<void> {
    try {
      client.data.user = await this.authenticate(client);
      this.logger.log(
        `Presence socket connected: ${client.id} user=${client.data.user.id}`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : INVALID_ACCESS_TOKEN_MESSAGE;
      client.emit('presence:error', { reason: message });
      client.disconnect(true);
    }
  }

  @SubscribeMessage('presence:subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: PresenceSocket,
    @MessageBody() _payload?: unknown,
  ): Promise<void> {
    const user = this.requireUser(client);
    const workspaceIds = await this.presence.listWorkspaceIdsForUser(user.id);

    await Promise.all(
      workspaceIds.map((workspaceId) => client.join(this.roomName(workspaceId))),
    );
  }

  private async authenticate(client: PresenceSocket): Promise<AuthUser> {
    const auth = client.handshake.auth as Record<string, unknown> | undefined;
    const token = typeof auth?.['token'] === 'string' ? auth['token'].trim() : '';

    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    const payload = await this.jwt.verifyAsync<Record<string, unknown>>(token);
    const parsedPayload = ACCESS_TOKEN_PAYLOAD_SCHEMA.safeParse(payload);
    if (!parsedPayload.success) {
      throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
    }

    const user = await this.auth.findActiveAuthUser(
      parsedPayload.data.sub,
      parsedPayload.data.email,
    );
    if (!user) {
      throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
    }
    return user;
  }

  private requireUser(client: PresenceSocket): AuthUser {
    if (!client.data.user) {
      throw new WsException('Authentication required');
    }
    return client.data.user;
  }

  private roomName(workspaceId: string): string {
    return `workspace:${workspaceId}`;
  }
}
