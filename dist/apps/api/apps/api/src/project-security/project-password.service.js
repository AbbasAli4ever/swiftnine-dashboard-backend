"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectPasswordService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const common_2 = require("../../../../libs/common/src");
const bcrypt = __importStar(require("bcrypt"));
const project_security_constants_1 = require("./project-security.constants");
const project_security_service_1 = require("./project-security.service");
const project_reset_service_1 = require("./project-reset.service");
const project_realtime_lock_service_1 = require("./project-realtime-lock.service");
const project_unlock_service_1 = require("./project-unlock.service");
let ProjectPasswordService = class ProjectPasswordService {
    prisma;
    security;
    unlocks;
    resets;
    realtimeLocks;
    email;
    constructor(prisma, security, unlocks, resets, realtimeLocks, email) {
        this.prisma = prisma;
        this.security = security;
        this.unlocks = unlocks;
        this.resets = resets;
        this.realtimeLocks = realtimeLocks;
        this.email = email;
    }
    assertPasswordFormat(password) {
        if (!project_security_constants_1.PROJECT_PASSWORD_PATTERN.test(password)) {
            throw (0, project_security_constants_1.invalidPasswordFormatException)();
        }
    }
    async hashPassword(password) {
        return bcrypt.hash(password, project_security_constants_1.PROJECT_PASSWORD_SALT_ROUNDS);
    }
    async comparePassword(password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
    projectPasswordActivityInput(params) {
        return {
            workspaceId: params.workspaceId,
            entityType: 'project',
            entityId: params.projectId,
            action: params.action,
            performedBy: params.performedBy,
            fieldName: 'password',
            oldValue: params.oldValue,
            newValue: params.newValue,
            metadata: {
                projectName: params.projectName,
                securityEvent: true,
            },
        };
    }
    async setPassword(workspaceId, projectId, actorUserId, actorRole, password) {
        this.assertPasswordFormat(password);
        const project = await this.security.assertPasswordManager(workspaceId, projectId, actorUserId, actorRole);
        if (project.passwordHash)
            throw (0, project_security_constants_1.passwordAlreadySetException)();
        const passwordHash = await this.hashPassword(password);
        const passwordUpdatedAt = new Date();
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.project.update({
                where: { id: project.id },
                data: {
                    passwordHash,
                    passwordSetBy: actorUserId,
                    passwordUpdatedAt,
                },
                select: {
                    id: true,
                    workspaceId: true,
                    passwordUpdatedAt: true,
                },
            });
            await tx.activityLog.create({
                data: this.projectPasswordActivityInput({
                    workspaceId: project.workspaceId,
                    projectId: project.id,
                    projectName: project.name,
                    action: 'project_password_set',
                    performedBy: actorUserId,
                    oldValue: 'disabled',
                    newValue: 'enabled',
                }),
            });
            return updated;
        });
    }
    async changePassword(workspaceId, projectId, actorUserId, actorRole, currentPassword, newPassword) {
        this.assertPasswordFormat(newPassword);
        const project = await this.security.assertPasswordManager(workspaceId, projectId, actorUserId, actorRole);
        if (!project.passwordHash)
            throw (0, project_security_constants_1.projectPasswordNotSetException)();
        const isCurrentPasswordValid = await this.comparePassword(currentPassword, project.passwordHash);
        if (!isCurrentPasswordValid)
            throw (0, project_security_constants_1.invalidPasswordException)();
        const passwordHash = await this.hashPassword(newPassword);
        const passwordUpdatedAt = new Date();
        const updated = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.project.update({
                where: { id: project.id },
                data: {
                    passwordHash,
                    passwordSetBy: actorUserId,
                    passwordUpdatedAt,
                },
                select: {
                    id: true,
                    workspaceId: true,
                    passwordUpdatedAt: true,
                },
            });
            await tx.projectUnlockSession.deleteMany({ where: { projectId: project.id } });
            await tx.activityLog.create({
                data: this.projectPasswordActivityInput({
                    workspaceId: project.workspaceId,
                    projectId: project.id,
                    projectName: project.name,
                    action: 'project_password_changed',
                    performedBy: actorUserId,
                    oldValue: 'enabled',
                    newValue: 'enabled',
                }),
            });
            return updated;
        });
        this.realtimeLocks.emitLockChanged({
            projectId: project.id,
            reason: 'password_changed',
        });
        return updated;
    }
    async removePassword(workspaceId, projectId, actorUserId, actorRole) {
        const project = await this.security.assertPasswordManager(workspaceId, projectId, actorUserId, actorRole);
        if (!project.passwordHash)
            throw (0, project_security_constants_1.projectPasswordNotSetException)();
        await this.prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: project.id },
                data: {
                    passwordHash: null,
                    passwordSetBy: null,
                    passwordUpdatedAt: null,
                },
            });
            await tx.projectUnlockSession.deleteMany({ where: { projectId: project.id } });
            await tx.projectUnlockAttempt.deleteMany({ where: { projectId: project.id } });
            await tx.projectPasswordResetToken.deleteMany({ where: { projectId: project.id } });
            await tx.activityLog.create({
                data: this.projectPasswordActivityInput({
                    workspaceId: project.workspaceId,
                    projectId: project.id,
                    projectName: project.name,
                    action: 'project_password_removed',
                    performedBy: actorUserId,
                    oldValue: 'enabled',
                    newValue: 'disabled',
                }),
            });
        });
        this.realtimeLocks.emitLockChanged({
            projectId: project.id,
            reason: 'password_removed',
        });
    }
    async invalidateUnlockSessions(projectId) {
        return this.unlocks.invalidateUnlockSessions(projectId);
    }
    async unlockProject(workspaceId, projectId, userId, password, now = new Date()) {
        const project = await this.security.findProjectOrThrow(workspaceId, projectId);
        if (!project.passwordHash) {
            return {
                projectId: project.id,
                isLocked: false,
                unlockedUntil: null,
            };
        }
        await this.unlocks.assertNotLockedOut(project.id, userId, now);
        const isPasswordValid = await this.comparePassword(password, project.passwordHash);
        if (!isPasswordValid) {
            const attempt = await this.unlocks.recordFailedAttempt(project.id, userId, now);
            if (attempt.lockedUntil && attempt.lockedUntil > now) {
                throw (0, project_security_constants_1.tooManyAttemptsException)();
            }
            throw (0, project_security_constants_1.invalidPasswordException)();
        }
        const session = await this.unlocks.createUnlockSession(project.id, userId, now);
        return {
            projectId: project.id,
            isLocked: true,
            unlockedUntil: session.expiresAt,
        };
    }
    async requestPasswordReset(workspaceId, projectId, actorUserId, actorRole) {
        const project = await this.security.assertPasswordManager(workspaceId, projectId, actorUserId, actorRole);
        if (!project.passwordHash)
            throw (0, project_security_constants_1.projectPasswordNotSetException)();
        const projectOwner = await this.prisma.user.findFirst({
            where: { id: project.createdBy, deletedAt: null },
            select: { email: true, fullName: true },
        });
        if (!projectOwner)
            return;
        const { token, tokenHash } = await this.resets.createResetToken(project.id);
        const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/projects/${project.id}/password/reset?token=${token}`;
        try {
            await this.email.sendProjectPasswordResetEmail(projectOwner.email, projectOwner.fullName, project.name, resetUrl);
        }
        catch (error) {
            await this.prisma.projectPasswordResetToken.updateMany({
                where: { projectId: project.id, tokenHash, usedAt: null },
                data: { usedAt: new Date() },
            });
            throw error;
        }
        await this.prisma.activityLog.create({
            data: this.projectPasswordActivityInput({
                workspaceId: project.workspaceId,
                projectId: project.id,
                projectName: project.name,
                action: 'project_password_reset_requested',
                performedBy: actorUserId,
                oldValue: 'enabled',
                newValue: 'reset_requested',
            }),
        });
    }
    async resetPasswordWithToken(projectId, token, newPassword, actorUserId) {
        this.assertPasswordFormat(newPassword);
        const stored = await this.resets.findValidResetToken(token);
        if (stored.projectId !== projectId) {
            throw (0, project_security_constants_1.resetTokenInvalidException)();
        }
        const passwordHash = await this.hashPassword(newPassword);
        const passwordUpdatedAt = new Date();
        const result = await this.prisma.$transaction(async (tx) => {
            const updatedProject = await tx.project.update({
                where: { id: stored.projectId },
                data: {
                    passwordHash,
                    passwordUpdatedAt,
                },
                select: {
                    id: true,
                    workspaceId: true,
                    name: true,
                    createdBy: true,
                },
            });
            await tx.projectPasswordResetToken.update({
                where: { id: stored.id },
                data: { usedAt: passwordUpdatedAt },
            });
            await tx.projectUnlockSession.deleteMany({
                where: { projectId: stored.projectId },
            });
            await tx.projectUnlockAttempt.deleteMany({
                where: { projectId: stored.projectId },
            });
            await tx.activityLog.create({
                data: this.projectPasswordActivityInput({
                    workspaceId: updatedProject.workspaceId,
                    projectId: updatedProject.id,
                    projectName: updatedProject.name,
                    action: 'project_password_reset_completed',
                    performedBy: actorUserId ?? updatedProject.createdBy,
                    oldValue: 'reset_requested',
                    newValue: 'enabled',
                }),
            });
            return {
                projectId: stored.projectId,
                passwordUpdatedAt,
            };
        });
        this.realtimeLocks.emitLockChanged({
            projectId: stored.projectId,
            reason: 'password_reset',
        });
        return result;
    }
};
exports.ProjectPasswordService = ProjectPasswordService;
exports.ProjectPasswordService = ProjectPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        project_security_service_1.ProjectSecurityService,
        project_unlock_service_1.ProjectUnlockService,
        project_reset_service_1.ProjectResetService,
        project_realtime_lock_service_1.ProjectRealtimeLockService,
        common_2.EmailService])
], ProjectPasswordService);
//# sourceMappingURL=project-password.service.js.map