"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const PROJECT_NOT_FOUND = 'Project not found';
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProjectDashboard(workspaceId, projectId) {
        const project = await this.findProjectOrThrow(workspaceId, projectId);
        const [statuses, lists, tasks, attachments] = await Promise.all([
            this.prisma.status.findMany({
                where: { projectId, deletedAt: null },
                select: {
                    id: true,
                    name: true,
                    color: true,
                    group: true,
                    position: true,
                },
                orderBy: [{ group: 'asc' }, { position: 'asc' }],
            }),
            this.prisma.taskList.findMany({
                where: {
                    projectId,
                    deletedAt: null,
                    isArchived: false,
                },
                select: {
                    id: true,
                    name: true,
                    position: true,
                },
                orderBy: { position: 'asc' },
            }),
            this.prisma.task.findMany({
                where: {
                    deletedAt: null,
                    depth: 0,
                    list: {
                        deletedAt: null,
                        isArchived: false,
                        project: {
                            id: projectId,
                            workspaceId,
                            deletedAt: null,
                            isArchived: false,
                        },
                    },
                },
                select: {
                    statusId: true,
                    listId: true,
                    isCompleted: true,
                },
            }),
            this.prisma.attachment.findMany({
                where: {
                    deletedAt: null,
                    task: {
                        deletedAt: null,
                        list: {
                            deletedAt: null,
                            isArchived: false,
                            project: {
                                id: projectId,
                                workspaceId,
                                deletedAt: null,
                                isArchived: false,
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    fileName: true,
                    mimeType: true,
                    fileSize: true,
                    createdAt: true,
                    uploader: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                            avatarColor: true,
                        },
                    },
                    task: {
                        select: {
                            id: true,
                            title: true,
                            taskNumber: true,
                            list: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            }),
        ]);
        return {
            project: {
                id: project.id,
                name: project.name,
                color: project.color,
                icon: project.icon,
            },
            statusSummary: this.buildStatusSummary(statuses, tasks),
            lists: this.buildListSummary(lists, tasks),
            attachments: this.buildAttachments(attachments, project.taskIdPrefix),
            docs: [],
        };
    }
    buildStatusSummary(statuses, tasks) {
        const taskCountByStatus = new Map();
        for (const task of tasks) {
            taskCountByStatus.set(task.statusId, (taskCountByStatus.get(task.statusId) ?? 0) + 1);
        }
        return statuses.map((status) => ({
            statusId: status.id,
            name: status.name,
            color: status.color,
            group: status.group,
            position: status.position,
            count: taskCountByStatus.get(status.id) ?? 0,
        }));
    }
    buildListSummary(lists, tasks) {
        const listStats = new Map();
        for (const task of tasks) {
            const current = listStats.get(task.listId) ?? { taskCount: 0, completedCount: 0 };
            current.taskCount += 1;
            if (task.isCompleted) {
                current.completedCount += 1;
            }
            listStats.set(task.listId, current);
        }
        return lists.map((list) => {
            const current = listStats.get(list.id) ?? { taskCount: 0, completedCount: 0 };
            return {
                id: list.id,
                name: list.name,
                position: list.position,
                taskCount: current.taskCount,
                completedCount: current.completedCount,
                openCount: current.taskCount - current.completedCount,
            };
        });
    }
    buildAttachments(attachments, taskIdPrefix) {
        return attachments.map((attachment) => ({
            id: attachment.id,
            taskId: attachment.task.id,
            taskKey: `${taskIdPrefix}-${attachment.task.taskNumber}`,
            taskTitle: attachment.task.title,
            listId: attachment.task.list.id,
            listName: attachment.task.list.name,
            fileName: attachment.fileName,
            mimeType: attachment.mimeType,
            fileSize: Number(attachment.fileSize),
            createdAt: attachment.createdAt,
            uploadedBy: attachment.uploader,
        }));
    }
    async findProjectOrThrow(workspaceId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId,
                deletedAt: null,
                isArchived: false,
            },
            select: {
                id: true,
                name: true,
                color: true,
                icon: true,
                taskIdPrefix: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException(PROJECT_NOT_FOUND);
        }
        return project;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map