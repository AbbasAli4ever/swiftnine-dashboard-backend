"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMessagesDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const query_schemas_1 = require("../../common/query/query.schemas");
const ListMessagesSchema = zod_1.z.object({
    cursor: zod_1.z.string().trim().min(1).optional(),
    limit: query_schemas_1.optionalLimit.transform((value) => Math.min(value, 100)).default(50),
});
class ListMessagesDto extends (0, nestjs_zod_1.createZodDto)(ListMessagesSchema) {
}
exports.ListMessagesDto = ListMessagesDto;
//# sourceMappingURL=list-messages.dto.js.map