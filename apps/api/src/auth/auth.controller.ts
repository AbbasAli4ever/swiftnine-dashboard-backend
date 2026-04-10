import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

// Must stay in sync with JWT_REFRESH_EXPIRES_IN env var
const REFRESH_COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d

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

  // Reused by login and Google OAuth callback in later steps
  protected setRefreshCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_COOKIE_TTL_MS,
      path: '/api/v1/auth',
    });
  }
}
