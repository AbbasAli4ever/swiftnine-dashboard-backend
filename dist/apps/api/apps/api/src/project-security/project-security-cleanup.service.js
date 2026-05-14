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
var ProjectSecurityCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSecurityCleanupService = void 0;
const common_1 = require("@nestjs/common");
const project_security_constants_1 = require("./project-security.constants");
const project_reset_service_1 = require("./project-reset.service");
const project_unlock_service_1 = require("./project-unlock.service");
let ProjectSecurityCleanupService = ProjectSecurityCleanupService_1 = class ProjectSecurityCleanupService {
    unlocks;
    resets;
    logger = new common_1.Logger(ProjectSecurityCleanupService_1.name);
    cleanupWatcher;
    constructor(unlocks, resets) {
        this.unlocks = unlocks;
        this.resets = resets;
        this.cleanupWatcher = setInterval(() => {
            this.cleanupExpiredRecords().catch((err) => this.logger.debug('Project security cleanup error', err));
        }, project_security_constants_1.PROJECT_SECURITY_CLEANUP_INTERVAL_MS);
    }
    onModuleDestroy() {
        if (this.cleanupWatcher)
            clearInterval(this.cleanupWatcher);
    }
    async cleanupExpiredRecords(now = new Date()) {
        const [unlockSessions, unlockAttempts, resetTokens] = await Promise.all([
            this.unlocks.pruneExpiredUnlockSessions(now),
            this.unlocks.pruneExpiredFailedAttempts(now),
            this.resets.pruneExpiredResetTokens(now),
        ]);
        if (unlockSessions || unlockAttempts || resetTokens) {
            this.logger.log(`Cleaned project security records: unlockSessions=${unlockSessions}, unlockAttempts=${unlockAttempts}, resetTokens=${resetTokens}`);
        }
        return { unlockSessions, unlockAttempts, resetTokens };
    }
};
exports.ProjectSecurityCleanupService = ProjectSecurityCleanupService;
exports.ProjectSecurityCleanupService = ProjectSecurityCleanupService = ProjectSecurityCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_unlock_service_1.ProjectUnlockService,
        project_reset_service_1.ProjectResetService])
], ProjectSecurityCleanupService);
//# sourceMappingURL=project-security-cleanup.service.js.map