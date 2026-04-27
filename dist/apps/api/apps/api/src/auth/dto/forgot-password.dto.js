"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
class ForgotPasswordDto extends (0, nestjs_zod_1.createZodDto)(ForgotPasswordSchema) {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
//# sourceMappingURL=forgot-password.dto.js.map