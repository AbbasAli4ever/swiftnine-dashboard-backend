import { Module } from '@nestjs/common';
import { AiAttachmentsModule } from '../ai-attachments/ai-attachments.module';
import { AiGenerationModule } from '../ai-generation/ai-generation.module';
import { DocumentGenerationController } from './document-generation.controller';
import { PdfGenerationService } from './pdf-generation.service';
import { PptGenerationService } from './ppt-generation.service';
import { PresentationOrchestratorService } from './presentation-orchestrator.service';

@Module({
  imports: [AiAttachmentsModule, AiGenerationModule],
  controllers: [DocumentGenerationController],
  providers: [PdfGenerationService, PptGenerationService, PresentationOrchestratorService],
})
export class DocumentGenerationModule {}
