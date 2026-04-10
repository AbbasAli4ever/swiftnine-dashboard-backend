import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
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
import { REFRESH_TOKEN_TTL_MS } from './auth.constants';
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
