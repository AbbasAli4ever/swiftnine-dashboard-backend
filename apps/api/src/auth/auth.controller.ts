import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { INVALID_REFRESH_TOKEN_MESSAGE } from './auth.constants';
import {
  buildClearRefreshCookieOptions,
  buildRefreshCookieOptions,
} from './auth.cookies';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { AuthUser, GoogleAuthProfile } from './auth.service';

type AuthenticatedRequest = Request & { user: AuthUser };
type GoogleAuthenticatedRequest = Request & { user: GoogleAuthProfile };

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register with email & password',
    description:
      'Creates a new account and sends a 6-digit OTP to the email. Account is not active until the OTP is verified.',
  })
  @ApiResponse({ status: 201, description: 'OTP sent to email' })
  @ApiResponse({ status: 409, description: 'Email already in use and verified' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email with OTP',
    description:
      'Validates the 6-digit OTP sent during registration. On success, marks the account as verified and issues tokens.',
  })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'Email verified, tokens issued' })
  @ApiResponse({ status: 401, description: 'OTP is invalid or has expired' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { refreshToken, ...result } = await this.authService.verifyEmail(dto.email, dto.otp);
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
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'Login successful, tokens issued' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 403, description: 'Email not verified' })
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
  @ApiOperation({ summary: 'Start Google OAuth' })
  @ApiResponse({ status: 302, description: 'Redirect to Google consent screen' })
  googleAuth(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'Google authentication successful' })
  @ApiResponse({ status: 401, description: 'Google account could not be authenticated' })
  @ApiResponse({ status: 409, description: 'Google account conflicts with an existing account' })
  async googleCallback(
    @Req() req: GoogleAuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    const { refreshToken, accessToken } = await this.authService.handleGoogleAuth(req.user);
    this.setRefreshCookie(res, refreshToken);
    const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Reads the refresh_token httpOnly cookie, validates it, rotates it, and issues a new token pair.',
  })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'New token pair issued' })
  @ApiResponse({ status: 401, description: 'Refresh token missing, invalid, or expired' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const cookieBag = (req as unknown as { cookies?: Record<string, string> }).cookies;
    const rawToken = cookieBag?.['refresh_token'];

    if (!rawToken) {
      this.logger.warn(
        `Refresh token missing on request: ${JSON.stringify({
          path: req.originalUrl ?? req.url,
          method: req.method,
          origin: req.headers.origin ?? null,
          cookieHeaderPresent: Boolean(req.headers.cookie),
          parsedCookieKeys: Object.keys(cookieBag ?? {}),
        })}`,
      );
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_MESSAGE);
    }

    const { refreshToken, ...result } = await this.authService.refreshTokens(rawToken);
    this.setRefreshCookie(res, refreshToken);
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current session' })
  @ApiResponse({ status: 200, description: 'Session logged out successfully' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const rawToken = (
      req as unknown as { cookies?: Record<string, string> }
    ).cookies?.['refresh_token'];

    if (rawToken) {
      await this.authService.logout(rawToken);
    }

    this.clearRefreshCookie(res);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset link',
    description:
      'Sends a password reset link to the email if an account exists. Always returns 200 to prevent email enumeration.',
  })
  @ApiResponse({ status: 200, description: 'Reset link sent (or silently ignored if email not found)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password using link token',
    description:
      'Validates the token from the reset link and sets a new password. Revokes all active sessions on success.',
  })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Token is invalid or has expired' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto.token, dto.newPassword);
  }

  protected setRefreshCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, buildRefreshCookieOptions());
  }

  protected clearRefreshCookie(res: Response): void {
    res.clearCookie('refresh_token', buildClearRefreshCookieOptions());
  }
}
