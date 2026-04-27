"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStatusesDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const DefaultStatusesSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid('Invalid project id'),
});
class DefaultStatusesDto extends (0, nestjs_zod_1.createZodDto)(DefaultStatusesSchema) {
}
exports.DefaultStatusesDto = DefaultStatusesDto;
//# sourceMappingURL=default-statuses.dto.js.map