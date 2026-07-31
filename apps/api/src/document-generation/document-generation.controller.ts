import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AiAttachmentsService } from '../ai-attachments/ai-attachments.service';
import { PdfGenerationService } from './pdf-generation.service';
import { PptGenerationService } from './ppt-generation.service';
import { PresentationOrchestratorService } from './presentation-orchestrator.service';
import { GenerateDocumentDto, type GenerateDocumentInput } from './dto/generate-document.dto';
import {
  GeneratePresentationDto,
  type GeneratePresentationInput,
} from './dto/generate-presentation.dto';
import { slugifyFileName } from './document-generation.utils';

@ApiTags('document-generation')
@ApiBearerAuth()
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
@Controller('document-generation')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class DocumentGenerationController {
  constructor(
    private readonly pdf: PdfGenerationService,
    private readonly ppt: PptGenerationService,
    private readonly presentationOrchestrator: PresentationOrchestratorService,
    private readonly attachments: AiAttachmentsService,
  ) {}

  @Post('pdf')
  @ApiOperation({ summary: 'Render structured content into a PDF and attach it to a SwiftBot conversation' })
  async generatePdf(@Req() req: WorkspaceRequest, @Body() dto: GenerateDocumentDto): Promise<ApiRes<unknown>> {
    const input = dto as GenerateDocumentInput;
    const buffer = await this.pdf.render(input);
    const result = await this.attachments.createGeneratedAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      {
        conversationId: input.conversationId,
        messageId: input.messageId,
        fileName: input.fileName ?? `${slugifyFileName(input.title)}.pdf`,
        mimeType: 'application/pdf',
        buffer,
        attachmentType: 'generated-pdf',
      },
    );
    return ok(result, 'PDF generated');
  }

  @Post('ppt')
  @ApiOperation({
    summary: 'Render a themed slide deck (with generated images/charts) and attach it to a SwiftBot conversation',
  })
  async generatePpt(
    @Req() req: WorkspaceRequest,
    @Body() dto: GeneratePresentationDto,
  ): Promise<ApiRes<unknown>> {
    const input = dto as GeneratePresentationInput;
    const resolved = await this.presentationOrchestrator.resolveImages(
      req.workspaceContext.workspaceId,
      req.user.id,
      input,
    );
    const buffer = await this.ppt.render(resolved);
    const result = await this.attachments.createGeneratedAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      {
        conversationId: input.conversationId,
        messageId: input.messageId,
        fileName: input.fileName ?? `${slugifyFileName(input.title)}.pptx`,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        buffer,
        attachmentType: 'generated-ppt',
      },
    );
    return ok(result, 'PowerPoint generated');
  }
}
