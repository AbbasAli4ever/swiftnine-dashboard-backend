import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { DocsGateway } from './docs.gateway';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { DocLocksService } from './doc-locks.service';
import { DocPermissionsService } from './doc-permissions.service';
import { DocPresenceService } from './doc-presence.service';
import { DocSearchService } from './doc-search.service';
import { DocRolesGuard } from './guards/doc-roles.guard';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  controllers: [DocsController],
  providers: [
    DocsGateway,
    DocsService,
    DocLocksService,
    DocPermissionsService,
    DocPresenceService,
    DocSearchService,
    DocRolesGuard,
  ],
  exports: [DocPermissionsService, DocRolesGuard, DocLocksService, DocPresenceService],
})
export class DocsModule {}
