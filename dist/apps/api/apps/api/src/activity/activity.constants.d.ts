export declare const DEFAULT_ACTIVITY_LIMIT = 25;
export declare const MAX_ACTIVITY_LIMIT = 100;
export declare const ACTIVITY_ENTITY_TYPES: readonly ["workspace", "workspace_member", "workspace_invite", "project", "task_list", "status", "tag", "task", "comment", "attachment", "time_entry", "user"];
export declare const ACTIVITY_CATEGORIES: readonly ["workspace", "member", "invite", "project", "list", "status", "tag", "task_creation", "name", "description", "priority", "start_date", "due_date", "completion", "assignee", "tags", "attachments", "comments", "time_tracked", "list_moved", "subtask", "archived_deleted", "reorder"];
export type ActivityEntityType = (typeof ACTIVITY_ENTITY_TYPES)[number];
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];
export declare const FIELD_CATEGORY_MAP: Record<string, ActivityCategory>;
export declare const ACTION_CATEGORY_MAP: Record<string, ActivityCategory>;
