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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const database_1 = require("../../../../libs/database/src");
const roles_decorator_1 = require("./roles.decorator");
let RolesGuard = class RolesGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles?.length)
            return true;
        const req = context.switchToHttp().getRequest();
        const existingRole = req.workspaceContext?.role;
        if (existingRole && requiredRoles.includes(existingRole))
            return true;
        const workspaceId = this.resolveWorkspaceId(req);
        if (!workspaceId) {
            throw new common_1.ForbiddenException('Workspace id is required for this action');
        }
        const member = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: req.user.id,
                deletedAt: null,
            },
            select: { role: true, workspaceId: true },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this workspace');
        }
        req.workspaceContext = { workspaceId: member.workspaceId, role: member.role };
        if (!requiredRoles.includes(member.role)) {
            throw new common_1.ForbiddenException('Only the workspace owner can perform this action');
        }
        return true;
    }
    resolveWorkspaceId(req) {
        if (req.workspaceContext?.workspaceId)
            return req.workspaceContext.workspaceId;
        const headerWorkspaceId = req.headers['x-workspace-id'];
        if (typeof headerWorkspaceId === 'string' && headerWorkspaceId.trim()) {
            return headerWorkspaceId.trim();
        }
        const bodyWorkspaceId = this.getStringField(req.body, 'workspaceId');
        if (bodyWorkspaceId)
            return bodyWorkspaceId;
        const paramWorkspaceId = this.getStringField(req.params, 'workspaceId');
        if (paramWorkspaceId)
            return paramWorkspaceId;
        const queryWorkspaceId = this.getStringField(req.query, 'workspaceId');
        if (queryWorkspaceId)
            return queryWorkspaceId;
        return null;
    }
    getStringField(source, key) {
        if (!source || typeof source !== 'object')
            return null;
        const value = source[key];
        return typeof value === 'string' && value.trim() ? value.trim() : null;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        database_1.PrismaService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map