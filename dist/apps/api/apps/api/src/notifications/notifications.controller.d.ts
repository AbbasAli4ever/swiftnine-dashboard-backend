import { NotificationsSseService } from './sse.service';
import { PrismaService } from '@app/database';
import type { Response } from 'express';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { PatchNotificationClearDto } from './dto/patch-notification-clear.dto';
import { PatchNotificationSnoozeDto } from './dto/patch-notification-snooze.dto';
import { PatchNotificationReadDto } from './dto/patch-notification-read.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly sse;
    private readonly prisma;
    private readonly notifications;
    constructor(sse: NotificationsSseService, prisma: PrismaService, notifications: NotificationsService);
    private findOwnedNotification;
    private getCurrentWorkspaceMember;
    private broadcastUpdatedNotification;
    stream(req: WorkspaceRequest, memberId: string, res: Response): Promise<void>;
    updateNotificationClear(req: WorkspaceRequest, id: string, dto: PatchNotificationClearDto): Promise<NotificationResponseDto>;
    updateNotificationSnooze(req: WorkspaceRequest, id: string, dto: PatchNotificationSnoozeDto): Promise<NotificationResponseDto>;
    updateNotificationRead(req: WorkspaceRequest, id: string, dto: PatchNotificationReadDto): Promise<NotificationResponseDto>;
    getCleared(req: WorkspaceRequest): Promise<NotificationResponseDto[]>;
    getSnoozed(req: WorkspaceRequest): Promise<NotificationResponseDto[]>;
}
