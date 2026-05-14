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
exports.ProjectResetService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const node_crypto_1 = require("node:crypto");
const project_security_constants_1 = require("./project-security.constants");
let ProjectResetService = class ProjectResetService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createResetToken(projectId, now = new Date()) {
        await this.assertResetRequestAllowed(projectId, now);
        const token = (0, node_crypto_1.randomUUID)();
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(now.getTime() + project_security_constants_1.PROJECT_PASSWORD_RESET_TOKEN_TTL_MS);
        await this.prisma.$transaction([
            this.prisma.projectPasswordResetToken.updateMany({
                where: { projectId, usedAt: null },
                data: { usedAt: now },
            }),
            this.prisma.projectPasswordResetToken.create({
                data: { projectId, tokenHash, expiresAt },
                select: { id: true },
            }),
        ]);
        return { token, tokenHash, expiresAt };
    }
    async assertResetRequestAllowed(projectId, now = new Date()) {
        const recentCutoff = new Date(now.getTime() - project_security_constants_1.PROJECT_PASSWORD_RESET_REQUEST_COOLDOWN_MS);
        const recentToken = await this.prisma.projectPasswordResetToken.findFirst({
            where: {
                projectId,
                usedAt: null,
                createdAt: { gt: recentCutoff },
            },
            select: { id: true },
        });
        if (recentToken)
            throw (0, project_security_constants_1.resetRequestRateLimitedException)();
    }
    async findValidResetToken(rawToken, now = new Date()) {
        const tokenHash = this.hashToken(rawToken);
        const stored = await this.prisma.projectPasswordResetToken.findFirst({
            where: {
                tokenHash,
                usedAt: null,
                expiresAt: { gt: now },
                project: { deletedAt: null },
            },
            select: { id: true, projectId: true },
        });
        if (!stored)
            throw (0, project_security_constants_1.resetTokenInvalidException)();
        return stored;
    }
    async consumeResetToken(rawToken, now = new Date()) {
        const stored = await this.findValidResetToken(rawToken, now);
        await this.prisma.projectPasswordResetToken.update({
            where: { id: stored.id },
            data: { usedAt: now },
        });
        return stored;
    }
    hashToken(rawToken) {
        return (0, node_crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
    async pruneExpiredResetTokens(now = new Date()) {
        const usedTokenCutoff = new Date(now.getTime() - project_security_constants_1.PROJECT_PASSWORD_RESET_TOKEN_USED_RETENTION_MS);
        const result = await this.prisma.projectPasswordResetToken.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lte: now } },
                    { usedAt: { lte: usedTokenCutoff } },
                ],
            },
        });
        return result.count;
    }
};
exports.ProjectResetService = ProjectResetService;
exports.ProjectResetService = ProjectResetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], ProjectResetService);
//# sourceMappingURL=project-reset.service.js.map