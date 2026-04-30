export declare const TASK_NOT_FOUND = "Task not found";
export declare const TASK_LIST_NOT_FOUND = "Task list not found";
export declare const PROJECT_NOT_FOUND = "Project not found";
export declare const STATUS_NOT_FOUND = "Status not found or does not belong to this project";
export declare const USER_NOT_MEMBER = "One or more users are not members of this workspace";
export declare const TAG_NOT_IN_WORKSPACE = "One or more tags do not belong to this workspace";
export declare const SUBTASK_DEPTH_LIMIT = "Subtask nesting limit reached (max depth 2)";
export declare const TAG_ALREADY_ON_TASK = "Tag is already added to this task";
export declare const TAG_NOT_ON_TASK = "Tag is not on this task";
export declare const FORBIDDEN_DELETE = "Only the task creator or workspace owner can delete this task";
export declare const INVALID_REORDER_PAYLOAD = "Reorder payload must include every active task in the list exactly once";
export declare const INVALID_BOARD_REORDER_PAYLOAD = "Board reorder payload must include every active top-level task in the destination status exactly once";
export declare const BOARD_REORDER_SUBTASK_FORBIDDEN = "Board reorder supports top-level tasks only";
export declare const TASK_LIST_ITEM_SELECT: {
    id: true;
    taskNumber: true;
    title: true;
    priority: true;
    startDate: true;
    dueDate: true;
    position: true;
    boardPosition: true;
    depth: true;
    isCompleted: true;
    completedAt: true;
    createdAt: true;
    updatedAt: true;
    status: {
        select: {
            readonly id: true;
            readonly name: true;
            readonly color: true;
            readonly group: true;
        };
    };
    assignees: {
        readonly select: {
            readonly user: {
                readonly select: {
                    readonly id: true;
                    readonly fullName: true;
                    readonly avatarUrl: true;
                    readonly avatarColor: true;
                };
            };
            readonly assignedBy: true;
        };
    };
    tags: {
        readonly select: {
            readonly tag: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly color: true;
                };
            };
        };
    };
    list: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly project: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly taskIdPrefix: true;
                };
            };
        };
    };
    _count: {
        select: {
            children: {
                where: {
                    deletedAt: null;
                };
            };
        };
    };
};
export declare const TASK_DETAIL_SELECT: {
    id: true;
    taskNumber: true;
    parentId: true;
    depth: true;
    title: true;
    description: true;
    descriptionJson: true;
    descriptionPlaintext: true;
    priority: true;
    startDate: true;
    dueDate: true;
    position: true;
    boardPosition: true;
    isCompleted: true;
    completedAt: true;
    createdBy: true;
    createdAt: true;
    updatedAt: true;
    status: {
        select: {
            readonly id: true;
            readonly name: true;
            readonly color: true;
            readonly group: true;
        };
    };
    creator: {
        select: {
            readonly id: true;
            readonly fullName: true;
            readonly avatarUrl: true;
            readonly avatarColor: true;
        };
    };
    assignees: {
        readonly select: {
            readonly user: {
                readonly select: {
                    readonly id: true;
                    readonly fullName: true;
                    readonly avatarUrl: true;
                    readonly avatarColor: true;
                };
            };
            readonly assignedBy: true;
        };
    };
    tags: {
        readonly select: {
            readonly tag: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly color: true;
                };
            };
        };
    };
    list: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly project: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly taskIdPrefix: true;
                };
            };
        };
    };
    children: {
        where: {
            deletedAt: null;
        };
        select: {
            id: true;
            taskNumber: true;
            title: true;
            priority: true;
            isCompleted: true;
            completedAt: true;
            depth: true;
            position: true;
            status: {
                select: {
                    readonly id: true;
                    readonly name: true;
                    readonly color: true;
                    readonly group: true;
                };
            };
            assignees: {
                readonly select: {
                    readonly user: {
                        readonly select: {
                            readonly id: true;
                            readonly fullName: true;
                            readonly avatarUrl: true;
                            readonly avatarColor: true;
                        };
                    };
                    readonly assignedBy: true;
                };
            };
        };
        orderBy: {
            position: "asc";
        };
    };
    timeEntries: {
        where: {
            deletedAt: null;
        };
        select: {
            id: true;
            userId: true;
            description: true;
            startTime: true;
            endTime: true;
            duration: true;
            isManual: true;
            createdAt: true;
            user: {
                select: {
                    readonly id: true;
                    readonly fullName: true;
                    readonly avatarUrl: true;
                    readonly avatarColor: true;
                };
            };
        };
        orderBy: {
            startTime: "desc";
        };
    };
};
