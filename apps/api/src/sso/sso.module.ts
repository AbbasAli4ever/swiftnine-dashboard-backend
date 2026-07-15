import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../auth/auth.module';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';

@Module({
  imports: [
    AuthModule,
    ThrottlerModule.forRoot([
      {
        name: 'sso-mint',
        ttl: 60_000,
        limit: 10,
      },
    ]),
  ],
  controllers: [SsoController],
  providers: [SsoService],
})
export class SsoModule {}
