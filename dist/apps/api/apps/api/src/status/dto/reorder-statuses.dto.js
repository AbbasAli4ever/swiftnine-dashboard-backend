"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderStatusesDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ReorderStatusesSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid('Invalid project id'),
    groups: zod_1.z.object({
        notStarted: zod_1.z.array(zod_1.z.string().uuid('Invalid status id')),
        active: zod_1.z.array(zod_1.z.string().uuid('Invalid status id')),
        done: zod_1.z.array(zod_1.z.string().uuid('Invalid status id')),
        closed: zod_1.z.array(zod_1.z.string().uuid('Invalid status id')),
    }),
});
class ReorderStatusesDto extends (0, nestjs_zod_1.createZodDto)(ReorderStatusesSchema) {
}
exports.ReorderStatusesDto = ReorderStatusesDto;
//# sourceMappingURL=reorder-statuses.dto.js.map