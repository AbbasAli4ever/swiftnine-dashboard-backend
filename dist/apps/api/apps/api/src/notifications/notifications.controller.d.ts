import { NotificationsSseService } from './sse.service';
import { PrismaService } from "../../../../libs/database/src";
import type { Response } from 'express';
import type { WorkspaceRequest } from '../workspace/workspace.types';
export declare class NotificationsController {
    private readonly sse;
    private readonly prisma;
    constructor(sse: NotificationsSseService, prisma: PrismaService);
    stream(req: WorkspaceRequest, memberId: string, res: Response): Promise<void>;
}
