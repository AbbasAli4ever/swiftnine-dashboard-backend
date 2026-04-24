import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type { Response } from 'express';

type ClientEntry = { res: Response; heartbeat: NodeJS.Timeout };

@Injectable()
export class NotificationsSseService implements OnModuleDestroy {
  private readonly logger = new Logger(NotificationsSseService.name);
  private readonly clients = new Map<string, Set<ClientEntry>>();

  registerClient(memberId: string, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // disable nginx buffering
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const heartbeat = setInterval(() => {
      try {
        res.write(':heartbeat\n\n');
      } catch (err) {
        this.logger.debug('Error writing heartbeat, removing client');
        this.unregisterClient(memberId, res);
      }
    }, 15000);

    const entry: ClientEntry = { res, heartbeat };

    const set = this.clients.get(memberId) ?? new Set<ClientEntry>();
    set.add(entry);
    this.clients.set(memberId, set);

    res.on('close', () => {
      this.unregisterClient(memberId, res);
    });
  }

  unregisterClient(memberId: string, res: Response) {
    const set = this.clients.get(memberId);
    if (!set) return;
    for (const e of Array.from(set)) {
      if (e.res === res) {
        clearInterval(e.heartbeat);
        try {
          e.res.end();
        } catch {}
        set.delete(e);
      }
    }
    if (set.size === 0) this.clients.delete(memberId);
  }

  broadcastToMember(memberId: string, event: string, payload: unknown) {
    const set = this.clients.get(memberId);
    if (!set || set.size === 0) return;
    const data = JSON.stringify(payload);
    for (const entry of Array.from(set)) {
      try {
        entry.res.write(`event: ${event}\n`);
        entry.res.write(`data: ${data}\n\n`);
      } catch (err) {
        this.logger.debug('Error broadcasting to client, removing');
        this.unregisterClient(memberId, entry.res);
      }
    }
  }

  sendToClient(res: Response, event: string, payload: unknown) {
    try {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch (err) {
      this.logger.debug('Error sending to single client');
    }
  }

  onModuleDestroy() {
    for (const [memberId, set] of this.clients.entries()) {
      for (const e of set) {
        clearInterval(e.heartbeat);
        try {
          e.res.end();
        } catch {}
      }
      set.clear();
    }
    this.clients.clear();
  }
}
