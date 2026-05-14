import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { ProjectAttachmentsController } from './project-attachments.controller';
import { AttachmentsService } from './attachments.service';
import { ActivityModule } from '../activity/activity.module';
import { DocsModule } from '../docs/docs.module';
import { ProjectSecurityModule } from '../project-security/project-security.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [ActivityModule, DocsModule, ProjectSecurityModule, WorkspaceModule],
  controllers: [AttachmentsController, ProjectAttachmentsController],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
