"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskListDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const UpdateTaskListSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
});
class UpdateTaskListDto extends (0, nestjs_zod_1.createZodDto)(UpdateTaskListSchema) {
}
exports.UpdateTaskListDto = UpdateTaskListDto;
//# sourceMappingURL=update-task-list.dto.js.map