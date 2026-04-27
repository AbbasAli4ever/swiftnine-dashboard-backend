"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskListDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const TASK_LIST_PRIORITY_VALUES = ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'];
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const dateOnlySchema = zod_1.z
    .string()
    .regex(dateOnlyPattern, 'Date must be in YYYY-MM-DD format');
const UpdateTaskListSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1, 'Name is required').max(255).optional(),
    startDate: dateOnlySchema.nullable().optional(),
    endDate: dateOnlySchema.nullable().optional(),
    ownerId: zod_1.z.string().uuid('Owner must be a valid UUID').nullable().optional(),
    priority: zod_1.z.enum(TASK_LIST_PRIORITY_VALUES).nullable().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
})
    .superRefine((data, ctx) => {
    if (data.startDate &&
        data.endDate &&
        data.startDate.localeCompare(data.endDate) > 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'startDate cannot be after endDate',
            path: ['startDate'],
        });
    }
});
class UpdateTaskListDto extends (0, nestjs_zod_1.createZodDto)(UpdateTaskListSchema) {
}
exports.UpdateTaskListDto = UpdateTaskListDto;
//# sourceMappingURL=update-task-list.dto.js.map