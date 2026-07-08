"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConversationDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const UpdateConversationSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(200),
});
class UpdateConversationDto extends (0, nestjs_zod_1.createZodDto)(UpdateConversationSchema) {
}
exports.UpdateConversationDto = UpdateConversationDto;
//# sourceMappingURL=update-conversation.dto.js.map