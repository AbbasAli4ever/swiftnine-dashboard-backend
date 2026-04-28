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
exports.DocPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const doc_permissions_constants_1 = require("./doc-permissions.constants");
let DocPermissionsService = class DocPermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveEffectiveRole(userId, doc) {
        if (doc.ownerId === userId)
            return 'OWNER';
        const override = await this.getOverrideRole(userId, doc.id);
        if (doc.scope === 'PERSONAL')
            return override;
        const base = await this.getInheritedRole(userId, doc);
        if (!base)
            return null;
        const inheritedRank = base ? doc_permissions_constants_1.DOC_ROLE_RANK[base] : 0;
        const overrideRank = override ? doc_permissions_constants_1.DOC_ROLE_RANK[override] : 0;
        return inheritedRank >= overrideRank ? base : override;
    }
    async assertCanView(userId, doc) {
        return this.assertAtLeast(userId, doc, 'VIEWER');
    }
    async assertCanComment(userId, doc) {
        return this.assertAtLeast(userId, doc, 'COMMENTER');
    }
    async assertCanEdit(userId, doc) {
        return this.assertAtLeast(userId, doc, 'EDITOR');
    }
    async assertCanOwn(userId, doc) {
        const role = await this.resolveEffectiveRole(userId, doc);
        if (role !== 'OWNER')
            throw new common_1.ForbiddenException(doc_permissions_constants_1.DOC_FORBIDDEN);
        return role;
    }
    async getInheritedRole(userId, doc) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId: doc.workspaceId, userId, deletedAt: null },
            select: { role: true },
        });
        if (!member)
            return null;
        return doc_permissions_constants_1.WORKSPACE_ROLE_TO_DOC_ROLE[member.role] ?? null;
    }
    async getOverrideRole(userId, docId) {
        const override = await this.prisma.docPermission.findUnique({
            where: { docId_userId: { docId, userId } },
            select: { role: true },
        });
        return override?.role ?? null;
    }
    async assertAtLeast(userId, doc, requiredRole) {
        const role = await this.resolveEffectiveRole(userId, doc);
        if (!role || doc_permissions_constants_1.DOC_ROLE_RANK[role] < doc_permissions_constants_1.DOC_ROLE_RANK[requiredRole]) {
            throw new common_1.ForbiddenException(doc_permissions_constants_1.DOC_FORBIDDEN);
        }
        return role;
    }
};
exports.DocPermissionsService = DocPermissionsService;
exports.DocPermissionsService = DocPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], DocPermissionsService);
//# sourceMappingURL=doc-permissions.service.js.map