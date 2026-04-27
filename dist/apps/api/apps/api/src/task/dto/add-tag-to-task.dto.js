"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTagToTaskDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const AddTagToTaskSchema = zod_1.z.object({
    tagId: zod_1.z.string().uuid('Invalid tag ID'),
});
class AddTagToTaskDto extends (0, nestjs_zod_1.createZodDto)(AddTagToTaskSchema) {
}
exports.AddTagToTaskDto = AddTagToTaskDto;
//# sourceMappingURL=add-tag-to-task.dto.js.map