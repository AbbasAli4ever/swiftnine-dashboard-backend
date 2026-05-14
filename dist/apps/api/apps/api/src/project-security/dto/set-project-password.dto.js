"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetProjectPasswordDto = exports.SetProjectPasswordSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.SetProjectPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(1),
});
class SetProjectPasswordDto extends (0, nestjs_zod_1.createZodDto)(exports.SetProjectPasswordSchema) {
}
exports.SetProjectPasswordDto = SetProjectPasswordDto;
//# sourceMappingURL=set-project-password.dto.js.map