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
exports.DocsService = exports.DocSaveConflictException = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const doc_permissions_constants_1 = require("./doc-permissions.constants");
const doc_permissions_service_1 = require("./doc-permissions.service");
const doc_content_1 = require("./doc-content");
const doc_blocks_util_1 = require("./doc-blocks.util");
class DocSaveConflictException extends common_1.ConflictException {
    conflictBlockIds;
    reason;
    constructor(conflictBlockIds, reason) {
        super({ conflictBlockIds, reason });
        this.conflictBlockIds = conflictBlockIds;
        this.reason = reason;
    }
}
exports.DocSaveConflictException = DocSaveConflictException;
let DocsService = class DocsService {
    prisma;
    permissions;
    autosaveTimestamps = new Map();
    contentSnapshots = new Map();
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
    async assertCanEditDoc(userId, docId) {
        const doc = await this.findDocOrThrow(docId);
        await this.permissions.assertCanEdit(userId, doc);
        return doc;
    }
    async autosave(userId, input, now = Date.now()) {
        const throttleKey = `${userId}:${input.docId}`;
        const lastSaveAt = this.autosaveTimestamps.get(throttleKey);
        if (lastSaveAt !== undefined && now - lastSaveAt < doc_permissions_constants_1.AUTOSAVE_MAX_RATE_MS) {
            throw new DocSaveConflictException([], 'Autosave throttled');
        }
        const doc = await this.findDocOrThrow(input.docId);
        await this.permissions.assertCanEdit(userId, doc);
        if (!Number.isInteger(input.baseVersion) || input.baseVersion < 0) {
            throw new common_1.BadRequestException('baseVersion must be a non-negative integer');
        }
        this.rememberSnapshot(doc.id, doc.version, doc.contentJson);
        const normalized = (0, doc_content_1.normalizeDocContent)(input.contentJson);
        const lockedBlockIds = new Set(input.lockedBlockIds);
        const currentBlocks = (0, doc_blocks_util_1.extractDocBlocks)(doc.contentJson);
        const incomingBlocks = (0, doc_blocks_util_1.extractDocBlocks)(normalized.contentJson);
        let contentToPersist = normalized.contentJson;
        let changedBlockIds = (0, doc_blocks_util_1.diffDocBlocks)(currentBlocks, incomingBlocks);
        let lockBaseBlocks = currentBlocks;
        if (input.baseVersion > doc.version) {
            throw new DocSaveConflictException([], 'Client base version is ahead of the server');
        }
        if (input.baseVersion < doc.version) {
            const baseContent = this.getSnapshot(doc.id, input.baseVersion);
            if (!baseContent) {
                throw new DocSaveConflictException([], 'Base version is no longer available');
            }
            const baseBlocks = (0, doc_blocks_util_1.extractDocBlocks)(baseContent);
            const serverChangedBlockIds = (0, doc_blocks_util_1.diffDocBlocks)(baseBlocks, currentBlocks);
            const clientChangedBlockIds = (0, doc_blocks_util_1.diffDocBlocks)(baseBlocks, incomingBlocks);
            const overlap = (0, doc_blocks_util_1.intersectBlockIds)(serverChangedBlockIds, clientChangedBlockIds);
            if (overlap.length > 0) {
                throw new DocSaveConflictException(overlap, 'Stale save overlaps with server changes');
            }
            contentToPersist = (0, doc_blocks_util_1.mergeDocBlocks)(normalized.contentJson, doc.contentJson, serverChangedBlockIds);
            changedBlockIds = clientChangedBlockIds;
            lockBaseBlocks = baseBlocks;
        }
        const modifiedExistingBlockIds = Array.from(changedBlockIds).filter((blockId) => lockBaseBlocks.has(blockId));
        const unlockedBlockIds = modifiedExistingBlockIds.filter((blockId) => !lockedBlockIds.has(blockId));
        if (unlockedBlockIds.length > 0) {
            throw new DocSaveConflictException(unlockedBlockIds, 'Modified blocks must be locked by the saving user');
        }
        const persistedContent = (0, doc_content_1.normalizeDocContent)(contentToPersist);
        const persistedBlocks = (0, doc_blocks_util_1.extractDocBlocks)(persistedContent.contentJson);
        const { doc: savedDoc, orphanedThreadCount } = await this.prisma.$transaction(async (tx) => {
            const orphaned = await tx.docCommentThread.updateMany({
                where: {
                    docId: doc.id,
                    isOrphan: false,
                    anchorBlockId: { not: null, notIn: Array.from(persistedBlocks.keys()) },
                },
                data: { isOrphan: true },
            });
            const saved = await tx.doc.update({
                where: { id: doc.id },
                data: {
                    contentJson: persistedContent.contentJson,
                    plaintext: persistedContent.plaintext,
                    version: { increment: 1 },
                },
                select: doc_permissions_constants_1.DOC_SELECT,
            });
            return { doc: saved, orphanedThreadCount: orphaned.count };
        });
        this.autosaveTimestamps.set(throttleKey, now);
        this.rememberSnapshot(savedDoc.id, savedDoc.version, savedDoc.contentJson);
        return {
            doc: savedDoc,
            changedBlockIds: Array.from(changedBlockIds),
            orphanedThreadCount,
        };
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
    rememberSnapshot(docId, version, contentJson) {
        this.contentSnapshots.set(this.snapshotKey(docId, version), contentJson);
    }
    getSnapshot(docId, version) {
        return this.contentSnapshots.get(this.snapshotKey(docId, version));
    }
    snapshotKey(docId, version) {
        return `${docId}:${version}`;
    }
};
exports.DocsService = DocsService;
exports.DocsService = DocsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        doc_permissions_service_1.DocPermissionsService])
], DocsService);
//# sourceMappingURL=docs.service.js.map