import { HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatRateLimitService } from './chat-rate-limit.service';

describe('ChatRateLimitService', () => {
  let service: ChatRateLimitService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.parse('2026-05-05T00:00:00.000Z'));
    service = new ChatRateLimitService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('limits message sends per user and channel', () => {
    for (let index = 0; index < 30; index += 1) {
      expect(() =>
        service.assertMessageSend('user-1', 'channel-1'),
      ).not.toThrow();
    }

    expect(() => service.assertMessageSend('user-1', 'channel-1')).toThrow(
      HttpException,
    );

    jest.advanceTimersByTime(60_000);

    expect(() =>
      service.assertMessageSend('user-1', 'channel-1'),
    ).not.toThrow();
  });

  it('limits typing events separately for websocket traffic', () => {
    for (let index = 0; index < 120; index += 1) {
      expect(() =>
        service.assertTypingEvent('user-1', 'channel-1'),
      ).not.toThrow();
    }

    expect(() => service.assertTypingEvent('user-1', 'channel-1')).toThrow(
      WsException,
    );
  });
});
