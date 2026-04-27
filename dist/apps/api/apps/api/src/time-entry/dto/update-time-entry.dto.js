"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimeEntryDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const UpdateTimeEntrySchema = zod_1.z
    .object({
    description: zod_1.z.string().max(500).nullable().optional(),
    startTime: zod_1.z.string().datetime().optional(),
    endTime: zod_1.z.string().datetime().optional(),
})
    .superRefine((data, ctx) => {
    if (data.startTime !== undefined && data.endTime !== undefined) {
        if (new Date(data.endTime) <= new Date(data.startTime)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'End time must be after start time',
                path: ['endTime'],
            });
        }
    }
});
class UpdateTimeEntryDto extends (0, nestjs_zod_1.createZodDto)(UpdateTimeEntrySchema) {
}
exports.UpdateTimeEntryDto = UpdateTimeEntryDto;
//# sourceMappingURL=update-time-entry.dto.js.map