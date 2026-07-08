"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConversationDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CreateConversationSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(200).optional(),
});
class CreateConversationDto extends (0, nestjs_zod_1.createZodDto)(CreateConversationSchema) {
}
exports.CreateConversationDto = CreateConversationDto;
//# sourceMappingURL=create-conversation.dto.js.map