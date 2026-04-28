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
exports.DocsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const doc_permissions_constants_1 = require("./doc-permissions.constants");
const doc_permissions_service_1 = require("./doc-permissions.service");
const doc_content_1 = require("./doc-content");
let DocsService = class DocsService {
    prisma;
    permissions;
    constructor(prisma, permissions) {
        this.prisma = prisma;
        this.permissions = permissions;
    }
    async create(userId, dto) {
        await this.assertWorkspaceMember(userId, dto.workspaceId);
        await this.assertScopeIsValid(dto);
        const normalized = dto.contentJson
            ? (0, doc_content_1.normalizeDocContent)(dto.contentJson)
            : (0, doc_content_1.defaultDocContent)();
        return this.prisma.doc.create({
            data: {
                workspaceId: dto.workspaceId,
                projectId: dto.scope === 'PROJECT' ? dto.projectId : null,
                ownerId: userId,
                scope: dto.scope,
                title: this.normalizeTitle(dto.title),
                contentJson: normalized.contentJson,
                plaintext: normalized.plaintext,
                version: 1,
            },
            select: doc_permissions_constants_1.DOC_SELECT,
        });
    }
    async findAll(userId, query) {
        await this.assertWorkspaceMember(userId, query.workspaceId);
        const docs = await this.prisma.doc.findMany({
            where: {
                workspaceId: query.workspaceId,
                projectId: query.projectId,
                scope: query.scope,
                deletedAt: null,
            },
            select: doc_permissions_constants_1.DOC_SELECT,
            orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
        });
        return this.filterViewable(userId, docs);
    }
    async findOne(userId, docId) {
        const doc = await this.findDocOrThrow(docId);
        await this.permissions.assertCanView(userId, doc);
        return doc;
    }
    async update(userId, docId, dto) {
        const doc = await this.findDocOrThrow(docId);
        await this.permissions.assertCanEdit(userId, doc);
        const data = {};
        if (dto.title !== undefined) {
            data.title = this.normalizeTitle(dto.title);
        }
        if (dto.contentJson !== undefined) {
            const normalized = (0, doc_content_1.normalizeDocContent)(dto.contentJson);
            data.contentJson = normalized.contentJson;
            data.plaintext = normalized.plaintext;
            data.version = { increment: 1 };
        }
        if (Object.keys(data).length === 0)
            return doc;
        return this.prisma.doc.update({
            where: { id: docId },
            data,
            select: doc_permissions_constants_1.DOC_SELECT,
        });
    }
    async remove(userId, docId) {
        const doc = await this.findDocOrThrow(docId);
        await this.permissions.assertCanOwn(userId, doc);
        await this.prisma.doc.update({
            where: { id: docId },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    }
    async findDocOrThrow(docId) {
        const doc = await this.prisma.doc.findFirst({
            where: { id: docId, deletedAt: null },
            select: doc_permissions_constants_1.DOC_SELECT,
        });
        if (!doc)
            throw new common_1.NotFoundException(doc_permissions_constants_1.DOC_NOT_FOUND);
        return doc;
    }
    async assertWorkspaceMember(userId, workspaceId) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: {
                userId,
                workspaceId,
                deletedAt: null,
                workspace: { deletedAt: null },
            },
            select: { id: true },
        });
        if (!member)
            throw new common_1.ForbiddenException(doc_permissions_constants_1.DOC_FORBIDDEN);
    }
    async assertScopeIsValid(dto) {
        if (dto.scope === 'PROJECT') {
            if (!dto.projectId) {
                throw new common_1.BadRequestException('Project documents require projectId');
            }
            const project = await this.prisma.project.findFirst({
                where: {
                    id: dto.projectId,
                    workspaceId: dto.workspaceId,
                    deletedAt: null,
                    isArchived: false,
                },
                select: { id: true },
            });
            if (!project)
                throw new common_1.BadRequestException('Project not found in workspace');
            return;
        }
        if (dto.projectId) {
            throw new common_1.BadRequestException('projectId is only allowed for project documents');
        }
    }
    async filterViewable(userId, docs) {
        const viewable = [];
        for (const doc of docs) {
            const role = await this.permissions.resolveEffectiveRole(userId, doc);
            if (role)
                viewable.push(doc);
        }
        return viewable;
    }
    normalizeTitle(title) {
        const normalized = title.trim();
        if (!normalized)
            throw new common_1.BadRequestException(doc_permissions_constants_1.DOC_TITLE_REQUIRED);
        if (normalized.length > doc_permissions_constants_1.DOC_TITLE_MAX_LENGTH) {
            throw new common_1.BadRequestException(doc_permissions_constants_1.DOC_TITLE_TOO_LONG);
        }
        return normalized;
    }
};
exports.DocsService = DocsService;
exports.DocsService = DocsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        doc_permissions_service_1.DocPermissionsService])
], DocsService);
//# sourceMappingURL=docs.service.js.map