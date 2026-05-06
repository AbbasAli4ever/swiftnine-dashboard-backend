import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { ActivityModule } from '../activity/activity.module';
import { DocsModule } from '../docs/docs.module';

@Module({
  imports: [ActivityModule, DocsModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
