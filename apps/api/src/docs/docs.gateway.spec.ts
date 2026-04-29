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
});
