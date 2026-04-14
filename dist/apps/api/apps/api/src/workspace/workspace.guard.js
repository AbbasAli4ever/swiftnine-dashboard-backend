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
exports.WorkspaceGuard = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const MISSING_WORKSPACE_HEADER = 'x-workspace-id header is required';
const NOT_A_MEMBER = 'You are not a member of this workspace';
let WorkspaceGuard = class WorkspaceGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const workspaceId = req.headers['x-workspace-id'];
        if (!workspaceId || typeof workspaceId !== 'string' || !workspaceId.trim()) {
            throw new common_1.ForbiddenException(MISSING_WORKSPACE_HEADER);
        }
        const member = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspaceId.trim(),
                userId: req.user.id,
                deletedAt: null,
            },
            select: { role: true, workspaceId: true },
        });
        if (!member) {
            throw new common_1.ForbiddenException(NOT_A_MEMBER);
        }
        req.workspaceContext = { workspaceId: member.workspaceId, role: member.role };
        return true;
    }
};
exports.WorkspaceGuard = WorkspaceGuard;
exports.WorkspaceGuard = WorkspaceGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], WorkspaceGuard);
//# sourceMappingURL=workspace.guard.js.map