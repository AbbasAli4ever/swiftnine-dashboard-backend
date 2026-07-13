"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentGenerationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const ai_attachments_service_1 = require("../ai-attachments/ai-attachments.service");
const pdf_generation_service_1 = require("./pdf-generation.service");
const ppt_generation_service_1 = require("./ppt-generation.service");
const generate_document_dto_1 = require("./dto/generate-document.dto");
const document_generation_utils_1 = require("./document-generation.utils");
let DocumentGenerationController = class DocumentGenerationController {
    pdf;
    ppt;
    attachments;
    constructor(pdf, ppt, attachments) {
        this.pdf = pdf;
        this.ppt = ppt;
        this.attachments = attachments;
    }
    async generatePdf(req, dto) {
        const input = dto;
        const buffer = await this.pdf.render(input);
        const result = await this.attachments.createGeneratedAttachment(req.user.id, req.workspaceContext.workspaceId, {
            conversationId: input.conversationId,
            messageId: input.messageId,
            fileName: input.fileName ?? `${(0, document_generation_utils_1.slugifyFileName)(input.title)}.pdf`,
            mimeType: 'application/pdf',
            buffer,
            attachmentType: 'generated-pdf',
        });
        return (0, common_2.ok)(result, 'PDF generated');
    }
    async generatePpt(req, dto) {
        const input = dto;
        const buffer = await this.ppt.render(input);
        const result = await this.attachments.createGeneratedAttachment(req.user.id, req.workspaceContext.workspaceId, {
            conversationId: input.conversationId,
            messageId: input.messageId,
            fileName: input.fileName ?? `${(0, document_generation_utils_1.slugifyFileName)(input.title)}.pptx`,
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            buffer,
            attachmentType: 'generated-ppt',
        });
        return (0, common_2.ok)(result, 'PowerPoint generated');
    }
};
exports.DocumentGenerationController = DocumentGenerationController;
__decorate([
    (0, common_1.Post)('pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Render structured content into a PDF and attach it to a SwiftBot conversation' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, generate_document_dto_1.GenerateDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentGenerationController.prototype, "generatePdf", null);
__decorate([
    (0, common_1.Post)('ppt'),
    (0, swagger_1.ApiOperation)({
        summary: 'Render structured content into a PowerPoint and attach it to a SwiftBot conversation',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, generate_document_dto_1.GenerateDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentGenerationController.prototype, "generatePpt", null);
exports.DocumentGenerationController = DocumentGenerationController = __decorate([
    (0, swagger_1.ApiTags)('document-generation'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    (0, common_1.Controller)('document-generation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    __metadata("design:paramtypes", [pdf_generation_service_1.PdfGenerationService,
        ppt_generation_service_1.PptGenerationService,
        ai_attachments_service_1.AiAttachmentsService])
], DocumentGenerationController);
//# sourceMappingURL=document-generation.controller.js.map