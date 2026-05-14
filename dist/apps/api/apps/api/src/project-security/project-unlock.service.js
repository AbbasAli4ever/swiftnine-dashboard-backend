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
exports.ProjectUnlockService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const project_security_constants_1 = require("./project-security.constants");
let ProjectUnlockService = class ProjectUnlockService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActiveUnlockSession(projectId, userId, now = new Date()) {
        return this.prisma.projectUnlockSession.findFirst({
            where: { projectId, userId, expiresAt: { gt: now } },
            select: { id: true, projectId: true, userId: true, expiresAt: true, createdAt: true },
        });
    }
    async hasActiveUnlock(projectId, userId, now = new Date()) {
        const session = await this.getActiveUnlockSession(projectId, userId, now);
        return Boolean(session);
    }
    async activeUnlockedProjectIds(projectIds, userId, now = new Date()) {
        if (projectIds.length === 0)
            return new Set();
        const sessions = await this.prisma.projectUnlockSession.findMany({
            where: {
                userId,
                projectId: { in: projectIds },
                expiresAt: { gt: now },
            },
            select: { projectId: true },
        });
        return new Set(sessions.map((session) => session.projectId));
    }
    async activeUnlockedWorkspaceProjectIds(workspaceId, userId, now = new Date()) {
        const sessions = await this.prisma.projectUnlockSession.findMany({
            where: {
                userId,
                expiresAt: { gt: now },
                project: { workspaceId, deletedAt: null },
            },
            select: { projectId: true },
        });
        return new Set(sessions.map((session) => session.projectId));
    }
    async createUnlockSession(projectId, userId, now = new Date()) {
        const expiresAt = new Date(now.getTime() + project_security_constants_1.PROJECT_UNLOCK_TTL_MS);
        return this.prisma.$transaction(async (tx) => {
            await tx.projectUnlockAttempt.deleteMany({ where: { projectId, userId } });
            return tx.projectUnlockSession.upsert({
                where: { projectId_userId: { projectId, userId } },
                create: { projectId, userId, expiresAt },
                update: { expiresAt, createdAt: now },
                select: { id: true, projectId: true, userId: true, expiresAt: true, createdAt: true },
            });
        });
    }
    async invalidateUnlockSessions(projectId) {
        const result = await this.prisma.projectUnlockSession.deleteMany({
            where: { projectId },
        });
        return result.count;
    }
    async pruneExpiredUnlockSessions(now = new Date()) {
        const result = await this.prisma.projectUnlockSession.deleteMany({
            where: { expiresAt: { lte: now } },
        });
        return result.count;
    }
    async assertNotLockedOut(projectId, userId, now = new Date()) {
        const attempt = await this.prisma.projectUnlockAttempt.findUnique({
            where: { projectId_userId: { projectId, userId } },
            select: { lockedUntil: true },
        });
        if (attempt?.lockedUntil && attempt.lockedUntil > now) {
            throw (0, project_security_constants_1.tooManyAttemptsException)();
        }
    }
    async recordFailedAttempt(projectId, userId, now = new Date()) {
        const existing = await this.prisma.projectUnlockAttempt.findUnique({
            where: { projectId_userId: { projectId, userId } },
            select: { failedCount: true, lockedUntil: true, lastFailAt: true },
        });
        const previousFailedCount = (existing?.lockedUntil && existing.lockedUntil <= now) ||
            (existing?.lastFailAt &&
                now.getTime() - existing.lastFailAt.getTime() >
                    project_security_constants_1.PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS)
            ? 0
            : existing?.failedCount ?? 0;
        const failedCount = previousFailedCount + 1;
        const lockedUntil = failedCount >= project_security_constants_1.PROJECT_UNLOCK_MAX_FAILED_ATTEMPTS
            ? new Date(now.getTime() + project_security_constants_1.PROJECT_UNLOCK_LOCKOUT_MS)
            : null;
        return this.prisma.projectUnlockAttempt.upsert({
            where: { projectId_userId: { projectId, userId } },
            create: {
                projectId,
                userId,
                failedCount,
                lockedUntil,
                lastFailAt: now,
            },
            update: {
                failedCount,
                lockedUntil,
                lastFailAt: now,
            },
            select: {
                id: true,
                projectId: true,
                userId: true,
                failedCount: true,
                lockedUntil: true,
                lastFailAt: true,
            },
        });
    }
    async clearFailedAttempts(projectId, userId) {
        await this.prisma.projectUnlockAttempt.deleteMany({
            where: { projectId, userId },
        });
    }
    async pruneExpiredFailedAttempts(now = new Date()) {
        const staleAttemptCutoff = new Date(now.getTime() - project_security_constants_1.PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS);
        const result = await this.prisma.projectUnlockAttempt.deleteMany({
            where: {
                OR: [
                    { lockedUntil: { lte: now } },
                    {
                        lockedUntil: null,
                        lastFailAt: { lte: staleAttemptCutoff },
                    },
                ],
            },
        });
        return result.count;
    }
};
exports.ProjectUnlockService = ProjectUnlockService;
exports.ProjectUnlockService = ProjectUnlockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], ProjectUnlockService);
//# sourceMappingURL=project-unlock.service.js.map