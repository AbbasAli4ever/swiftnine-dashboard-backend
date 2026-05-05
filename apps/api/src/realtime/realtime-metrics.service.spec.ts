import { RealtimeMetricsService } from './realtime-metrics.service';

describe('RealtimeMetricsService', () => {
  it('tracks active sockets per namespace and message sends', () => {
    const service = new RealtimeMetricsService();

    service.trackSocketConnected('chat', 'socket-1');
    service.trackSocketConnected('chat', 'socket-2');
    service.trackSocketConnected('presence', 'socket-3');
    service.recordMessageSent('channel-1', 'user-1');
    service.trackSocketDisconnected('chat', 'socket-1');

    expect(service.snapshot()).toEqual({
      messagesSent: 1,
      activeSockets: {
        chat: 1,
        presence: 1,
      },
    });
  });
});
