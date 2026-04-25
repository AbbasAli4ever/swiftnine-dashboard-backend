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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
let ChannelsService = class ChannelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, userId, dto) {
        if (dto.projectId) {
            const project = await this.prisma.project.findFirst({
                where: { id: dto.projectId, workspaceId, deletedAt: null },
                select: { id: true },
            });
            if (!project)
                throw new common_1.NotFoundException('Project not found in workspace');
        }
        return this.prisma.$transaction(async (tx) => {
            const channel = await tx.channel.create({
                data: {
                    workspaceId,
                    projectId: dto.projectId ?? null,
                    name: dto.name.trim(),
                    description: dto.description?.trim() ?? null,
                    privacy: dto.privacy ?? 'PUBLIC',
                    createdBy: userId,
                },
            });
            await tx.channelMember.create({ data: { channelId: channel.id, userId, role: 'OWNER' } });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'channel',
                    entityId: channel.id,
                    action: 'created',
                    metadata: { channelName: channel.name },
                    performedBy: userId,
                },
            });
            return tx.channel.findFirst({
                where: { id: channel.id },
                include: { members: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } }, project: true },
            });
        });
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map