import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Param,
  ForbiddenException,
  NotFoundException,
  Patch,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { NotificationsSseService } from './sse.service';
import { PrismaService } from '@app/database';
import type { Response } from 'express';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { PatchNotificationClearDto } from './dto/patch-notification-clear.dto';
import { PatchNotificationSnoozeDto } from './dto/patch-notification-snooze.dto';
import { PatchNotificationReadDto } from './dto/patch-notification-read.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly sse: NotificationsSseService,
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private async findOwnedNotification(req: WorkspaceRequest, id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    if (notif.userId !== req.user.id)
      throw new ForbiddenException("Cannot modify another user's notification");
    return notif;
  }

  private async getCurrentWorkspaceMember(req: WorkspaceRequest) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: req.user.id,
        workspaceId: req.workspaceContext.workspaceId,
        deletedAt: null,
      },
      select: { id: true, userId: true },
    });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  private async broadcastUpdatedNotification(
    req: WorkspaceRequest,
    notification: any,
  ) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: req.user.id,
        workspaceId: req.workspaceContext.workspaceId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!member) return;

    try {
      this.sse.broadcastToMember(
        member.id,
        'notification:updated',
        await this.notifications.toNotificationPayload(notification),
      );
    } catch (err) {}
  }

  @Get('members/:memberId/stream')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({
    summary: 'Open SSE stream for workspace member notifications',
  })
  @ApiParam({ name: 'memberId', description: 'Workspace member id or user id' })
  async stream(
    @Req() req: WorkspaceRequest,
    @Param('memberId') memberId: string,
    @Res() res: Response,
  ) {
    // resolve member by membership id first, then by user id
    let member = await this.prisma.workspaceMember.findFirst({
      where: {
        id: memberId,
        workspaceId: req.workspaceContext.workspaceId,
        deletedAt: null,
      },
      select: { id: true, userId: true },
    });

    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: {
          userId: memberId,
          workspaceId: req.workspaceContext.workspaceId,
          deletedAt: null,
        },
        select: { id: true, userId: true },
      });
    }

    if (!member) throw new NotFoundException('Member not found');

    // only the same authenticated user may open their member stream
    if (member.userId !== req.user.id)
      throw new ForbiddenException(
        'Cannot open notification stream for another member',
      );

    // register SSE client
    this.sse.registerClient(member.id, res);

    // unsnooze expired notifications for this user in this workspace context
    await this.prisma.notification.updateMany({
      where: {
        userId: member.userId,
        isSnoozed: true,
        snoozedAt: { lte: new Date() },
      },
      data: { isSnoozed: false, snoozedAt: null },
    });

    // send initial notifications (recent first) then keep connection open
    const notifs = await this.prisma.notification.findMany({
      where: {
        userId: member.userId,
        isSnoozed: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    this.sse.sendToClient(
      res,
      'notifications:init',
      await this.notifications.addTaskIds(notifs),
    );

    // intentionally do not return to keep connection open
  }
  // notifications are delivered via SSE stream; also provide endpoints to toggle and list filters

  @Patch(':id/clear')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiOperation({ summary: 'Set notification clear state' })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async updateNotificationClear(
    @Req() req: WorkspaceRequest,
    @Param('id') id: string,
    @Body() dto: PatchNotificationClearDto,
  ): Promise<NotificationResponseDto> {
    await this.findOwnedNotification(req, id);

    if (typeof dto.isCleared !== 'boolean') {
      throw new BadRequestException('isCleared must be boolean');
    }

    const updateData: any = { isCleared: dto.isCleared };
    if (dto.isCleared) {
      updateData.isSnoozed = false;
      updateData.snoozedAt = null;
      updateData.isRead = false;
      updateData.readAt = null;
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: updateData,
    });
    await this.broadcastUpdatedNotification(req, updated);
    return (await this.notifications.addTaskId(updated)) as any;
  }

  @Patch(':id/snooze')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiOperation({
    summary: 'Set notification snooze state and optional snooze expiry',
  })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async updateNotificationSnooze(
    @Req() req: WorkspaceRequest,
    @Param('id') id: string,
    @Body() dto: PatchNotificationSnoozeDto,
  ): Promise<NotificationResponseDto> {
    await this.findOwnedNotification(req, id);

    if (typeof dto.isSnoozed !== 'boolean') {
      throw new BadRequestException('isSnoozed must be boolean');
    }

    if (!dto.isSnoozed && dto.snoozeUntil !== undefined) {
      throw new BadRequestException(
        'snoozeUntil can only be provided when isSnoozed=true',
      );
    }

    const updateData: any = {};
    if (!dto.isSnoozed) {
      updateData.isSnoozed = false;
      updateData.snoozedAt = null;
    } else {
      let until: Date | null = null;
      if (dto.snoozeUntil) {
        const d = new Date(dto.snoozeUntil);
        if (isNaN(d.getTime()))
          throw new BadRequestException('Invalid snoozeUntil datetime');
        if (d.getTime() <= Date.now()) {
          throw new BadRequestException(
            'snoozeUntil must be a future datetime',
          );
        }
        until = d;
      }

      updateData.isSnoozed = true;
      updateData.snoozedAt = until;
      updateData.isCleared = false;
      updateData.isRead = false;
      updateData.readAt = null;
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: updateData,
    });
    await this.broadcastUpdatedNotification(req, updated);
    return (await this.notifications.addTaskId(updated)) as any;
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiOperation({ summary: 'Set notification read state' })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async updateNotificationRead(
    @Req() req: WorkspaceRequest,
    @Param('id') id: string,
    @Body() dto: PatchNotificationReadDto,
  ): Promise<NotificationResponseDto> {
    await this.findOwnedNotification(req, id);

    if (typeof dto.isRead !== 'boolean') {
      throw new BadRequestException('isRead must be boolean');
    }

    const updateData: any = {
      isRead: dto.isRead,
      readAt: dto.isRead ? new Date() : null,
    };
    if (dto.isRead) {
      updateData.isCleared = false;
      updateData.isSnoozed = false;
      updateData.snoozedAt = null;
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: updateData,
    });
    await this.broadcastUpdatedNotification(req, updated);
    return (await this.notifications.addTaskId(updated)) as any;
  }

  @Get('cleared')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiOperation({ summary: 'Get cleared notifications for current member' })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getCleared(
    @Req() req: WorkspaceRequest,
  ): Promise<NotificationResponseDto[]> {
    const member = await this.getCurrentWorkspaceMember(req);

    const notifs = await this.prisma.notification.findMany({
      where: { userId: member.userId, isCleared: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    return (await this.notifications.addTaskIds(notifs)) as any;
  }

  @Get('snoozed')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiOperation({
    summary: 'Get currently snoozed notifications for current member',
  })
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  async getSnoozed(
    @Req() req: WorkspaceRequest,
  ): Promise<NotificationResponseDto[]> {
    const member = await this.getCurrentWorkspaceMember(req);

    await this.prisma.notification.updateMany({
      where: {
        userId: member.userId,
        isSnoozed: true,
        snoozedAt: { lte: new Date() },
      },
      data: { isSnoozed: false, snoozedAt: null },
    });

    const notifs = await this.prisma.notification.findMany({
      where: { userId: member.userId, isSnoozed: true },
      orderBy: { snoozedAt: 'asc' },
      take: 500,
    });
    return (await this.notifications.addTaskIds(notifs)) as any;
  }
}
