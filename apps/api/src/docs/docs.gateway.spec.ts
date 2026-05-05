jest.mock('../auth/auth.service', () => ({
  AuthService: class AuthService {},
}));

jest.mock('./docs.service', () => ({
  DocSaveConflictException: class DocSaveConflictException extends Error {
    conflictBlockIds: string[] = [];
    reason = 'conflict';
  },
  DocsService: class DocsService {},
}));

import { DocsGateway } from './docs.gateway';

describe('DocsGateway', () => {
  it('rejects connections without a handshake token', async () => {
    const gateway = new DocsGateway(
      {} as never,
      {} as never,
      {} as never,
      { verifyAsync: jest.fn() } as never,
      { findActiveAuthUser: jest.fn() } as never,
      { connect: jest.fn(), disconnect: jest.fn() } as never,
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

    expect(client.emit).toHaveBeenCalledWith('doc:error', {
      reason: 'Authentication token is required',
    });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('connects and disconnects the global presence service', async () => {
    const presence = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
    };
    const gateway = new DocsGateway(
      { findOne: jest.fn() } as never,
      {
        join: jest.fn(),
        getJoinedDocIds: jest.fn().mockReturnValue([]),
        leave: jest.fn(),
        snapshot: jest.fn().mockReturnValue([]),
      } as never,
      { releaseForSocket: jest.fn().mockReturnValue([]) } as never,
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
  });
});
