"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDocsQueryDto = exports.ListDocsQuerySchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.ListDocsQuerySchema = zod_1.z.object({
    workspaceId: zod_1.z.string().uuid('Invalid workspace ID'),
    projectId: zod_1.z.string().uuid('Invalid project ID').optional(),
    scope: zod_1.z.enum(['WORKSPACE', 'PROJECT', 'PERSONAL']).optional(),
});
class ListDocsQueryDto extends (0, nestjs_zod_1.createZodDto)(exports.ListDocsQuerySchema) {
}
exports.ListDocsQueryDto = ListDocsQueryDto;
//# sourceMappingURL=list-docs-query.dto.js.map