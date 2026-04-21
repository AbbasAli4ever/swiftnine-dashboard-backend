"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTagDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CreateTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(50),
    color: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g. #6366f1)')
        .default('#6366f1'),
});
class CreateTagDto extends (0, nestjs_zod_1.createZodDto)(CreateTagSchema) {
}
exports.CreateTagDto = CreateTagDto;
//# sourceMappingURL=create-tag.dto.js.map