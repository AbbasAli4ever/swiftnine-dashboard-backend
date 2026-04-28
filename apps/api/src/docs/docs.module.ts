import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { DocPermissionsService } from './doc-permissions.service';
import { DocSearchService } from './doc-search.service';
import { DocRolesGuard } from './guards/doc-roles.guard';

@Module({
  controllers: [DocsController],
  providers: [
    DocsService,
    DocPermissionsService,
    DocSearchService,
    DocRolesGuard,
  ],
  exports: [DocPermissionsService, DocRolesGuard],
})
export class DocsModule {}
