"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderBoardTasksDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ReorderBoardTasksSchema = zod_1.z.object({
    mode: zod_1.z.literal('manual').default('manual'),
    taskId: zod_1.z.string().uuid('Invalid task ID'),
    toStatusId: zod_1.z.string().uuid('Invalid status ID'),
    toListId: zod_1.z.string().uuid('Invalid list ID').optional(),
    orderedTaskIds: zod_1.z
        .array(zod_1.z.string().uuid('Invalid task ID'))
        .min(1, 'At least one task ID is required'),
});
class ReorderBoardTasksDto extends (0, nestjs_zod_1.createZodDto)(ReorderBoardTasksSchema) {
}
exports.ReorderBoardTasksDto = ReorderBoardTasksDto;
//# sourceMappingURL=reorder-board-tasks.dto.js.map