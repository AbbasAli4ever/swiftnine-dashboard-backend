"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const VerifyEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    otp: zod_1.z
        .string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must be numeric'),
});
class VerifyEmailDto extends (0, nestjs_zod_1.createZodDto)(VerifyEmailSchema) {
}
exports.VerifyEmailDto = VerifyEmailDto;
//# sourceMappingURL=verify-email.dto.js.map