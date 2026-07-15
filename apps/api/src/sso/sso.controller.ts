import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/auth.service';
import { SsoService } from './sso.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('sso')
@ApiBearerAuth()
@Controller('sso')
export class SsoController {
  constructor(private readonly ssoService: SsoService) {}

  @Post('odoo/redirect')
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Throttle({ 'sso-mint': { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mint a short-lived Odoo SSO login token for the authenticated dashboard user',
  })
  @ApiResponse({ status: 200, description: 'Odoo SSO login token generated' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  mintOdooRedirect(
    @Req() req: AuthenticatedRequest,
  ): { token: string; redirectUrl: string } {
    return this.ssoService.mintOdooLoginToken(req.user);
  }
}
