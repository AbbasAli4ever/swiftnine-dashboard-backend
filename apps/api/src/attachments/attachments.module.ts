import { Module, forwardRef } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { ProjectAttachmentsController } from './project-attachments.controller';
import { TaskListAttachmentsController } from './task-list-attachments.controller';
import { AttachmentsService } from './attachments.service';
import { ActivityModule } from '../activity/activity.module';
import { DocsModule } from '../docs/docs.module';
import { ProjectSecurityModule } from '../project-security/project-security.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  // WorkspaceModule now imports ChannelsModule (-> ChatModule -> this module),
  // closing a cycle back here; forwardRef defers the reference so this file's
  // own decorator doesn't evaluate it while WorkspaceModule is still loading.
  imports: [ActivityModule, DocsModule, ProjectSecurityModule, forwardRef(() => WorkspaceModule)],
  controllers: [
    AttachmentsController,
    ProjectAttachmentsController,
    TaskListAttachmentsController,
  ],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
