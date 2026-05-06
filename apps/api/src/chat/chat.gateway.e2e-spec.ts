import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { io, Socket } from 'socket.io-client';
import { PrismaService } from '@app/database';
import { AuthService } from '../auth/auth.service';
import { PresenceService } from '../presence/presence.service';
import { RealtimeMetricsService } from '../realtime/realtime-metrics.service';
import { ChatGateway } from './chat.gateway';
import { ChatRateLimitService } from './chat-rate-limit.service';

describe('ChatGateway (e2e)', () => {
  jest.setTimeout(15000);

  let app: INestApplication;
  let gateway: ChatGateway;
  let port: number;
  let clientA: Socket | null = null;
  let clientB: Socket | null = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        ChatRateLimitService,
        {
          provide: PrismaService,
          useValue: {
            channelMember: {
              findMany: jest.fn().mockResolvedValue([{ channelId: 'channel-1' }]),
              findFirst: jest.fn().mockResolvedValue({ id: 'membership-1' }),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({
              sub: 'user-1',
              email: 'user@example.com',
            }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            findActiveAuthUser: jest.fn().mockResolvedValue({
              id: 'user-1',
              email: 'user@example.com',
              fullName: 'User One',
              avatarUrl: null,
            }),
          },
        },
        {
          provide: PresenceService,
          useValue: {
            connect: jest.fn().mockResolvedValue(undefined),
            disconnect: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RealtimeMetricsService,
          useValue: {
            trackSocketConnected: jest.fn(),
            trackSocketDisconnected: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => '1'),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0);

    gateway = app.get(ChatGateway);
    const address = app.getHttpServer().address();
    port = typeof address === 'string' ? Number(address.split(':').pop()) : address.port;
  });

  afterAll(async () => {
    clientA?.disconnect();
    clientB?.disconnect();
    await app.close();
  });

  it('authenticates, auto-joins channel rooms, and delivers room events', async () => {
    clientA = io(`http://127.0.0.1:${port}/chat`, {
      transports: ['websocket'],
      auth: { token: 'token-a' },
      forceNew: true,
      reconnection: false,
    });
    clientB = io(`http://127.0.0.1:${port}/chat`, {
      transports: ['websocket'],
      auth: { token: 'token-b' },
      forceNew: true,
      reconnection: false,
    });

    await Promise.all([
      onceConnected(clientA),
      onceConnected(clientB),
    ]);

    const messageEvent = onceEvent(clientB, 'message:new');
    gateway.emitMessageCreated({
      id: 'message-1',
      channelId: 'channel-1',
      kind: 'USER',
      plaintext: 'hello',
    });

    await expect(messageEvent).resolves.toEqual(
      expect.objectContaining({
        id: 'message-1',
        channelId: 'channel-1',
        kind: 'USER',
      }),
    );

    const typingEvent = onceEvent(clientB, 'typing:user-started');
    clientA.emit('chat:typing-start', { channelId: 'channel-1' });

    await expect(typingEvent).resolves.toEqual({
      channelId: 'channel-1',
      userId: 'user-1',
    });
  });
});

function onceConnected(client: Socket) {
  return new Promise<void>((resolve, reject) => {
    client.once('connect', () => resolve());
    client.once('connect_error', reject);
    client.once('chat:error', reject);
  });
}

function onceEvent<T>(client: Socket, event: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out waiting for ${event}`));
    }, 5000);

    client.once(event, (payload: T) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}
