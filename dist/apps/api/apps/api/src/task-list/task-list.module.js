"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskListModule = void 0;
const common_1 = require("@nestjs/common");
const task_list_controller_1 = require("./task-list.controller");
const task_list_service_1 = require("./task-list.service");
const workspace_module_1 = require("../workspace/workspace.module");
const project_security_module_1 = require("../project-security/project-security.module");
let TaskListModule = class TaskListModule {
};
exports.TaskListModule = TaskListModule;
exports.TaskListModule = TaskListModule = __decorate([
    (0, common_1.Module)({
        imports: [workspace_module_1.WorkspaceModule, project_security_module_1.ProjectSecurityModule],
        controllers: [task_list_controller_1.TaskListController],
        providers: [task_list_service_1.TaskListService],
    })
], TaskListModule);
//# sourceMappingURL=task-list.module.js.map