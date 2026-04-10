import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async checkDbConnection() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected' };
    } catch (error: any) {
      return {
        status: 'error',
        database: 'disconnected',
        message: error.message,
      };
    }
  }
}
