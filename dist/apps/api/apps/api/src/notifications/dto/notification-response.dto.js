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
exports.NotificationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class NotificationResponseDto {
    id;
    type;
    title;
    message;
    referenceType;
    referenceId;
    actorId;
    isRead;
    createdAt;
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Notification id' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Notification type' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Notification title' }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Optional message', required: false }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Reference entity type', required: false }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "referenceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Reference entity id', required: false }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "referenceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Actor user id performing the action', required: false }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "actorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Read state' }),
    __metadata("design:type", Boolean)
], NotificationResponseDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time', description: 'Created at timestamp' }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=notification-response.dto.js.map