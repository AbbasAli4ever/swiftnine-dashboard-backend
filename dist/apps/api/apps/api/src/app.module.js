"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_1 = require("../../../libs/database/src");
const common_2 = require("../../../libs/common/src");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const workspace_module_1 = require("./workspace/workspace.module");
const project_module_1 = require("./project/project.module");
const status_module_1 = require("./status/status.module");
const task_list_module_1 = require("./task-list/task-list.module");
const tag_module_1 = require("./tag/tag.module");
const task_module_1 = require("./task/task.module");
const time_entry_module_1 = require("./time-entry/time-entry.module");
const attachments_module_1 = require("./attachments/attachments.module");
const activity_module_1 = require("./activity/activity.module");
const comments_module_1 = require("./comments/comments.module");
const notifications_module_1 = require("./notifications/notifications.module");
<<<<<<< HEAD
const dashboard_module_1 = require("./dashboard/dashboard.module");
=======
const channels_module_1 = require("./channels/channels.module");
>>>>>>> 8b80e2f (added stuff about channels and added update reaction api)
let AppModule = class AppModule {
    configure(consumer) {
        if (process.env['LOG_LEVEL'] === 'full') {
            consumer.apply(common_2.HttpLoggerMiddleware).forRoutes('*path');
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_1.DatabaseModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            workspace_module_1.WorkspaceModule,
            attachments_module_1.AttachmentsModule,
            project_module_1.ProjectModule,
            status_module_1.StatusModule,
            task_list_module_1.TaskListModule,
            tag_module_1.TagModule,
            task_module_1.TaskModule,
            time_entry_module_1.TimeEntryModule,
            activity_module_1.ActivityModule,
            comments_module_1.CommentsModule,
            channels_module_1.ChannelsModule,
            notifications_module_1.NotificationsModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map