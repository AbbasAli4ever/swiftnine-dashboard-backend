"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAssigneesDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const AddAssigneesSchema = zod_1.z.object({
    userIds: zod_1.z.array(zod_1.z.string().uuid('Invalid user ID')).min(1, 'At least one user ID is required'),
});
class AddAssigneesDto extends (0, nestjs_zod_1.createZodDto)(AddAssigneesSchema) {
}
exports.AddAssigneesDto = AddAssigneesDto;
//# sourceMappingURL=add-assignees.dto.js.map