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
exports.ProjectUnlockedGuard = void 0;
const common_1 = require("@nestjs/common");
const project_security_service_1 = require("../project-security.service");
let ProjectUnlockedGuard = class ProjectUnlockedGuard {
    security;
    constructor(security) {
        this.security = security;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const projectId = req.params.projectId?.trim();
        if (!projectId)
            return true;
        await this.security.assertUnlocked(req.workspaceContext.workspaceId, projectId, req.user.id);
        return true;
    }
};
exports.ProjectUnlockedGuard = ProjectUnlockedGuard;
exports.ProjectUnlockedGuard = ProjectUnlockedGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_security_service_1.ProjectSecurityService])
], ProjectUnlockedGuard);
//# sourceMappingURL=project-unlocked.guard.js.map