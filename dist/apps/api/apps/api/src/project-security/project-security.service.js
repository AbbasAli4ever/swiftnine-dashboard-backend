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
exports.ProjectSecurityService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const project_security_constants_1 = require("./project-security.constants");
const project_unlock_service_1 = require("./project-unlock.service");
let ProjectSecurityService = class ProjectSecurityService {
    prisma;
    unlocks;
    constructor(prisma, unlocks) {
        this.prisma = prisma;
        this.unlocks = unlocks;
    }
    async findProjectOrThrow(workspaceId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: project_security_constants_1.PROJECT_SECURITY_PROJECT_SELECT,
        });
        if (!project)
            throw (0, project_security_constants_1.projectNotFoundException)();
        return project;
    }
    isProjectLocked(project) {
        return Boolean(project.passwordHash);
    }
    canManagePassword(project, actorUserId, actorRole) {
        return actorRole === 'OWNER' || project.createdBy === actorUserId;
    }
    async assertPasswordManager(workspaceId, projectId, actorUserId, actorRole) {
        const project = await this.findProjectOrThrow(workspaceId, projectId);
        if (!this.canManagePassword(project, actorUserId, actorRole)) {
            throw (0, project_security_constants_1.projectPasswordManagerOnlyException)();
        }
        return project;
    }
    async getLockStatus(workspaceId, projectId, userId, now = new Date()) {
        const project = await this.findProjectOrThrow(workspaceId, projectId);
        const isLocked = this.isProjectLocked(project);
        const session = isLocked
            ? await this.unlocks.getActiveUnlockSession(project.id, userId, now)
            : null;
        return {
            projectId: project.id,
            isLocked,
            isUnlocked: !isLocked || Boolean(session),
            unlockedUntil: session?.expiresAt ?? null,
            passwordUpdatedAt: project.passwordUpdatedAt,
        };
    }
    async assertUnlocked(workspaceId, projectId, userId, now = new Date()) {
        const project = await this.findProjectOrThrow(workspaceId, projectId);
        if (!this.isProjectLocked(project))
            return project;
        const isUnlocked = await this.unlocks.hasActiveUnlock(project.id, userId, now);
        if (!isUnlocked)
            throw (0, project_security_constants_1.projectLockedException)();
        return project;
    }
    async activeUnlockedProjectIds(projectIds, userId, now = new Date()) {
        return this.unlocks.activeUnlockedProjectIds(projectIds, userId, now);
    }
    async activeUnlockedWorkspaceProjectIds(workspaceId, userId, now = new Date()) {
        return this.unlocks.activeUnlockedWorkspaceProjectIds(workspaceId, userId, now);
    }
};
exports.ProjectSecurityService = ProjectSecurityService;
exports.ProjectSecurityService = ProjectSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        project_unlock_service_1.ProjectUnlockService])
], ProjectSecurityService);
//# sourceMappingURL=project-security.service.js.map