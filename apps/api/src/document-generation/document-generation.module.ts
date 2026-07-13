import { Module } from '@nestjs/common';
import { AiAttachmentsModule } from '../ai-attachments/ai-attachments.module';
import { DocumentGenerationController } from './document-generation.controller';
import { PdfGenerationService } from './pdf-generation.service';
import { PptGenerationService } from './ppt-generation.service';

@Module({
  imports: [AiAttachmentsModule],
  controllers: [DocumentGenerationController],
  providers: [PdfGenerationService, PptGenerationService],
})
export class DocumentGenerationModule {}
