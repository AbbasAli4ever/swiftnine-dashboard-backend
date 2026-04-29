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
  OnGatewayDisconnect,
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
import { DocLocksService } from './doc-locks.service';
import { DocPresenceService } from './doc-presence.service';
import { DocSaveConflictException, DocsService } from './docs.service';

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

@WebSocketGateway({
  namespace: '/docs',
  cors: { origin: true, credentials: true },
})
export class DocsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  private readonly logger = new Logger(DocsGateway.name);

  constructor(
    private readonly docs: DocsService,
    private readonly presence: DocPresenceService,
    private readonly locks: DocLocksService,
    private readonly jwt: JwtService,
    private readonly auth: AuthService,
    config: ConfigService,
  ) {
    if (Number(config.get<string>('INSTANCE_COUNT') ?? '1') > 1) {
      this.logger.warn('Docs realtime uses in-memory presence and locks; configure Redis before scaling instances');
    }
  }

  async handleConnection(client: DocsSocket): Promise<void> {
    try {
      client.data.user = await this.authenticate(client);
      this.logger.log(`Docs socket connected: ${client.id} user=${client.data.user.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : INVALID_ACCESS_TOKEN_MESSAGE;
      client.emit('doc:error', { reason: message });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: DocsSocket): void {
    this.logger.log(`Docs socket disconnected: ${client.id}`);
    this.leaveAllRooms(client);
  }

  @SubscribeMessage('doc:join')
  async handleJoin(
    @ConnectedSocket() client: DocsSocket,
    @MessageBody() payload: DocIdPayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const docId = this.requireString(payload.docId, 'docId');

    await this.docs.findOne(user.id, docId);
    await client.join(this.roomName(docId));
    this.presence.join(docId, client.id, user);

    client.emit('doc:presence-snapshot', { users: this.presenceSnapshot(docId) });
    client.emit('doc:lock-snapshot', { locks: this.locks.getSnapshot(docId) });
    client.to(this.roomName(docId)).emit('doc:presence-snapshot', {
      users: this.presenceSnapshot(docId),
    });
  }

  @SubscribeMessage('doc:leave')
  async handleLeave(
    @ConnectedSocket() client: DocsSocket,
    @MessageBody() payload: DocIdPayload,
  ): Promise<void> {
    const docId = this.requireString(payload.docId, 'docId');
    await client.leave(this.roomName(docId));
    this.leaveRoom(client, docId);
  }

  @SubscribeMessage('doc:lock-block')
  async handleLockBlock(
    @ConnectedSocket() client: DocsSocket,
    @MessageBody() payload: BlockPayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const docId = this.requireString(payload.docId, 'docId');
    const blockId = this.requireString(payload.blockId, 'blockId');

    await this.docs.assertCanEditDoc(user.id, docId);
    const result = this.locks.acquire(docId, blockId, user.id, client.id);

    if (!result.acquired) {
      client.emit('doc:lock-rejected', {
        blockId,
        ownerUserId: result.lock.userId,
        expiresAt: result.lock.expiresAt,
      });
      return;
    }

    this.emitLockSnapshot(docId);
  }

  @SubscribeMessage('doc:lock-heartbeat')
  async handleLockHeartbeat(
    @ConnectedSocket() client: DocsSocket,
    @MessageBody() payload: BlockPayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const docId = this.requireString(payload.docId, 'docId');
    const blockId = this.requireString(payload.blockId, 'blockId');
    const lock = this.locks.heartbeat(docId, blockId, user.id, client.id);

    if (!lock) {
      client.emit('doc:lock-rejected', { blockId, reason: 'Lock is not held by this socket' });
      return;
    }

    this.emitLockSnapshot(docId);
  }

  @SubscribeMessage('doc:unlock-block')
  async handleUnlockBlock(
    @ConnectedSocket() client: DocsSocket,
    @MessageBody() payload: BlockPayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const docId = this.requireString(payload.docId, 'docId');
    const blockId = this.requireString(payload.blockId, 'blockId');
    this.locks.releaseBlock(docId, blockId, user.id, client.id);
    this.emitLockSnapshot(docId);
  }

  @SubscribeMessage('doc:autosave')
  async handleAutosave(
    @ConnectedSocket() client: DocsSocket,
    @MessageBody() payload: AutosavePayload,
  ): Promise<void> {
    const user = this.requireUser(client);
    const docId = this.requireString(payload.docId, 'docId');

    const baseVersion = payload.baseVersion;
    if (typeof baseVersion !== 'number' || !Number.isInteger(baseVersion)) {
      throw new WsException('baseVersion must be an integer');
    }

    try {
      const result = await this.docs.autosave(user.id, {
        docId,
        contentJson: payload.contentJson,
        baseVersion,
        lockedBlockIds: this.locks.getOwnedBlockIds(docId, user.id),
      });

      const event = {
        docId,
        doc: result.doc,
        changedBlockIds: result.changedBlockIds,
        orphanedThreadCount: result.orphanedThreadCount,
      };
      client.emit('doc:saved', event);
      client.to(this.roomName(docId)).emit('doc:saved', event);
    } catch (error) {
      if (error instanceof DocSaveConflictException) {
        client.emit('doc:save-conflict', {
          conflictBlockIds: error.conflictBlockIds,
          reason: error.reason,
        });
        return;
      }
      throw error;
    }
  }

  private async authenticate(client: DocsSocket): Promise<AuthUser> {
    const auth = client.handshake.auth as Record<string, unknown> | undefined;

    if (typeof auth?.['shareToken'] === 'string' && !auth['token']) {
      throw new UnauthorizedException('Public share links are not supported yet');
    }

    const token = typeof auth?.['token'] === 'string' ? auth['token'].trim() : '';
    if (!token) throw new UnauthorizedException('Authentication token is required');

    const payload = await this.jwt.verifyAsync<Record<string, unknown>>(token);
    const parsedPayload = ACCESS_TOKEN_PAYLOAD_SCHEMA.safeParse(payload);
    if (!parsedPayload.success) {
      throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
    }

    const user = await this.auth.findActiveAuthUser(
      parsedPayload.data.sub,
      parsedPayload.data.email,
    );
    if (!user) throw new UnauthorizedException(INVALID_ACCESS_TOKEN_MESSAGE);
    return user;
  }

  private requireUser(client: DocsSocket): AuthUser {
    if (!client.data.user) throw new WsException('Authentication required');
    return client.data.user;
  }

  private requireString(value: unknown, field: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new WsException(`${field} is required`);
    }
    return value.trim();
  }

  private leaveAllRooms(client: DocsSocket): void {
    const docIds = new Set([
      ...this.presence.getJoinedDocIds(client.id),
      ...this.locks.releaseForSocket(client.id).map((lock) => lock.docId),
    ]);

    for (const docId of docIds) {
      this.presence.leave(client.id, docId);
      this.emitRoomState(docId);
    }
  }

  private leaveRoom(client: DocsSocket, docId: string): void {
    this.presence.leave(client.id, docId);
    this.locks.releaseForSocket(client.id, docId);
    this.emitRoomState(docId);
  }

  private emitRoomState(docId: string): void {
    this.server.to(this.roomName(docId)).emit('doc:presence-snapshot', {
      users: this.presenceSnapshot(docId),
    });
    this.emitLockSnapshot(docId);
  }

  private emitLockSnapshot(docId: string): void {
    this.server.to(this.roomName(docId)).emit('doc:lock-snapshot', {
      locks: this.locks.getSnapshot(docId),
    });
  }

  private presenceSnapshot(docId: string) {
    const locksByUser = new Map<string, string[]>();
    for (const lock of this.locks.getSnapshot(docId)) {
      const blockIds = locksByUser.get(lock.userId) ?? [];
      blockIds.push(lock.blockId);
      locksByUser.set(lock.userId, blockIds);
    }
    return this.presence.snapshot(docId, locksByUser);
  }

  private roomName(docId: string): string {
    return `doc:${docId}`;
  }
}
