"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAttachmentsModule = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../libs/common/src");
const ai_conversations_module_1 = require("../ai-conversations/ai-conversations.module");
const ai_attachments_controller_1 = require("./ai-attachments.controller");
const ai_attachments_service_1 = require("./ai-attachments.service");
const attachment_scanner_1 = require("./scanning/attachment-scanner");
const noop_attachment_scanner_1 = require("./scanning/noop-attachment-scanner");
let AiAttachmentsModule = class AiAttachmentsModule {
};
exports.AiAttachmentsModule = AiAttachmentsModule;
exports.AiAttachmentsModule = AiAttachmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [common_2.CommonModule, ai_conversations_module_1.AiConversationsModule],
        controllers: [ai_attachments_controller_1.AiAttachmentsController],
        providers: [
            ai_attachments_service_1.AiAttachmentsService,
            { provide: attachment_scanner_1.ATTACHMENT_SCANNER, useClass: noop_attachment_scanner_1.NoopAttachmentScanner },
        ],
        exports: [ai_attachments_service_1.AiAttachmentsService],
    })
], AiAttachmentsModule);
//# sourceMappingURL=ai-attachments.module.js.map