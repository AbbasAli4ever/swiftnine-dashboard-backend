"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSecurityModule = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../libs/common/src");
const project_access_resolver_service_1 = require("./project-access-resolver.service");
const project_password_service_1 = require("./project-password.service");
const project_reset_service_1 = require("./project-reset.service");
const project_realtime_lock_service_1 = require("./project-realtime-lock.service");
const project_security_cleanup_service_1 = require("./project-security-cleanup.service");
const project_security_service_1 = require("./project-security.service");
const project_unlock_service_1 = require("./project-unlock.service");
const project_unlocked_guard_1 = require("./guards/project-unlocked.guard");
let ProjectSecurityModule = class ProjectSecurityModule {
};
exports.ProjectSecurityModule = ProjectSecurityModule;
exports.ProjectSecurityModule = ProjectSecurityModule = __decorate([
    (0, common_1.Module)({
        imports: [common_2.CommonModule],
        providers: [
            project_access_resolver_service_1.ProjectAccessResolverService,
            project_password_service_1.ProjectPasswordService,
            project_realtime_lock_service_1.ProjectRealtimeLockService,
            project_reset_service_1.ProjectResetService,
            project_security_cleanup_service_1.ProjectSecurityCleanupService,
            project_security_service_1.ProjectSecurityService,
            project_unlock_service_1.ProjectUnlockService,
            project_unlocked_guard_1.ProjectUnlockedGuard,
        ],
        exports: [
            project_access_resolver_service_1.ProjectAccessResolverService,
            project_password_service_1.ProjectPasswordService,
            project_realtime_lock_service_1.ProjectRealtimeLockService,
            project_reset_service_1.ProjectResetService,
            project_security_cleanup_service_1.ProjectSecurityCleanupService,
            project_security_service_1.ProjectSecurityService,
            project_unlock_service_1.ProjectUnlockService,
            project_unlocked_guard_1.ProjectUnlockedGuard,
        ],
    })
], ProjectSecurityModule);
//# sourceMappingURL=project-security.module.js.map