"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ResetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
    newPassword: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});
class ResetPasswordDto extends (0, nestjs_zod_1.createZodDto)(ResetPasswordSchema) {
}
exports.ResetPasswordDto = ResetPasswordDto;
//# sourceMappingURL=reset-password.dto.js.map