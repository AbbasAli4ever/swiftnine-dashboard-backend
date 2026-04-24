import { OnModuleDestroy } from '@nestjs/common';
import type { Response } from 'express';
export declare class NotificationsSseService implements OnModuleDestroy {
    private readonly logger;
    private readonly clients;
    registerClient(memberId: string, res: Response): void;
    unregisterClient(memberId: string, res: Response): void;
    broadcastToMember(memberId: string, event: string, payload: unknown): void;
    sendToClient(res: Response, event: string, payload: unknown): void;
    onModuleDestroy(): void;
}
