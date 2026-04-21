"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubtaskDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CreateSubtaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(500),
    description: zod_1.z.string().max(10000).optional(),
    statusId: zod_1.z.string().uuid('Invalid status ID'),
    priority: zod_1.z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE']).default('NONE'),
    startDate: zod_1.z.string().datetime().optional(),
    dueDate: zod_1.z.string().datetime().optional(),
});
class CreateSubtaskDto extends (0, nestjs_zod_1.createZodDto)(CreateSubtaskSchema) {
}
exports.CreateSubtaskDto = CreateSubtaskDto;
//# sourceMappingURL=create-subtask.dto.js.map