"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualTimeEntryDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ManualTimeEntrySchema = zod_1.z
    .object({
    description: zod_1.z.string().max(500).optional(),
    startTime: zod_1.z.string().datetime().optional(),
    endTime: zod_1.z.string().datetime().optional(),
    durationMinutes: zod_1.z.number().int().positive().max(1440).optional(),
})
    .superRefine((data, ctx) => {
    const hasTimeRange = data.startTime !== undefined && data.endTime !== undefined;
    const hasDuration = data.durationMinutes !== undefined;
    if (!hasTimeRange && !hasDuration) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Provide either startTime + endTime, or durationMinutes',
            path: ['startTime'],
        });
    }
    if (hasTimeRange && new Date(data.endTime) <= new Date(data.startTime)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'End time must be after start time',
            path: ['endTime'],
        });
    }
});
class ManualTimeEntryDto extends (0, nestjs_zod_1.createZodDto)(ManualTimeEntrySchema) {
}
exports.ManualTimeEntryDto = ManualTimeEntryDto;
//# sourceMappingURL=manual-time-entry.dto.js.map