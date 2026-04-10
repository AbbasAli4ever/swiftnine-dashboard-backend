"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const RegisterSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});
class RegisterDto extends (0, nestjs_zod_1.createZodDto)(RegisterSchema) {
}
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map