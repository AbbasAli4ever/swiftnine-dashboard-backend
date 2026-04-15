"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteMemberDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const InviteMemberSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    role: zod_1.z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});
class InviteMemberDto extends (0, nestjs_zod_1.createZodDto)(InviteMemberSchema) {
}
exports.InviteMemberDto = InviteMemberDto;
//# sourceMappingURL=invite-member.dto.js.map