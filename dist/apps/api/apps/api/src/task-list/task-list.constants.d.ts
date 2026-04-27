export declare const TASK_LIST_NOT_FOUND = "Task list not found";
export declare const PROJECT_NOT_FOUND = "Project not found";
export declare const TASK_LIST_NAME_TAKEN = "A list with this name already exists in this project";
export declare const INVALID_REORDER_PAYLOAD = "Reorder payload must include every active list exactly once";
export declare const TASK_LIST_ALREADY_ARCHIVED = "Task list is already archived";
export declare const TASK_LIST_NOT_ARCHIVED = "Task list is not archived";
export declare const TASK_LIST_OWNER_NOT_IN_WORKSPACE = "Owner must be an active member of this workspace";
export declare const TASK_LIST_INVALID_DATE_RANGE = "List start date cannot be after list end date";
export declare const TASK_LIST_SELECT: {
    id: true;
    projectId: true;
    name: true;
    position: true;
    startDate: true;
    endDate: true;
    ownerUserId: true;
    priority: true;
    isArchived: true;
    createdBy: true;
    createdAt: true;
    updatedAt: true;
    owner: {
        select: {
            id: true;
            fullName: true;
            avatarUrl: true;
            avatarColor: true;
        };
    };
};
