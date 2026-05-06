import {
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/database';
import type { AuthUser } from '../auth/auth.service';
import { AuthService } from '../auth/auth.service';
import { buildWebsocketCorsOptions } from '../config/cors.config';
import { PresenceService } from '../presence/presence.service';
import {
  ACCESS_TOKEN_PAYLOAD_SCHEMA,
  INVALID_ACCESS_TOKEN_MESSAGE,
} from '../auth/auth.constants';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { ChatRateLimitService } from './chat-rate-limit.service';
import { RealtimeMetricsService } from '../realtime/realtime-metrics.service';

type ChatSocketData = {
  user?: AuthUser;
};

type ChatSocket = Socket & {
  data: ChatSocketData;
};

type ChannelIdPayload = {
  channelId?: unknown;
};

type ChatMessagePayload = {
  id: string;
  channelId: string;
  kind: 'USER' | 'SYSTEM';
  pinnedById?: string | null;
  pinnedAt?: Date | null;
};

type ChatReactionPayload = {
  action: 'added' | 'removed';
  messageId: string;
  userId: string;
  emoji: string;
};

type ChatReadPayload = {
  channelId: string;
  userId: string;
  lastReadMessageId: string;
  unreadCount: number;
  readAt: Date;
};

@WebSocketGateway({
  namespace: '/chat',
  cors: buildWebsocketCorsOptions(process.env),
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly auth: AuthService,
    private readonly presence: PresenceService,
    private readonly rateLimits: ChatRateLimitService,
    private readonly metrics: RealtimeMetricsService,
    config: ConfigService,
  ) {
    if (Number(config.get<string>('INSTANCE_COUNT') ?? '1') > 1) {
      this.logger.warn(
        'Chat realtime uses in-memory room fanout; configure Redis before scaling instances',
      );
    }
  }

  async handleConnection(client: ChatSocket): Promise<void> {
    try {
      client.data.user = await this.authenticate(client);
      await this.presence.connect(client.id, client.data.user);
      await this.joinMemberChannelRooms(client, client.data.user.id);
      this.metrics.trackSocketConnected('chat', client.id);
      this.logger.log(
        `Chat socket connected: ${client.id} user=${client.data.user.id}`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : INVALID_ACCESS_TOKEN_MESSAGE;
      client.emit('chat:error', { reason: message });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: ChatSocket): Promise<void> {
    await this.presence.disconnect(client.id);
    this.metrics.trackSocketDisconnected('chat', client.id);
    this.logger.log(`Chat socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat:join')
  async handleJoin(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: ChannelIdPayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const channelId = this.requireString(payload.channelId, 'channelId');

    await this.assertChannelMember(channelId, user.id);
    await client.join(this.roomName(channelId));
  }

  @SubscribeMessage('chat:leave')
  async handleLeave(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: ChannelIdPayload,
  ): Promise<void> {
    this.requireUser(client);
    const channelId = this.requireString(payload.channelId, 'channelId');
    await client.leave(this.roomName(channelId));
  }

  @SubscribeMessage('chat:typing-start')
  async handleTypingStart(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: ChannelIdPayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const channelId = this.requireJoinedChannel(client, payload);
    this.rateLimits.assertTypingEvent(user.id, channelId);

    client.to(this.roomName(channelId)).emit('typing:user-started', {
      channelId,
      userId: user.id,
    });
  }

  @SubscribeMessage('chat:typing-stop')
  async handleTypingStop(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: ChannelIdPayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const channelId = this.requireJoinedChannel(client, payload);
    this.rateLimits.assertTypingEvent(user.id, channelId);

    client.to(this.roomName(channelId)).emit('typing:user-stopped', {
      channelId,
      userId: user.id,
    });
  }

  emitMessageCreated(message: ChatMessagePayload & Record<string, unknown>): void {
    this.emitToChannel(message.channelId, 'message:new', message);
    if (message.kind === 'SYSTEM') {
      this.emitToChannel(message.channelId, 'system:event', message);
    }
  }

  emitMessageEdited(message: ChatMessagePayload & Record<string, unknown>): void {
    this.emitToChannel(message.channelId, 'message:edited', message);
  }

  emitMessageDeleted(
    channelId: string,
    messageId: string,
    deletedAt: Date | null | undefined,
  ): void {
    this.emitToChannel(channelId, 'message:deleted', {
      messageId,
      deletedAt: deletedAt ?? null,
    });
  }

  emitMessagePinned(message: ChatMessagePayload & Record<string, unknown>): void {
    this.emitToChannel(message.channelId, 'message:pinned', {
      message,
      pinnedById: message.pinnedById ?? null,
      pinnedAt: message.pinnedAt ?? null,
    });
  }

  emitMessageUnpinned(channelId: string, messageId: string): void {
    this.emitToChannel(channelId, 'message:unpinned', { messageId });
  }

  emitReaction(channelId: string, payload: ChatReactionPayload): void {
    this.emitToChannel(
      channelId,
      payload.action === 'added' ? 'reaction:added' : 'reaction:removed',
      {
        messageId: payload.messageId,
        userId: payload.userId,
        emoji: payload.emoji,
      },
    );
  }

  emitMemberRead(payload: ChatReadPayload): void {
    this.emitToChannel(payload.channelId, 'member:read', payload);
  }

  private emitToChannel(
    channelId: string,
    event: string,
    payload: Record<string, unknown>,
  ): void {
    if (!this.server) return;
    this.server.to(this.roomName(channelId)).emit(event, payload);
  }

  private async authenticate(client: ChatSocket): Promise<AuthUser> {
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

  private requireUser(client: ChatSocket): AuthUser {
    if (!client.data.user) {
      throw new WsException('Authentication required');
    }
    return client.data.user;
  }

  private requireString(value: unknown, field: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new WsException(`${field} is required`);
    }
    return value.trim();
  }

  private requireJoinedChannel(
    client: ChatSocket,
    payload: ChannelIdPayload,
  ): string {
    const channelId = this.requireString(payload.channelId, 'channelId');
    if (!client.rooms.has(this.roomName(channelId))) {
      throw new WsException('Join the channel before sending typing events');
    }
    return channelId;
  }

  private async assertChannelMember(
    channelId: string,
    userId: string,
  ): Promise<void> {
    const membership = await this.prisma.channelMember.findFirst({
      where: { channelId, userId },
      select: { id: true },
    });

    if (!membership) {
      throw new WsException('Channel membership required');
    }
  }

  private roomName(channelId: string): string {
    return `channel:${channelId}`;
  }

  private async joinMemberChannelRooms(
    client: ChatSocket,
    userId: string,
  ): Promise<void> {
    const memberships = await this.prisma.channelMember.findMany({
      where: { userId },
      select: { channelId: true },
    });

    await Promise.all(
      memberships.map((membership) => client.join(this.roomName(membership.channelId))),
    );
  }
}
