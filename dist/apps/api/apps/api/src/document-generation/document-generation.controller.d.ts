import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AiAttachmentsService } from '../ai-attachments/ai-attachments.service';
import { PdfGenerationService } from './pdf-generation.service';
import { PptGenerationService } from './ppt-generation.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';
export declare class DocumentGenerationController {
    private readonly pdf;
    private readonly ppt;
    private readonly attachments;
    constructor(pdf: PdfGenerationService, ppt: PptGenerationService, attachments: AiAttachmentsService);
    generatePdf(req: WorkspaceRequest, dto: GenerateDocumentDto): Promise<ApiRes<unknown>>;
    generatePpt(req: WorkspaceRequest, dto: GenerateDocumentDto): Promise<ApiRes<unknown>>;
}
