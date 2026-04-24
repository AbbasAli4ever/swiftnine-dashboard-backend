import { Controller, Get, Req, Res, UseGuards, Param, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { NotificationsSseService } from './sse.service';
import { PrismaService } from '@app/database';
import type { Response } from 'express';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { NotificationResponseDto } from './dto/notification-response.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly sse: NotificationsSseService, private readonly prisma: PrismaService) {}

  @Get('members/:memberId/stream')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Open SSE stream for workspace member notifications' })
  @ApiParam({ name: 'memberId', description: 'Workspace member id or user id' })
  async stream(@Req() req: WorkspaceRequest, @Param('memberId') memberId: string, @Res() res: Response) {
    // resolve member by membership id first, then by user id
    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
      select: { id: true, userId: true },
    });

    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
        select: { id: true, userId: true },
      });
    }

    if (!member) throw new NotFoundException('Member not found');

    // only the same authenticated user may open their member stream
    if (member.userId !== req.user.id) throw new ForbiddenException('Cannot open notification stream for another member');

    // register SSE client
    this.sse.registerClient(member.id, res);

    // send initial notifications (recent first) then keep connection open
    const notifs = await this.prisma.notification.findMany({
      where: { userId: member.userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    this.sse.sendToClient(res, 'notifications:init', notifs);

    // intentionally do not return to keep connection open
  }

  // notifications are delivered via SSE stream; no separate GET endpoint
}
