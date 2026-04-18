"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderTaskListsDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ReorderTaskListsSchema = zod_1.z.object({
    listIds: zod_1.z
        .array(zod_1.z.string().uuid('Invalid list id'))
        .min(1, 'At least one list id is required'),
});
class ReorderTaskListsDto extends (0, nestjs_zod_1.createZodDto)(ReorderTaskListsSchema) {
}
exports.ReorderTaskListsDto = ReorderTaskListsDto;
//# sourceMappingURL=reorder-task-lists.dto.js.map