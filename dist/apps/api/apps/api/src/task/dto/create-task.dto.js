"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CreateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(500),
    description: zod_1.z.string().max(10000).optional(),
    statusId: zod_1.z.string().uuid('Invalid status ID'),
    priority: zod_1.z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE']).default('NONE'),
    startDate: zod_1.z.string().datetime().nullable().optional(),
    dueDate: zod_1.z.string().datetime().nullable().optional(),
    assigneeIds: zod_1.z.array(zod_1.z.string().uuid('Invalid user ID')).optional(),
    tagIds: zod_1.z.array(zod_1.z.string().uuid('Invalid tag ID')).optional(),
});
class CreateTaskDto extends (0, nestjs_zod_1.createZodDto)(CreateTaskSchema) {
}
exports.CreateTaskDto = CreateTaskDto;
//# sourceMappingURL=create-task.dto.js.map