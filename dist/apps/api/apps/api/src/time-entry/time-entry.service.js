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
exports.TimeEntryService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const time_entry_constants_1 = require("./time-entry.constants");
let TimeEntryService = class TimeEntryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addManual(workspaceId, userId, taskId, dto) {
        await this.findTaskOrThrow(workspaceId, taskId);
        let startTime;
        let endTime;
        let duration;
        if (dto.startTime && dto.endTime) {
            startTime = new Date(dto.startTime);
            endTime = new Date(dto.endTime);
            duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
        }
        else {
            const minutes = dto.durationMinutes;
            endTime = new Date();
            startTime = new Date(endTime.getTime() - minutes * 60 * 1000);
            duration = minutes * 60;
        }
        const entry = await this.prisma.timeEntry.create({
            data: {
                taskId,
                userId,
                description: dto.description ?? null,
                startTime,
                endTime,
                duration,
                isManual: true,
            },
            select: time_entry_constants_1.TIME_ENTRY_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'time_entry',
                entityId: entry.id,
                action: 'manual_logged',
                metadata: { taskId, duration },
                performedBy: userId,
            },
        });
        return entry;
    }
    async startTimer(workspaceId, userId, taskId) {
        await this.findTaskOrThrow(workspaceId, taskId);
        const existingActive = await this.findActiveTimerForUser(workspaceId, userId);
        let stoppedEntry = null;
        if (existingActive) {
            stoppedEntry = await this.stopActiveEntry(workspaceId, userId, existingActive.id);
        }
        const now = new Date();
        const activeEntry = await this.prisma.timeEntry.create({
            data: {
                taskId,
                userId,
                startTime: now,
                isManual: false,
            },
            select: time_entry_constants_1.TIME_ENTRY_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'time_entry',
                entityId: activeEntry.id,
                action: 'timer_started',
                metadata: { taskId },
                performedBy: userId,
            },
        });
        return { stoppedEntry, activeEntry };
    }
    async stopTimer(workspaceId, userId, taskId) {
        await this.findTaskOrThrow(workspaceId, taskId);
        const active = await this.prisma.timeEntry.findFirst({
            where: {
                userId,
                taskId,
                endTime: null,
                deletedAt: null,
            },
            select: { id: true },
        });
        if (!active)
            throw new common_1.NotFoundException(time_entry_constants_1.NO_ACTIVE_TIMER);
        return this.stopActiveEntry(workspaceId, userId, active.id);
    }
    async findAllByTask(workspaceId, taskId) {
        await this.findTaskOrThrow(workspaceId, taskId);
        return this.prisma.timeEntry.findMany({
            where: { taskId, deletedAt: null },
            select: time_entry_constants_1.TIME_ENTRY_SELECT,
            orderBy: { startTime: 'desc' },
        });
    }
    async findActiveTimer(workspaceId, userId) {
        return this.findActiveTimerForUser(workspaceId, userId);
    }
    async update(workspaceId, userId, entryId, dto) {
        const entry = await this.findEntryOrThrow(workspaceId, entryId);
        if (entry.userId !== userId)
            throw new common_1.ForbiddenException(time_entry_constants_1.FORBIDDEN_TIME_ENTRY);
        const updateData = {};
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.startTime !== undefined || dto.endTime !== undefined) {
            const newStart = dto.startTime ? new Date(dto.startTime) : entry.startTime;
            const newEnd = dto.endTime ? new Date(dto.endTime) : entry.endTime;
            updateData.startTime = newStart;
            if (newEnd) {
                updateData.endTime = newEnd;
                updateData.duration = Math.round((newEnd.getTime() - newStart.getTime()) / 1000);
            }
        }
        if (Object.keys(updateData).length === 0)
            return entry;
        const updated = await this.prisma.timeEntry.update({
            where: { id: entryId },
            data: updateData,
            select: time_entry_constants_1.TIME_ENTRY_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'time_entry',
                entityId: entryId,
                action: 'updated',
                metadata: {},
                performedBy: userId,
            },
        });
        return updated;
    }
    async remove(workspaceId, userId, entryId) {
        const entry = await this.findEntryOrThrow(workspaceId, entryId);
        if (entry.userId !== userId)
            throw new common_1.ForbiddenException(time_entry_constants_1.FORBIDDEN_TIME_ENTRY);
        await this.prisma.$transaction(async (tx) => {
            await tx.timeEntry.update({ where: { id: entryId }, data: { deletedAt: new Date() } });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'time_entry',
                    entityId: entryId,
                    action: 'deleted',
                    metadata: {},
                    performedBy: userId,
                },
            });
        });
    }
    async findTaskOrThrow(workspaceId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: { id: true },
        });
        if (!task)
            throw new common_1.NotFoundException(time_entry_constants_1.TASK_NOT_FOUND);
        return task;
    }
    async findEntryOrThrow(workspaceId, entryId) {
        const entry = await this.prisma.timeEntry.findFirst({
            where: {
                id: entryId,
                deletedAt: null,
                task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
            },
            select: time_entry_constants_1.TIME_ENTRY_SELECT,
        });
        if (!entry)
            throw new common_1.NotFoundException(time_entry_constants_1.TIME_ENTRY_NOT_FOUND);
        return entry;
    }
    async findActiveTimerForUser(workspaceId, userId) {
        return this.prisma.timeEntry.findFirst({
            where: {
                userId,
                endTime: null,
                deletedAt: null,
                task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
            },
            select: time_entry_constants_1.TIME_ENTRY_SELECT,
        });
    }
    async stopActiveEntry(workspaceId, userId, entryId) {
        const entry = await this.prisma.timeEntry.findFirstOrThrow({
            where: { id: entryId },
            select: { startTime: true },
        });
        const now = new Date();
        const duration = Math.round((now.getTime() - entry.startTime.getTime()) / 1000);
        const stopped = await this.prisma.timeEntry.update({
            where: { id: entryId },
            data: { endTime: now, duration },
            select: time_entry_constants_1.TIME_ENTRY_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'time_entry',
                entityId: entryId,
                action: 'timer_stopped',
                metadata: { duration },
                performedBy: userId,
            },
        });
        return stopped;
    }
};
exports.TimeEntryService = TimeEntryService;
exports.TimeEntryService = TimeEntryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], TimeEntryService);
//# sourceMappingURL=time-entry.service.js.map