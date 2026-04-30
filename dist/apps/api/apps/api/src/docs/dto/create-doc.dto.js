"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDocDto = exports.CreateDocSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const doc_permissions_constants_1 = require("../doc-permissions.constants");
exports.CreateDocSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(doc_permissions_constants_1.DOC_TITLE_MAX_LENGTH, `Title must be ${doc_permissions_constants_1.DOC_TITLE_MAX_LENGTH} characters or fewer`),
    scope: zod_1.z.enum(['WORKSPACE', 'PROJECT', 'PERSONAL']),
    workspaceId: zod_1.z.string().uuid('Invalid workspace ID'),
    projectId: zod_1.z.string().uuid('Invalid project ID').nullish(),
    contentJson: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
class CreateDocDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateDocSchema) {
}
exports.CreateDocDto = CreateDocDto;
//# sourceMappingURL=create-doc.dto.js.map