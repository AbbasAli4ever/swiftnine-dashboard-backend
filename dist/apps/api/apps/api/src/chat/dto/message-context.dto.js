"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageContextDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const query_schemas_1 = require("../../common/query/query.schemas");
const MessageContextSchema = zod_1.z.object({
    messageId: zod_1.z.string().uuid(),
    before: query_schemas_1.optionalLimit.transform((value) => Math.min(value, 50)).default(20),
    after: query_schemas_1.optionalLimit.transform((value) => Math.min(value, 50)).default(20),
});
class MessageContextDto extends (0, nestjs_zod_1.createZodDto)(MessageContextSchema) {
}
exports.MessageContextDto = MessageContextDto;
//# sourceMappingURL=message-context.dto.js.map