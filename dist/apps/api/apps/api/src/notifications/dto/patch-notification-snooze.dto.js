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
exports.PatchNotificationSnoozeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PatchNotificationSnoozeDto {
    isSnoozed;
    snoozeUntil;
}
exports.PatchNotificationSnoozeDto = PatchNotificationSnoozeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Set true to snooze notification, false to unsnooze it' }),
    __metadata("design:type", Boolean)
], PatchNotificationSnoozeDto.prototype, "isSnoozed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        format: 'date-time',
        description: 'ISO datetime when snooze expires. Only allowed when isSnoozed=true. If omitted, snooze stays active until manually unset.',
    }),
    __metadata("design:type", String)
], PatchNotificationSnoozeDto.prototype, "snoozeUntil", void 0);
//# sourceMappingURL=patch-notification-snooze.dto.js.map