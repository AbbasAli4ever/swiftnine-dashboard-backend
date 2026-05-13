"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmProjectPasswordResetDto = exports.ConfirmProjectPasswordResetSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.ConfirmProjectPasswordResetSchema = zod_1.z.object({
    token: zod_1.z.string().uuid('Invalid reset token'),
    newPassword: zod_1.z.string().min(1),
});
class ConfirmProjectPasswordResetDto extends (0, nestjs_zod_1.createZodDto)(exports.ConfirmProjectPasswordResetSchema) {
}
exports.ConfirmProjectPasswordResetDto = ConfirmProjectPasswordResetDto;
//# sourceMappingURL=confirm-project-password-reset.dto.js.map