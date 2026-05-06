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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../../libs/common/src");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../../workspace/workspace.guard");
const decide_join_request_dto_1 = require("./dto/decide-join-request.dto");
const join_requests_service_1 = require("./join-requests.service");
let JoinRequestsController = class JoinRequestsController {
    joinRequestsService;
    constructor(joinRequestsService) {
        this.joinRequestsService = joinRequestsService;
    }
    async createRequest(req, channelId) {
        const request = await this.joinRequestsService.createRequest(req.workspaceContext.workspaceId, channelId, req.user.id);
        return (0, common_2.ok)(request, 'Join request created');
    }
    async listRequests(req, channelId, status) {
        const requests = await this.joinRequestsService.listRequests(req.workspaceContext.workspaceId, channelId, req.user.id, status);
        return (0, common_2.ok)(requests);
    }
    async getMyRequestStatus(req, channelId) {
        const request = await this.joinRequestsService.getMyRequestStatus(req.workspaceContext.workspaceId, channelId, req.user.id);
        return (0, common_2.ok)(request);
    }
    async decideRequest(req, channelId, requestId, dto) {
        const request = await this.joinRequestsService.decideRequest(req.workspaceContext.workspaceId, channelId, requestId, req.user.id, dto.decision);
        return (0, common_2.ok)(request, `Join request ${dto.decision}d`);
    }
};
exports.JoinRequestsController = JoinRequestsController;
__decorate([
    (0, common_1.Post)(':id/join-requests'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Request to join a public channel' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Channel id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Join request created' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JoinRequestsController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)(':id/join-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'List channel join requests (channel admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Channel id' }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Join requests returned' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], JoinRequestsController.prototype, "listRequests", null);
__decorate([
    (0, common_1.Get)(':id/join-requests/me'),
    (0, swagger_1.ApiOperation)({
        summary: "Get the caller's latest join request status for a channel",
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Channel id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Join request status returned' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JoinRequestsController.prototype, "getMyRequestStatus", null);
__decorate([
    (0, common_1.Patch)(':id/join-requests/:reqId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve or reject a channel join request (channel admin only)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Channel id' }),
    (0, swagger_1.ApiParam)({ name: 'reqId', description: 'Join request id' }),
    (0, swagger_1.ApiBody)({ type: decide_join_request_dto_1.DecideJoinRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Join request updated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('reqId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, decide_join_request_dto_1.DecideJoinRequestDto]),
    __metadata("design:returntype", Promise)
], JoinRequestsController.prototype, "decideRequest", null);
exports.JoinRequestsController = JoinRequestsController = __decorate([
    (0, swagger_1.ApiTags)('channels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('channels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({
        name: 'x-workspace-id',
        required: true,
        description: 'Active workspace ID',
    }),
    __metadata("design:paramtypes", [join_requests_service_1.JoinRequestsService])
], JoinRequestsController);
//# sourceMappingURL=join-requests.controller.js.map