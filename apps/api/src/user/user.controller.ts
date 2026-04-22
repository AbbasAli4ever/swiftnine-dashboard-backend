import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/auth.service';
import { UserService, type UserProfile } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordResponseDto } from './dto/change-password-response.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationPreferencesResponseDto } from './dto/notification-preferences-response.dto';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('users')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or initialize current user profile' })
  @ApiBody({
    type: CreateProfileDto,
    examples: {
      default: {
        summary: 'Create profile request',
        value: {
          designation: 'Senior Backend Engineer',
          profilePicture: 'initials:SA',
          status: 'ONLINE',
          bio: 'Building secure and scalable APIs.',
          timezone: 'Asia/Karachi',
          showLocalTime: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async createProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateProfileDto,
  ): Promise<UserProfile> {
    return this.userService.createProfile(req.user.id, dto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile returned successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Req() req: AuthenticatedRequest): Promise<UserProfile> {
    return this.userService.getProfile(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by id' })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile returned successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserProfile> {
    return this.userService.getProfile(id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({
    type: UpdateProfileDto,
    examples: {
      default: {
        summary: 'Update profile request',
        value: {
          fullName: 'Shoaib Ahmed',
          designation: 'Lead Backend Engineer',
          profilePicture: 'https://cdn.example.com/avatar/shoaib.png',
          status: 'OFFLINE',
          bio: 'I like to work on distributed systems.',
          timezone: 'Europe/London',
          showLocalTime: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.userService.updateProfile(req.user.id, dto);
  }

  @Patch('status')
  @ApiOperation({ summary: 'Update current user online/offline status' })
  @ApiBody({
    type: SetStatusDto,
    examples: {
      online: {
        summary: 'Set status to online',
        value: {
          status: 'ONLINE',
        },
      },
      offline: {
        summary: 'Set status to offline',
        value: {
          status: 'OFFLINE',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateStatus(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SetStatusDto,
  ): Promise<UserProfile> {
    return this.userService.updateStatus(req.user.id, dto.status);
  }

  @Delete('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete current user profile' })
  @ApiResponse({
    status: 204,
    description: 'Profile deleted successfully (no content)',
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteProfile(@Req() req: AuthenticatedRequest): Promise<void> {
    await this.userService.deleteProfile(req.user.id);
  }

  @Delete(':id')
  @UseGuards(WorkspaceGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({
    name: 'x-workspace-id',
    required: true,
    description: 'Active workspace ID. Caller must be the workspace owner.',
  })
  @ApiOperation({
    summary: 'Soft delete a workspace member account (workspace OWNER only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Target user UUID',
    example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
  })
  @ApiResponse({
    status: 204,
    description: 'User soft deleted successfully (no content)',
  })
  @ApiResponse({ status: 403, description: 'Only the workspace owner can delete users' })
  @ApiResponse({ status: 404, description: 'User not found in this workspace' })
  async adminDeleteUser(
    @Req() req: WorkspaceRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.userService.adminDeleteUser(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      id,
    );
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiBody({
    type: ChangePasswordDto,
    examples: {
      default: {
        summary: 'Change password request',
        value: {
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass456!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: ChangePasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Current password is incorrect' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(req.user.id, dto);
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update current user notification preferences' })
  @ApiBody({
    type: UpdateNotificationPreferencesDto,
    description:
      'Patch notification preferences. Only fields provided will be updated.',
    examples: {
      enableEmail: {
        summary: 'Enable email notifications only',
        value: { email: true },
      },
      disableBrowser: {
        summary: 'Disable browser notifications only',
        value: { browser: false },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Notification preferences updated successfully',
    type: NotificationPreferencesResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async updateNotificationPreferences(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferencesResponseDto> {
    return this.userService.updateNotificationPreferences(req.user.id, dto as any);
  }
}
