export declare const PROJECT_NOT_FOUND = "Project not found";
export declare const PROJECT_PREFIX_TAKEN = "A project with this task ID prefix already exists in this workspace";
export declare const OWNER_ONLY = "Only the workspace owner can perform this action";
export declare const DEFAULT_STATUSES: readonly [{
    readonly name: "To Do";
    readonly color: "#94a3b8";
    readonly position: 1000;
    readonly isDefault: true;
    readonly isClosed: false;
}, {
    readonly name: "In Progress";
    readonly color: "#3b82f6";
    readonly position: 2000;
    readonly isDefault: true;
    readonly isClosed: false;
}, {
    readonly name: "Review";
    readonly color: "#f59e0b";
    readonly position: 3000;
    readonly isDefault: true;
    readonly isClosed: false;
}, {
    readonly name: "Completed";
    readonly color: "#22c55e";
    readonly position: 4000;
    readonly isDefault: true;
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
    readonly statuses: {
        readonly where: {
            readonly deletedAt: null;
        };
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly color: true;
            readonly position: true;
            readonly isDefault: true;
            readonly isClosed: true;
        };
        readonly orderBy: {
            readonly position: "asc";
        };
    };
    readonly _count: {
        readonly select: {
            readonly taskLists: true;
        };
    };
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
