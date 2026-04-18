"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskListDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CreateTaskListSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
});
class CreateTaskListDto extends (0, nestjs_zod_1.createZodDto)(CreateTaskListSchema) {
}
exports.CreateTaskListDto = CreateTaskListDto;
//# sourceMappingURL=create-task-list.dto.js.map