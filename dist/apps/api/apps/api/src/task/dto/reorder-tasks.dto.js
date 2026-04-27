"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderTasksDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ReorderTasksSchema = zod_1.z.object({
    taskIds: zod_1.z
        .array(zod_1.z.string().uuid('Invalid task ID'))
        .min(1, 'At least one task ID is required'),
});
class ReorderTasksDto extends (0, nestjs_zod_1.createZodDto)(ReorderTasksSchema) {
}
exports.ReorderTasksDto = ReorderTasksDto;
//# sourceMappingURL=reorder-tasks.dto.js.map