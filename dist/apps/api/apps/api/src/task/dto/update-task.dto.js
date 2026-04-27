"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const UpdateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500).optional(),
    description: zod_1.z.string().max(10000).nullable().optional(),
    statusId: zod_1.z.string().uuid('Invalid status ID').optional(),
    priority: zod_1.z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE']).optional(),
    startDate: zod_1.z.string().datetime().nullable().optional(),
    dueDate: zod_1.z.string().datetime().nullable().optional(),
    listId: zod_1.z.string().uuid('Invalid list ID').optional(),
});
class UpdateTaskDto extends (0, nestjs_zod_1.createZodDto)(UpdateTaskSchema) {
}
exports.UpdateTaskDto = UpdateTaskDto;
//# sourceMappingURL=update-task.dto.js.map