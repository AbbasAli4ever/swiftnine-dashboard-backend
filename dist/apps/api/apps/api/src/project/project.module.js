"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const project_controller_1 = require("./project.controller");
const project_password_controller_1 = require("./project-password.controller");
const project_service_1 = require("./project.service");
const workspace_module_1 = require("../workspace/workspace.module");
const roles_module_1 = require("../roles/roles.module");
const favorites_module_1 = require("../favorites/favorites.module");
const project_security_module_1 = require("../project-security/project-security.module");
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [workspace_module_1.WorkspaceModule, roles_module_1.RolesModule, favorites_module_1.FavoritesModule, project_security_module_1.ProjectSecurityModule],
        controllers: [project_controller_1.ProjectController, project_password_controller_1.ProjectPasswordController],
        providers: [project_service_1.ProjectService],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map