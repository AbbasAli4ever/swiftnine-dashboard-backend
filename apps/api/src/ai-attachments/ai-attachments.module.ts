import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { AiConversationsModule } from '../ai-conversations/ai-conversations.module';
import { AiAttachmentsController } from './ai-attachments.controller';
import { AiAttachmentsService } from './ai-attachments.service';
import { AttachmentContentExtractionService } from './content-extraction/attachment-content-extraction.service';
import { ATTACHMENT_SCANNER } from './scanning/attachment-scanner';
import { NoopAttachmentScanner } from './scanning/noop-attachment-scanner';

@Module({
  imports: [CommonModule, AiConversationsModule],
  controllers: [AiAttachmentsController],
  providers: [
    AiAttachmentsService,
    AttachmentContentExtractionService,
    { provide: ATTACHMENT_SCANNER, useClass: NoopAttachmentScanner },
  ],
  exports: [AiAttachmentsService],
})
export class AiAttachmentsModule {}
