jest.mock('../auth/auth.service', () => ({
  AuthService: class AuthService {},
}));

import type { Server } from 'socket.io';
import { PresenceGateway } from './presence.gateway';

describe('PresenceGateway', () => {
  it('rejects connections without a handshake token', async () => {
    const gateway = new PresenceGateway(
      {
        bindServer: jest.fn(),
        listWorkspaceIdsForUser: jest.fn(),
      } as never,
      { verifyAsync: jest.fn() } as never,
      { findActiveAuthUser: jest.fn() } as never,
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

    expect(client.emit).toHaveBeenCalledWith('presence:error', {
      reason: 'Authentication token is required',
    });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('binds the namespace server into the presence service', () => {
    const presence = {
      bindServer: jest.fn(),
      listWorkspaceIdsForUser: jest.fn(),
    };
    const gateway = new PresenceGateway(
      presence as never,
      {} as never,
      {} as never,
      { trackSocketConnected: jest.fn(), trackSocketDisconnected: jest.fn() } as never,
      { get: jest.fn(() => '1') } as never,
    );
    const server = {} as Server;

    gateway.afterInit(server);

    expect(presence.bindServer).toHaveBeenCalledWith(server);
  });

  it('subscribes a user to all of their workspace rooms', async () => {
    const presence = {
      bindServer: jest.fn(),
      listWorkspaceIdsForUser: jest
        .fn()
        .mockResolvedValue(['workspace-1', 'workspace-2']),
    };
    const gateway = new PresenceGateway(
      presence as never,
      {} as never,
      {} as never,
      { trackSocketConnected: jest.fn(), trackSocketDisconnected: jest.fn() } as never,
      { get: jest.fn(() => '1') } as never,
    );
    const client = {
      data: { user: { id: 'user-1' } },
      join: jest.fn().mockResolvedValue(undefined),
    };

    await gateway.handleSubscribe(client as never);

    expect(presence.listWorkspaceIdsForUser).toHaveBeenCalledWith('user-1');
    expect(client.join).toHaveBeenNthCalledWith(1, 'workspace:workspace-1');
    expect(client.join).toHaveBeenNthCalledWith(2, 'workspace:workspace-2');
  });

  it('tracks presence socket lifecycle metrics', async () => {
    const metrics = {
      trackSocketConnected: jest.fn(),
      trackSocketDisconnected: jest.fn(),
    };
    const gateway = new PresenceGateway(
      {
        bindServer: jest.fn(),
        listWorkspaceIdsForUser: jest.fn(),
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
    gateway.handleDisconnect(client as never);

    expect(metrics.trackSocketConnected).toHaveBeenCalledWith(
      'presence',
      'socket-1',
    );
    expect(metrics.trackSocketDisconnected).toHaveBeenCalledWith(
      'presence',
      'socket-1',
    );
  });
});
