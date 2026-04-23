import { Body, Controller, Delete, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceService } from './workspace.service';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { ChangeMemberRoleDto } from './dto/change-member-role.dto';
import { ok } from '@app/common';
import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.service';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Delete('members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: false, description: 'Active workspace ID. If omitted, body.workspaceId is used.' })
  @ApiOperation({ summary: 'Remove a member from a workspace (OWNER only)' })
  @ApiBody({
    type: RemoveMemberDto,
    description: 'Workspace id and workspace-member id to remove',
    examples: {
      default: {
        summary: 'Remove member payload',
        value: {
          workspaceId: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
          memberId: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Not a member or insufficient role' })
  @ApiResponse({ status: 404, description: 'Member or workspace not found' })
  async removeMember(@Req() req: AuthenticatedRequest, @Body() dto: RemoveMemberDto) {
    await this.workspaceService.removeMember(dto.workspaceId, dto.memberId, req.user.id);
    return ok(null, 'Member removed successfully');
  }

  @Put('members/:id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: false, description: 'Active workspace ID. If omitted, body.workspaceId is used.' })
  @ApiParam({
    name: 'id',
    description: 'Workspace member id (membership record id)',
    example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
  })
  @ApiOperation({ summary: "Change a member's role in the workspace (OWNER only)" })
  @ApiBody({
    type: ChangeMemberRoleDto,
    description: 'Workspace id and new role for the specified membership',
    examples: {
      makeOwner: {
        summary: 'Promote to OWNER',
        value: { workspaceId: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29', role: 'OWNER' },
      },
      demote: {
        summary: 'Demote to MEMBER',
        value: { workspaceId: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29', role: 'MEMBER' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Member role updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Not a member or insufficient role' })
  @ApiResponse({ status: 404, description: 'Member or workspace not found' })
  async changeMemberRole(
    @Req() req: AuthenticatedRequest,
    @Param('id') memberId: string,
    @Body() dto: ChangeMemberRoleDto,
  ) {
    await this.workspaceService.changeMemberRole(dto.workspaceId, memberId, dto.role as any, req.user.id);
    return ok(null, 'Member role updated successfully');
  }
}
