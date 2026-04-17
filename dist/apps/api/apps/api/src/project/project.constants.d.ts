export declare const PROJECT_NOT_FOUND = "Project not found";
export declare const PROJECT_PREFIX_TAKEN = "A project with this task ID prefix already exists in this workspace";
export declare const OWNER_ONLY = "Only the workspace owner can perform this action";
export declare const DEFAULT_STATUSES: readonly [{
    readonly name: "To Do";
    readonly color: "#94a3b8";
    readonly position: 1000;
    readonly group: "NOT_STARTED";
    readonly isDefault: true;
    readonly isProtected: false;
    readonly isClosed: false;
}, {
    readonly name: "In Progress";
    readonly color: "#3b82f6";
    readonly position: 1000;
    readonly group: "ACTIVE";
    readonly isDefault: true;
    readonly isProtected: false;
    readonly isClosed: false;
}, {
    readonly name: "Complete";
    readonly color: "#22c55e";
    readonly position: 1000;
    readonly group: "CLOSED";
    readonly isDefault: true;
    readonly isProtected: true;
    readonly isClosed: true;
}];
export declare const PROJECT_SELECT: {
    readonly id: true;
    readonly workspaceId: true;
    readonly name: true;
    readonly description: true;
    readonly color: true;
    readonly icon: true;
    readonly taskIdPrefix: true;
    readonly isArchived: true;
    readonly createdBy: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export declare const PROJECT_WITH_STATUSES_SELECT: {
    statuses: {
        where: {
            deletedAt: null;
        };
        select: {
            id: true;
            name: true;
            color: true;
            group: true;
            position: true;
            isDefault: true;
            isProtected: true;
            isClosed: true;
        };
        orderBy: ({
            group: "asc";
            position?: undefined;
        } | {
            position: "asc";
            group?: undefined;
        })[];
    };
    _count: {
        select: {
            taskLists: true;
        };
    };
    id: true;
    workspaceId: true;
    name: true;
    description: true;
    color: true;
    icon: true;
    taskIdPrefix: true;
    isArchived: true;
    createdBy: true;
    createdAt: true;
    updatedAt: true;
};
