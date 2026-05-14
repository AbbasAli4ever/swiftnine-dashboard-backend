"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsModule = void 0;
const common_1 = require("@nestjs/common");
const attachments_controller_1 = require("./attachments.controller");
const project_attachments_controller_1 = require("./project-attachments.controller");
const attachments_service_1 = require("./attachments.service");
const activity_module_1 = require("../activity/activity.module");
const docs_module_1 = require("../docs/docs.module");
const project_security_module_1 = require("../project-security/project-security.module");
const workspace_module_1 = require("../workspace/workspace.module");
let AttachmentsModule = class AttachmentsModule {
};
exports.AttachmentsModule = AttachmentsModule;
exports.AttachmentsModule = AttachmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [activity_module_1.ActivityModule, docs_module_1.DocsModule, project_security_module_1.ProjectSecurityModule, workspace_module_1.WorkspaceModule],
        controllers: [attachments_controller_1.AttachmentsController, project_attachments_controller_1.ProjectAttachmentsController],
        providers: [attachments_service_1.AttachmentsService],
        exports: [attachments_service_1.AttachmentsService],
    })
], AttachmentsModule);
//# sourceMappingURL=attachments.module.js.map