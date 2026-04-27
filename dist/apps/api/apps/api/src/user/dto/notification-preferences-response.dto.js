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
exports.NotificationPreferencesResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class NotificationPreferencesResponseDto {
    inbox;
    email;
    browser;
    mobile;
}
exports.NotificationPreferencesResponseDto = NotificationPreferencesResponseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, nullable: true }),
    __metadata("design:type", Object)
], NotificationPreferencesResponseDto.prototype, "inbox", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, nullable: true }),
    __metadata("design:type", Object)
], NotificationPreferencesResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, nullable: true }),
    __metadata("design:type", Object)
], NotificationPreferencesResponseDto.prototype, "browser", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, nullable: true }),
    __metadata("design:type", Object)
], NotificationPreferencesResponseDto.prototype, "mobile", void 0);
//# sourceMappingURL=notification-preferences-response.dto.js.map