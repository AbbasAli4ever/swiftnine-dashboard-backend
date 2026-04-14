import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { INVALID_REFRESH_TOKEN_MESSAGE, REFRESH_TOKEN_TTL_MS } from './auth.constants';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { AuthUser, GoogleAuthProfile } from './auth.service';

type AuthenticatedRequest = Request & { user: AuthUser };
type GoogleAuthenticatedRequest = Request & { user: GoogleAuthProfile };

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register with email & password',
    description:
      'Creates a new account. Returns access token in body and sets refresh token as httpOnly cookie.',
  })
  @ApiResponse({
    status: 201,
    type: AuthResponseDto,
    description: 'Account created, tokens issued',
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { refreshToken, ...result } = await this.authService.register(dto);
    this.setRefreshCookie(res, refreshToken);
    return result;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with email & password',
    description:
      'Validates credentials. Returns access token in body and sets refresh token as httpOnly cookie.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    type: AuthResponseDto,
    description: 'Login successful, tokens issued',
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async login(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { refreshToken, ...result } = await this.authService.login(req.user);
    this.setRefreshCookie(res, refreshToken);
    return result;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Start Google OAuth',
    description: 'Redirects the user to Google for authentication.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google consent screen',
  })
  googleAuth(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Handle Google OAuth callback',
    description:
      'Consumes the Google OAuth callback, issues tokens, and sets the refresh token cookie.',
  })
  @ApiResponse({
    status: 200,
    type: AuthResponseDto,
    description: 'Google authentication successful, tokens issued',
  })
  @ApiResponse({
    status: 401,
    description: 'Google account could not be authenticated',
  })
  @ApiResponse({
    status: 409,
    description:
      'Google account conflicts with an existing or inactive account',
  })
  async googleCallback(
    @Req() req: GoogleAuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { refreshToken, ...result } = await this.authService.handleGoogleAuth(
      req.user,
    );
    this.setRefreshCookie(res, refreshToken);
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Reads the refresh_token httpOnly cookie, validates it, rotates it, and issues a new token pair.',
  })
  @ApiResponse({
    status: 200,
    type: AuthResponseDto,
    description: 'New token pair issued',
  })
  @ApiResponse({ status: 401, description: 'Refresh token missing, invalid, or expired' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const rawToken = (req as unknown as { cookies: Record<string, string> }).cookies['refresh_token'];

    if (!rawToken) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    const { refreshToken, ...result } = await this.authService.refreshTokens(rawToken);
    this.setRefreshCookie(res, refreshToken);
    return result;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset OTP',
    description:
      'Sends a 6-digit OTP to the email if an account exists. Always returns 200 to prevent email enumeration.',
  })
  @ApiResponse({ status: 200, description: 'OTP sent (or silently ignored if email not found)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password using OTP',
    description:
      'Validates the 6-digit OTP and sets a new password. Revokes all active sessions on success.',
  })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'OTP is invalid or has expired' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  // Reused by login and Google OAuth callback in later steps
  protected setRefreshCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_TTL_MS,
      path: '/api/v1/auth',
    });
  }
}
