import { OnModuleDestroy } from '@nestjs/common';
import type { Response } from 'express';
export declare class SseService implements OnModuleDestroy {
    private readonly logger;
    private readonly clients;
    registerClient(taskId: string, res: Response): void;
    unregisterClient(taskId: string, res: Response): void;
    broadcast(taskId: string, event: string, payload: unknown): void;
    sendToClient(res: Response, event: string, payload: unknown): void;
    onModuleDestroy(): void;
}
