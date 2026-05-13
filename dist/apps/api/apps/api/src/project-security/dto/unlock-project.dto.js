"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockProjectDto = exports.UnlockProjectSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UnlockProjectSchema = zod_1.z.object({
    password: zod_1.z.string().min(1),
});
class UnlockProjectDto extends (0, nestjs_zod_1.createZodDto)(exports.UnlockProjectSchema) {
}
exports.UnlockProjectDto = UnlockProjectDto;
//# sourceMappingURL=unlock-project.dto.js.map