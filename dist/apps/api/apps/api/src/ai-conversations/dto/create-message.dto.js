"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessageDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CreateMessageSchema = zod_1.z.object({
    role: zod_1.z.enum(['USER', 'ASSISTANT']),
    content: zod_1.z.string().min(1),
    status: zod_1.z.enum(['COMPLETE', 'ABORTED']).default('COMPLETE'),
    title: zod_1.z.string().trim().min(1).max(200).optional(),
    attachmentIds: zod_1.z.array(zod_1.z.string().uuid()).max(10).optional(),
});
class CreateMessageDto extends (0, nestjs_zod_1.createZodDto)(CreateMessageSchema) {
}
exports.CreateMessageDto = CreateMessageDto;
//# sourceMappingURL=create-message.dto.js.map