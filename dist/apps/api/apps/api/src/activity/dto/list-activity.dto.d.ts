import { z } from 'zod';
export declare const ListActivitySchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>;
    entityType: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
        project: "project";
        status: "status";
        tag: "tag";
        task: "task";
        comment: "comment";
        attachment: "attachment";
        task_list: "task_list";
        workspace_member: "workspace_member";
        workspace_invite: "workspace_invite";
        time_entry: "time_entry";
    }>>;
    entityId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    listId: z.ZodOptional<z.ZodString>;
    taskId: z.ZodOptional<z.ZodString>;
    actorIds: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>;
    actions: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>;
    categories: z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>, z.ZodTransform<("comments" | "workspace" | "project" | "status" | "tag" | "list" | "description" | "tags" | "attachments" | "name" | "priority" | "reorder" | "due_date" | "assignee" | "member" | "invite" | "task_creation" | "start_date" | "completion" | "time_tracked" | "list_moved" | "subtask" | "archived_deleted")[] | undefined, string[] | undefined>>;
    includeSubtasks: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
    me: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ListActivityDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>;
    entityType: z.ZodOptional<z.ZodEnum<{
        user: "user";
        workspace: "workspace";
        project: "project";
        status: "status";
        tag: "tag";
        task: "task";
        comment: "comment";
        attachment: "attachment";
        task_list: "task_list";
        workspace_member: "workspace_member";
        workspace_invite: "workspace_invite";
        time_entry: "time_entry";
    }>>;
    entityId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    listId: z.ZodOptional<z.ZodString>;
    taskId: z.ZodOptional<z.ZodString>;
    actorIds: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>;
    actions: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>;
    categories: z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>, z.ZodTransform<("comments" | "workspace" | "project" | "status" | "tag" | "list" | "description" | "tags" | "attachments" | "name" | "priority" | "reorder" | "due_date" | "assignee" | "member" | "invite" | "task_creation" | "start_date" | "completion" | "time_tracked" | "list_moved" | "subtask" | "archived_deleted")[] | undefined, string[] | undefined>>;
    includeSubtasks: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
    me: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class ListActivityDto extends ListActivityDto_base {
}
export {};
