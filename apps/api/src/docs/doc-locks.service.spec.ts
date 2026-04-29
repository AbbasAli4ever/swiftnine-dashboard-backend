import { BLOCK_LOCK_TTL_MS } from './doc-permissions.constants';
import { DocLocksService } from './doc-locks.service';

describe('DocLocksService', () => {
  let service: DocLocksService;

  beforeEach(() => {
    service = new DocLocksService();
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  it('acquires a lock', () => {
    const result = service.acquire('doc-1', 'block-1', 'user-1', 'socket-1', 1_000);

    expect(result).toEqual({
      acquired: true,
      lock: {
        docId: 'doc-1',
        blockId: 'block-1',
        userId: 'user-1',
        socketId: 'socket-1',
        expiresAt: 1_000 + BLOCK_LOCK_TTL_MS,
      },
    });
  });

  it('rejects a lock held by a different user', () => {
    service.acquire('doc-1', 'block-1', 'user-1', 'socket-1', 1_000);

    const result = service.acquire('doc-1', 'block-1', 'user-2', 'socket-2', 2_000);

    expect(result.acquired).toBe(false);
    expect(result.lock.userId).toBe('user-1');
  });

  it('extends a lock on heartbeat', () => {
    service.acquire('doc-1', 'block-1', 'user-1', 'socket-1', 1_000);

    const lock = service.heartbeat('doc-1', 'block-1', 'user-1', 'socket-1', 5_000);

    expect(lock?.expiresAt).toBe(5_000 + BLOCK_LOCK_TTL_MS);
  });

  it('releases locks when the owner socket disconnects', () => {
    service.acquire('doc-1', 'block-1', 'user-1', 'socket-1', 1_000);

    const released = service.releaseForSocket('socket-1');

    expect(released).toHaveLength(1);
    expect(service.getSnapshot('doc-1')).toEqual([]);
  });
});
