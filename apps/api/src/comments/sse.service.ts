import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type { Response } from 'express';

type ClientEntry = { res: Response; heartbeat: NodeJS.Timeout };

@Injectable()
export class SseService implements OnModuleDestroy {
  private readonly logger = new Logger(SseService.name);
  private readonly clients = new Map<string, Set<ClientEntry>>();

  registerClient(taskId: string, res: Response) {
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
        this.unregisterClient(taskId, res);
      }
    }, 15000);

    const entry: ClientEntry = { res, heartbeat };

    const set = this.clients.get(taskId) ?? new Set<ClientEntry>();
    set.add(entry);
    this.clients.set(taskId, set);

    res.on('close', () => {
      this.unregisterClient(taskId, res);
    });
  }

  unregisterClient(taskId: string, res: Response) {
    const set = this.clients.get(taskId);
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
    if (set.size === 0) this.clients.delete(taskId);
  }

  broadcast(taskId: string, event: string, payload: unknown) {
    const set = this.clients.get(taskId);
    if (!set || set.size === 0) return;
    const data = JSON.stringify(payload);
    for (const entry of Array.from(set)) {
      try {
        entry.res.write(`event: ${event}\n`);
        entry.res.write(`data: ${data}\n\n`);
      } catch (err) {
        this.logger.debug('Error broadcasting to client, removing');
        this.unregisterClient(taskId, entry.res);
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
    for (const [taskId, set] of this.clients.entries()) {
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
