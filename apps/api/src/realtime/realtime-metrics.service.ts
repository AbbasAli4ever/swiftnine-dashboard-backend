import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RealtimeMetricsService {
  private readonly logger = new Logger(RealtimeMetricsService.name);
  private readonly socketsByNamespace = new Map<string, Set<string>>();
  private messagesSent = 0;

  trackSocketConnected(namespace: string, socketId: string): void {
    const sockets = this.socketsByNamespace.get(namespace) ?? new Set<string>();
    sockets.add(socketId);
    this.socketsByNamespace.set(namespace, sockets);
    this.logger.debug(
      `socket_connected namespace=${namespace} active=${sockets.size}`,
    );
  }

  trackSocketDisconnected(namespace: string, socketId: string): void {
    const sockets = this.socketsByNamespace.get(namespace);
    if (!sockets) {
      return;
    }

    sockets.delete(socketId);
    if (sockets.size === 0) {
      this.socketsByNamespace.delete(namespace);
    }

    this.logger.debug(
      `socket_disconnected namespace=${namespace} active=${sockets.size}`,
    );
  }

  recordMessageSent(channelId: string, userId: string): void {
    this.messagesSent += 1;
    this.logger.debug(
      `message_sent total=${this.messagesSent} channel=${channelId} user=${userId}`,
    );
  }

  snapshot() {
    return {
      messagesSent: this.messagesSent,
      activeSockets: Object.fromEntries(
        Array.from(this.socketsByNamespace.entries()).map(
          ([namespace, sockets]) => [namespace, sockets.size],
        ),
      ),
    };
  }
}
