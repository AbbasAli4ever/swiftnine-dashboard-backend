import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticateOptionsGoogle } from 'passport-google-oauth20';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  override getAuthenticateOptions(): AuthenticateOptionsGoogle {
    return {
      scope: ['email', 'profile'],
      prompt: 'select_account',
      accessType: 'online',
    };
  }
}
