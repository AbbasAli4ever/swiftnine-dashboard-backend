"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMemberDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const AddMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user id'),
    role: zod_1.z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});
class AddMemberDto extends (0, nestjs_zod_1.createZodDto)(AddMemberSchema) {
}
exports.AddMemberDto = AddMemberDto;
//# sourceMappingURL=add-member.dto.js.map