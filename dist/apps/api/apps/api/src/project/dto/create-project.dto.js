"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CreateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    description: zod_1.z.string().max(500).optional(),
    color: zod_1.z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g. #6366f1)')
        .default('#6366f1'),
    icon: zod_1.z.string().max(50).optional(),
    taskIdPrefix: zod_1.z
        .string()
        .min(2, 'Prefix must be 2–6 characters')
        .max(6, 'Prefix must be 2–6 characters')
        .regex(/^[A-Z0-9]+$/, 'Prefix must be uppercase letters and numbers only')
        .transform((v) => v.toUpperCase()),
});
class CreateProjectDto extends (0, nestjs_zod_1.createZodDto)(CreateProjectSchema) {
}
exports.CreateProjectDto = CreateProjectDto;
//# sourceMappingURL=create-project.dto.js.map