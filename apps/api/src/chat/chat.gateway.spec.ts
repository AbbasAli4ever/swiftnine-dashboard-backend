jest.mock('../auth/auth.service', () => ({
  AuthService: class AuthService {},
}));

import { WsException } from '@nestjs/websockets';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  it('rejects connections without a handshake token', async () => {
    const gateway = new ChatGateway(
      { channelMember: { findFirst: jest.fn(), findMany: jest.fn() } } as never,
      { verifyAsync: jest.fn() } as never,
      { findActiveAuthUser: jest.fn() } as never,
      { connect: jest.fn(), disconnect: jest.fn() } as never,
      { assertTypingEvent: jest.fn() } as never,
      { trackSocketConnected: jest.fn(), trackSocketDisconnected: jest.fn() } as never,
      { get: jest.fn(() => '1') } as never,
    );
    const client = {
      id: 'socket-1',
      handshake: { auth: {} },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    await gateway.handleConnection(client as never);

    expect(client.emit).toHaveBeenCalledWith('chat:error', {
      reason: 'Authentication token is required',
    });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('joins a channel room after membership passes', async () => {
    const gateway = new ChatGateway(
      {
        channelMember: {
          findFirst: jest.fn().mockResolvedValue({ id: 'membership-1' }),
          findMany: jest.fn(),
        },
      } as never,
      {} as never,
      {} as never,
      { connect: jest.fn(), disconnect: jest.fn() } as never,
      { assertTypingEvent: jest.fn() } as never,
      { trackSocketConnected: jest.fn(), trackSocketDisconnected: jest.fn() } as never,
      { get: jest.fn(() => '1') } as never,
    );
    const client = {
      data: { user: { id: 'user-1' } },
      join: jest.fn().mockResolvedValue(undefined),
    };

    await gateway.handleJoin(client as never, { channelId: 'channel-1' });

    expect(client.join).toHaveBeenCalledWith('channel:channel-1');
  });

  it('rejects typing events before the socket joins the channel room', async () => {
    const gateway = new ChatGateway(
      { channelMember: { findFirst: jest.fn(), findMany: jest.fn() } } as never,
      {} as never,
      {} as never,
      { connect: jest.fn(), disconnect: jest.fn() } as never,
      { assertTypingEvent: jest.fn() } as never,
      { trackSocketConnected: jest.fn(), trackSocketDisconnected: jest.fn() } as never,
      { get: jest.fn(() => '1') } as never,
    );
    const client = {
      data: { user: { id: 'user-1' } },
      rooms: new Set(['socket-1']),
      to: jest.fn(),
    };

    await expect(
      gateway.handleTypingStart(client as never, { channelId: 'channel-1' }),
    ).rejects.toBeInstanceOf(WsException);
  });

  it('emits typing events to other room members', async () => {
    const rateLimits = { assertTypingEvent: jest.fn() };
    const gateway = new ChatGateway(
      { channelMember: { findFirst: jest.fn(), findMany: jest.fn() } } as never,
      {} as never,
      {} as never,
      { connect: jest.fn(), disconnect: jest.fn() } as never,
      rateLimits as never,
      { trackSocketConnected: jest.fn(), trackSocketDisconnected: jest.fn() } as never,
      { get: jest.fn(() => '1') } as never,
    );
    const emit = jest.fn();
    const client = {
      data: { user: { id: 'user-1' } },
      rooms: new Set(['socket-1', 'channel:channel-1']),
      to: jest.fn(() => ({ emit })),
    };

    await gateway.handleTypingStart(client as never, { channelId: 'channel-1' });
    await gateway.handleTypingStop(client as never, { channelId: 'channel-1' });

    expect(client.to).toHaveBeenCalledWith('channel:channel-1');
    expect(emit).toHaveBeenNthCalledWith(1, 'typing:user-started', {
      channelId: 'channel-1',
      userId: 'user-1',
    });
    expect(emit).toHaveBeenNthCalledWith(2, 'typing:user-stopped', {
      channelId: 'channel-1',
      userId: 'user-1',
    });
    expect(rateLimits.assertTypingEvent).toHaveBeenNthCalledWith(
      1,
      'user-1',
      'channel-1',
    );
  });

  it('auto-joins all member channel rooms on connect', async () => {
    const presence = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
    };
    const gateway = new ChatGateway(
      {
        channelMember: {
          findFirst: jest.fn(),
          findMany: jest.fn().mockResolvedValue([
            { channelId: 'channel-1' },
            { channelId: 'channel-2' },
          ]),
        },
      } as never,
      {
        verifyAsync: jest.fn().mockResolvedValue({
          sub: 'user-1',
          email: 'user@example.com',
        }),
      } as never,
      {
        findActiveAuthUser: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
          fullName: 'User One',
          avatarUrl: null,
        }),
      } as never,
      presence as never,
      { assertTypingEvent: jest.fn() } as never,
      { trackSocketConnected: jest.fn(), trackSocketDisconnected: jest.fn() } as never,
      { get: jest.fn(() => '1') } as never,
    );
    const client = {
      id: 'socket-1',
      handshake: { auth: { token: 'token' } },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(),
      join: jest.fn().mockResolvedValue(undefined),
    };

    await gateway.handleConnection(client as never);

    expect(client.join).toHaveBeenNthCalledWith(1, 'channel:channel-1');
    expect(client.join).toHaveBeenNthCalledWith(2, 'channel:channel-2');
  });

  it('connects and disconnects the global presence service', async () => {
    const presence = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
    };
    const metrics = {
      trackSocketConnected: jest.fn(),
      trackSocketDisconnected: jest.fn(),
    };
    const gateway = new ChatGateway(
      { channelMember: { findFirst: jest.fn(), findMany: jest.fn().mockResolvedValue([]) } } as never,
      {
        verifyAsync: jest.fn().mockResolvedValue({
          sub: 'user-1',
          email: 'user@example.com',
        }),
      } as never,
      {
        findActiveAuthUser: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'user@example.com',
          fullName: 'User One',
          avatarUrl: null,
        }),
      } as never,
      presence as never,
      { assertTypingEvent: jest.fn() } as never,
      metrics as never,
      { get: jest.fn(() => '1') } as never,
    );
    const client = {
      id: 'socket-1',
      handshake: { auth: { token: 'token' } },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    await gateway.handleConnection(client as never);
    await gateway.handleDisconnect(client as never);

    expect(presence.connect).toHaveBeenCalledWith(
      'socket-1',
      expect.objectContaining({ id: 'user-1' }),
    );
    expect(presence.disconnect).toHaveBeenCalledWith('socket-1');
    expect(metrics.trackSocketConnected).toHaveBeenCalledWith('chat', 'socket-1');
    expect(metrics.trackSocketDisconnected).toHaveBeenCalledWith('chat', 'socket-1');
  });
});
