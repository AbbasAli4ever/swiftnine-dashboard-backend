import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';

export type ChatSystemEventPayload = {
  event: string;
  [key: string]: unknown;
};

@Injectable()
export class ChatSystemService {
  constructor(private readonly prisma: PrismaService) {}

  async emit(
    channelId: string,
    payload: ChatSystemEventPayload,
    db: PrismaService | Prisma.TransactionClient = this.prisma,
  ) {
    return db.channelMessage.create({
      data: {
        channelId,
        senderId: null,
        kind: 'SYSTEM',
        contentJson: payload as Prisma.InputJsonValue,
        plaintext: '',
      },
    });
  }
}
