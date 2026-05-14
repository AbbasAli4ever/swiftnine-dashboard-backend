"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const attachments_module_1 = require("../attachments/attachments.module");
const auth_module_1 = require("../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
const presence_module_1 = require("../presence/presence.module");
const realtime_metrics_module_1 = require("../realtime/realtime-metrics.module");
const project_security_module_1 = require("../project-security/project-security.module");
const chat_controller_1 = require("./chat.controller");
const chat_fanout_service_1 = require("./chat-fanout.service");
const chat_gateway_1 = require("./chat.gateway");
const chat_rate_limit_service_1 = require("./chat-rate-limit.service");
const chat_service_1 = require("./chat.service");
const chat_system_service_1 = require("./chat-system.service");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            notifications_module_1.NotificationsModule,
            attachments_module_1.AttachmentsModule,
            presence_module_1.PresenceModule,
            realtime_metrics_module_1.RealtimeMetricsModule,
            project_security_module_1.ProjectSecurityModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.getOrThrow('JWT_ACCESS_SECRET'),
                }),
            }),
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_gateway_1.ChatGateway,
            chat_rate_limit_service_1.ChatRateLimitService,
            chat_system_service_1.ChatSystemService,
            chat_fanout_service_1.ChatFanoutService,
            chat_service_1.ChatService,
        ],
        exports: [chat_system_service_1.ChatSystemService, chat_service_1.ChatService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map