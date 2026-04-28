"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocDto = exports.UpdateDocSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const doc_permissions_constants_1 = require("../doc-permissions.constants");
exports.UpdateDocSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(doc_permissions_constants_1.DOC_TITLE_MAX_LENGTH)
        .optional(),
    contentJson: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
class UpdateDocDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateDocSchema) {
}
exports.UpdateDocDto = UpdateDocDto;
//# sourceMappingURL=update-doc.dto.js.map