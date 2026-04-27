"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptInviteDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const AcceptInviteSchema = zod_1.z.object({
    token: zod_1.z.string().uuid('Invalid invite token'),
});
class AcceptInviteDto extends (0, nestjs_zod_1.createZodDto)(AcceptInviteSchema) {
}
exports.AcceptInviteDto = AcceptInviteDto;
//# sourceMappingURL=accept-invite.dto.js.map