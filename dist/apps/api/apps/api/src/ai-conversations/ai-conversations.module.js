"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiConversationsModule = void 0;
const common_1 = require("@nestjs/common");
const ai_conversations_controller_1 = require("./ai-conversations.controller");
const ai_conversations_service_1 = require("./ai-conversations.service");
let AiConversationsModule = class AiConversationsModule {
};
exports.AiConversationsModule = AiConversationsModule;
exports.AiConversationsModule = AiConversationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_conversations_controller_1.AiConversationsController],
        providers: [ai_conversations_service_1.AiConversationsService],
        exports: [ai_conversations_service_1.AiConversationsService],
    })
], AiConversationsModule);
//# sourceMappingURL=ai-conversations.module.js.map