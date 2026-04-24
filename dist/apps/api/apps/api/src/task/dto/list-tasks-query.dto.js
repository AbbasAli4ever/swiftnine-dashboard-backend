"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTasksQueryDto = exports.ListTasksQuerySchema = exports.TASK_DUE_DATE_PRESETS = exports.TASK_SORT_FIELDS = exports.TASK_STATUS_GROUP_VALUES = exports.TASK_PRIORITY_VALUES = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const query_schemas_1 = require("../../common/query/query.schemas");
exports.TASK_PRIORITY_VALUES = ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'];
exports.TASK_STATUS_GROUP_VALUES = ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'];
exports.TASK_SORT_FIELDS = [
    'position',
    'created_at',
    'updated_at',
    'due_date',
    'priority',
    'status',
    'title',
];
exports.TASK_DUE_DATE_PRESETS = [
    'overdue',
    'today',
    'today_or_earlier',
    'tomorrow',
    'this_week',
    'next_week',
    'no_due_date',
];
const uuidOrUnassignedCsv = query_schemas_1.csvOrArray.transform((values, ctx) => {
    if (!values)
        return undefined;
    const invalid = values.find((value) => value !== 'unassigned' &&
        !zod_1.z.string().uuid().safeParse(value).success);
    if (invalid) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Invalid assignee id',
        });
        return zod_1.z.NEVER;
    }
    return values;
});
exports.ListTasksQuerySchema = zod_1.z
    .object({
    q: zod_1.z.string().trim().min(1).max(200).optional(),
    search: zod_1.z.string().trim().min(1).max(200).optional(),
    page: query_schemas_1.optionalPage,
    limit: query_schemas_1.optionalLimit,
    sort_by: zod_1.z.enum(exports.TASK_SORT_FIELDS).optional(),
    sort_order: zod_1.z.enum(['asc', 'desc']).default('asc'),
    status: query_schemas_1.csvOrArray,
    status_ids: query_schemas_1.csvOrArray,
    status_groups: (0, query_schemas_1.enumCsvOrArray)(exports.TASK_STATUS_GROUP_VALUES, 'Invalid status group'),
    priority: (0, query_schemas_1.enumCsvOrArray)(exports.TASK_PRIORITY_VALUES, 'Invalid priority'),
    priorities: (0, query_schemas_1.enumCsvOrArray)(exports.TASK_PRIORITY_VALUES, 'Invalid priority'),
    due_date_from: query_schemas_1.optionalDate,
    due_date_to: query_schemas_1.optionalDate,
    due_date: zod_1.z.enum(exports.TASK_DUE_DATE_PRESETS).optional(),
    assignee: uuidOrUnassignedCsv,
    assignee_ids: uuidOrUnassignedCsv,
    assignee_match: zod_1.z.enum(['any', 'all']).default('any'),
    tag: query_schemas_1.csvOrArray,
    tag_ids: query_schemas_1.csvOrArray,
    tag_match: zod_1.z.enum(['any', 'all']).default('any'),
    created_by: query_schemas_1.csvOrArray,
    created_from: query_schemas_1.optionalDate,
    created_to: query_schemas_1.optionalDate,
    updated_from: query_schemas_1.optionalDate,
    updated_to: query_schemas_1.optionalDate,
    completed_from: query_schemas_1.optionalDate,
    completed_to: query_schemas_1.optionalDate,
    include_subtasks: query_schemas_1.optionalBoolean,
    include_closed: query_schemas_1.optionalBoolean,
    include_archived: query_schemas_1.optionalBoolean,
    me: query_schemas_1.optionalBoolean,
    has_assignees: query_schemas_1.optionalBoolean,
    has_due_date: query_schemas_1.optionalBoolean,
    completed: query_schemas_1.optionalBoolean,
})
    .transform((raw, ctx) => {
    const statusIds = raw.status_ids ?? raw.status;
    const tagIds = raw.tag_ids ?? raw.tag;
    const assigneeIds = raw.assignee_ids ?? raw.assignee;
    const priorities = raw.priorities ?? raw.priority;
    for (const [field, values] of [
        ['status_ids', statusIds],
        ['tag_ids', tagIds],
        ['created_by', raw.created_by],
    ]) {
        const invalid = values?.find((value) => !zod_1.z.string().uuid().safeParse(value).success);
        if (invalid) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: `Invalid ${field} value: ${invalid}`,
            });
            return zod_1.z.NEVER;
        }
    }
    return {
        q: raw.q ?? raw.search,
        page: raw.page,
        limit: raw.limit,
        sortBy: raw.sort_by,
        sortOrder: raw.sort_order,
        statusIds,
        statusGroups: raw.status_groups,
        priorities,
        dueDateFrom: raw.due_date_from,
        dueDateTo: raw.due_date_to,
        dueDate: raw.due_date,
        assigneeIds,
        assigneeMatch: raw.assignee_match,
        tagIds,
        tagMatch: raw.tag_match,
        createdBy: raw.created_by,
        createdFrom: raw.created_from,
        createdTo: raw.created_to,
        updatedFrom: raw.updated_from,
        updatedTo: raw.updated_to,
        completedFrom: raw.completed_from,
        completedTo: raw.completed_to,
        includeSubtasks: raw.include_subtasks ?? false,
        includeClosed: raw.include_closed ?? true,
        includeArchived: raw.include_archived ?? false,
        me: raw.me ?? false,
        hasAssignees: raw.has_assignees,
        hasDueDate: raw.has_due_date,
        completed: raw.completed,
    };
});
class ListTasksQueryDto extends (0, nestjs_zod_1.createZodDto)(exports.ListTasksQuerySchema) {
}
exports.ListTasksQueryDto = ListTasksQueryDto;
//# sourceMappingURL=list-tasks-query.dto.js.map