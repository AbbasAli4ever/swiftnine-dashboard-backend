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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const sse_service_1 = require("./sse.service");
const database_1 = require("../../../../libs/database/src");
let NotificationsController = class NotificationsController {
    sse;
    prisma;
    constructor(sse, prisma) {
        this.sse = sse;
        this.prisma = prisma;
    }
    async stream(req, memberId, res) {
        let member = await this.prisma.workspaceMember.findFirst({
            where: { id: memberId, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
            select: { id: true, userId: true },
        });
        if (!member) {
            member = await this.prisma.workspaceMember.findFirst({
                where: { userId: memberId, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
                select: { id: true, userId: true },
            });
        }
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.userId !== req.user.id)
            throw new common_1.ForbiddenException('Cannot open notification stream for another member');
        this.sse.registerClient(member.id, res);
        const notifs = await this.prisma.notification.findMany({
            where: { userId: member.userId },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
        this.sse.sendToClient(res, 'notifications:init', notifs);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('members/:memberId/stream'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Open SSE stream for workspace member notifications' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Workspace member id or user id' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "stream", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [sse_service_1.NotificationsSseService, database_1.PrismaService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map