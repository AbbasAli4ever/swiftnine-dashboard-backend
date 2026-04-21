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
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const tag_constants_1 = require("./tag.constants");
let TagService = class TagService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, userId, dto) {
        const name = dto.name.trim();
        const exists = await this.prisma.tag.findFirst({
            where: { workspaceId, name, deletedAt: null },
            select: { id: true },
        });
        if (exists)
            throw new common_1.ConflictException(tag_constants_1.TAG_NAME_TAKEN);
        const tag = await this.prisma.tag.create({
            data: { workspaceId, name, color: dto.color },
            select: tag_constants_1.TAG_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'tag',
                entityId: tag.id,
                action: 'created',
                metadata: { tagName: tag.name },
                performedBy: userId,
            },
        });
        return tag;
    }
    async findAll(workspaceId) {
        return this.prisma.tag.findMany({
            where: { workspaceId, deletedAt: null },
            select: tag_constants_1.TAG_SELECT,
            orderBy: { name: 'asc' },
        });
    }
    async update(workspaceId, userId, tagId, dto) {
        const tag = await this.findTagOrThrow(workspaceId, tagId);
        const updateData = {};
        if (dto.name !== undefined) {
            const trimmed = dto.name.trim();
            if (trimmed !== tag.name) {
                const conflict = await this.prisma.tag.findFirst({
                    where: { workspaceId, name: trimmed, deletedAt: null, id: { not: tagId } },
                    select: { id: true },
                });
                if (conflict)
                    throw new common_1.ConflictException(tag_constants_1.TAG_NAME_TAKEN);
                updateData.name = trimmed;
            }
        }
        if (dto.color !== undefined)
            updateData.color = dto.color;
        if (Object.keys(updateData).length === 0)
            return tag;
        const updated = await this.prisma.tag.update({
            where: { id: tagId },
            data: updateData,
            select: tag_constants_1.TAG_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'tag',
                entityId: tagId,
                action: 'updated',
                metadata: {},
                performedBy: userId,
            },
        });
        return updated;
    }
    async remove(workspaceId, userId, tagId) {
        const tag = await this.findTagOrThrow(workspaceId, tagId);
        await this.prisma.$transaction(async (tx) => {
            await tx.tag.update({ where: { id: tagId }, data: { deletedAt: new Date() } });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'tag',
                    entityId: tagId,
                    action: 'deleted',
                    metadata: { tagName: tag.name },
                    performedBy: userId,
                },
            });
        });
    }
    async findTagOrThrow(workspaceId, tagId) {
        const tag = await this.prisma.tag.findFirst({
            where: { id: tagId, workspaceId, deletedAt: null },
            select: tag_constants_1.TAG_SELECT,
        });
        if (!tag)
            throw new common_1.NotFoundException(tag_constants_1.TAG_NOT_FOUND);
        return tag;
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], TagService);
//# sourceMappingURL=tag.service.js.map