"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const UpdateStatusSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1).max(100).optional(),
    color: zod_1.z
        .string()
        .regex(HEX_COLOR_REGEX, 'Color must be a valid hex code')
        .optional(),
})
    .refine((value) => value.name !== undefined || value.color !== undefined, {
    message: 'At least one field must be provided',
});
class UpdateStatusDto extends (0, nestjs_zod_1.createZodDto)(UpdateStatusSchema) {
}
exports.UpdateStatusDto = UpdateStatusDto;
//# sourceMappingURL=update-status.dto.js.map