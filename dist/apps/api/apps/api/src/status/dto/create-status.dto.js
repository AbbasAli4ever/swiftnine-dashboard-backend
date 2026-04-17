"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStatusDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const status_options_1 = require("../status-options");
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const CreateStatusSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid('Invalid project id'),
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    color: zod_1.z
        .string()
        .regex(HEX_COLOR_REGEX, 'Color must be a valid hex code')
        .optional(),
    group: zod_1.z.enum(status_options_1.MUTABLE_STATUS_GROUP_VALUES),
});
class CreateStatusDto extends (0, nestjs_zod_1.createZodDto)(CreateStatusSchema) {
}
exports.CreateStatusDto = CreateStatusDto;
//# sourceMappingURL=create-status.dto.js.map