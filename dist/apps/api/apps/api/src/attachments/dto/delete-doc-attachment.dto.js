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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocAttachmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DeleteDocAttachmentDto {
    docId;
    s3Key;
}
exports.DeleteDocAttachmentDto = DeleteDocAttachmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DeleteDocAttachmentDto.prototype, "docId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'attachments/doc-uuid/abc123-screenshot.png' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteDocAttachmentDto.prototype, "s3Key", void 0);
//# sourceMappingURL=delete-doc-attachment.dto.js.map