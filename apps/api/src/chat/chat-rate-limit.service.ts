import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

type Bucket = {
  count: number;
  resetAt: number;
};

@Injectable()
export class ChatRateLimitService {
  private readonly buckets = new Map<string, Bucket>();

  assertMessageSend(userId: string, channelId: string): void {
    this.assertHttp(
      `message:${userId}:${channelId}`,
      30,
      60_000,
      'Too many messages in this channel. Please slow down.',
    );
  }

  assertReactionToggle(userId: string, channelId: string): void {
    this.assertHttp(
      `reaction:${userId}:${channelId}`,
      120,
      60_000,
      'Too many reaction changes. Please slow down.',
    );
  }

  assertTypingEvent(userId: string, channelId: string): void {
    this.assertWs(
      `typing:${userId}:${channelId}`,
      120,
      60_000,
      'Too many typing events. Please slow down.',
    );
  }

  private assertHttp(
    key: string,
    limit: number,
    windowMs: number,
    message: string,
  ): void {
    if (!this.consume(key, limit, windowMs)) {
      throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private assertWs(
    key: string,
    limit: number,
    windowMs: number,
    message: string,
  ): void {
    if (!this.consume(key, limit, windowMs)) {
      throw new WsException(message);
    }
  }

  private consume(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    if (bucket.count >= limit) {
      return false;
    }

    bucket.count += 1;
    return true;
  }
}
