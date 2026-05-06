"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMessagesDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const query_schemas_1 = require("../../common/query/query.schemas");
const SearchMessagesSchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(1).max(200),
    channelId: zod_1.z.string().uuid().optional(),
    cursor: zod_1.z.string().trim().min(1).optional(),
    limit: query_schemas_1.optionalLimit.transform((value) => Math.min(value, 100)).default(50),
});
class SearchMessagesDto extends (0, nestjs_zod_1.createZodDto)(SearchMessagesSchema) {
}
exports.SearchMessagesDto = SearchMessagesDto;
//# sourceMappingURL=search-messages.dto.js.map