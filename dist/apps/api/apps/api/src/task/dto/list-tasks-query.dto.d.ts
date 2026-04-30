import { z } from 'zod';
export declare const TASK_PRIORITY_VALUES: readonly ["URGENT", "HIGH", "NORMAL", "LOW", "NONE"];
export declare const TASK_STATUS_GROUP_VALUES: readonly ["NOT_STARTED", "ACTIVE", "DONE", "CLOSED"];
export declare const TASK_SORT_FIELDS: readonly ["position", "created_at", "updated_at", "due_date", "priority", "status", "title"];
export declare const TASK_DUE_DATE_PRESETS: readonly ["overdue", "today", "today_or_earlier", "tomorrow", "this_week", "next_week", "no_due_date"];
export declare const ListTasksQuerySchema: any;
declare const ListTasksQueryDto_base: any;
export declare class ListTasksQueryDto extends ListTasksQueryDto_base {
}
export type ListTasksQuery = z.output<typeof ListTasksQuerySchema>;
export {};
