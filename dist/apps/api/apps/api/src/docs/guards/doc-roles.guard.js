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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRolesGuard = exports.RequireDocRole = exports.DOC_ROLE_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const database_1 = require("../../../../../libs/database/src");
const doc_permissions_service_1 = require("../doc-permissions.service");
const doc_permissions_constants_1 = require("../doc-permissions.constants");
exports.DOC_ROLE_KEY = 'docRole';
const RequireDocRole = (role) => (0, common_1.SetMetadata)(exports.DOC_ROLE_KEY, role);
exports.RequireDocRole = RequireDocRole;
let DocRolesGuard = class DocRolesGuard {
    reflector;
    prisma;
    permissions;
    constructor(reflector, prisma, permissions) {
        this.reflector = reflector;
        this.prisma = prisma;
        this.permissions = permissions;
    }
    async canActivate(context) {
        const requiredRole = this.reflector.get(exports.DOC_ROLE_KEY, context.getHandler());
        if (!requiredRole)
            return true;
        const req = context.switchToHttp().getRequest();
        const userId = req.user?.id;
        const docId = req.params?.docId ?? req.params?.id;
        if (!userId || !docId)
            throw new common_1.ForbiddenException(doc_permissions_constants_1.DOC_FORBIDDEN);
        const doc = await this.prisma.doc.findFirst({
            where: { id: docId, deletedAt: null },
            select: { id: true, scope: true, workspaceId: true, projectId: true, ownerId: true },
        });
        if (!doc)
            throw new common_1.NotFoundException(doc_permissions_constants_1.DOC_NOT_FOUND);
        const effective = await this.permissions.resolveEffectiveRole(userId, doc);
        if (!effective || doc_permissions_constants_1.DOC_ROLE_RANK[effective] < doc_permissions_constants_1.DOC_ROLE_RANK[requiredRole]) {
            throw new common_1.ForbiddenException(doc_permissions_constants_1.DOC_FORBIDDEN);
        }
        return true;
    }
};
exports.DocRolesGuard = DocRolesGuard;
exports.DocRolesGuard = DocRolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, database_1.PrismaService,
        doc_permissions_service_1.DocPermissionsService])
], DocRolesGuard);
//# sourceMappingURL=doc-roles.guard.js.map