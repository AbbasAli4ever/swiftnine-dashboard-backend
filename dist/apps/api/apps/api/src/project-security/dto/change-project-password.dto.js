"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeProjectPasswordDto = exports.ChangeProjectPasswordSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.ChangeProjectPasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(1),
});
class ChangeProjectPasswordDto extends (0, nestjs_zod_1.createZodDto)(exports.ChangeProjectPasswordSchema) {
}
exports.ChangeProjectPasswordDto = ChangeProjectPasswordDto;
//# sourceMappingURL=change-project-password.dto.js.map