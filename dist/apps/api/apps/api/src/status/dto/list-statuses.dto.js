"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListStatusesDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ListStatusesSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid('Invalid project id'),
});
class ListStatusesDto extends (0, nestjs_zod_1.createZodDto)(ListStatusesSchema) {
}
exports.ListStatusesDto = ListStatusesDto;
//# sourceMappingURL=list-statuses.dto.js.map