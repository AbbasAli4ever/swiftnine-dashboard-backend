"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteStatusDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const DeleteStatusSchema = zod_1.z.object({
    replacementStatusId: zod_1.z.string().uuid('Invalid replacement status id').optional(),
});
class DeleteStatusDto extends (0, nestjs_zod_1.createZodDto)(DeleteStatusSchema) {
}
exports.DeleteStatusDto = DeleteStatusDto;
//# sourceMappingURL=delete-status.dto.js.map