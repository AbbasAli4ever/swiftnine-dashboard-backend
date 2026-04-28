"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDocsQueryDto = exports.SearchDocsQuerySchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.SearchDocsQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(1, 'Search query is required'),
    workspaceId: zod_1.z.string().uuid('Invalid workspace ID'),
    projectId: zod_1.z.string().uuid('Invalid project ID').optional(),
});
class SearchDocsQueryDto extends (0, nestjs_zod_1.createZodDto)(exports.SearchDocsQuerySchema) {
}
exports.SearchDocsQueryDto = SearchDocsQueryDto;
//# sourceMappingURL=search-docs-query.dto.js.map