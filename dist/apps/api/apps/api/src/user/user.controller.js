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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_service_1 = require("./user.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const change_password_response_dto_1 = require("./dto/change-password-response.dto");
const create_profile_dto_1 = require("./dto/create-profile.dto");
const set_status_dto_1 = require("./dto/set-status.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const user_profile_response_dto_1 = require("./dto/user-profile-response.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async createProfile(req, dto) {
        return this.userService.createProfile(req.user.id, dto);
    }
    async getProfile(req) {
        return this.userService.getProfile(req.user.id);
    }
    async getById(id) {
        return this.userService.getProfile(id);
    }
    async updateProfile(req, dto) {
        return this.userService.updateProfile(req.user.id, dto);
    }
    async updateStatus(req, dto) {
        return this.userService.updateStatus(req.user.id, dto.status);
    }
    async deleteProfile(req) {
        await this.userService.deleteProfile(req.user.id);
    }
    async changePassword(req, dto) {
        return this.userService.changePassword(req.user.id, dto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or initialize current user profile' }),
    (0, swagger_1.ApiBody)({
        type: create_profile_dto_1.CreateProfileDto,
        examples: {
            default: {
                summary: 'Create profile request',
                value: {
                    designation: 'Senior Backend Engineer',
                    profilePicture: 'initials:SA',
                    status: 'ONLINE',
                    bio: 'Building secure and scalable APIs.',
                    timezone: 'Asia/Karachi',
                    showLocalTime: true,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Profile created successfully',
        type: user_profile_response_dto_1.UserProfileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_profile_dto_1.CreateProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile returned successfully',
        type: user_profile_response_dto_1.UserProfileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile by id' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User UUID',
        example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile returned successfully',
        type: user_profile_response_dto_1.UserProfileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user profile' }),
    (0, swagger_1.ApiBody)({
        type: update_profile_dto_1.UpdateProfileDto,
        examples: {
            default: {
                summary: 'Update profile request',
                value: {
                    fullName: 'Shoaib Ahmed',
                    designation: 'Lead Backend Engineer',
                    profilePicture: 'https://cdn.example.com/avatar/shoaib.png',
                    status: 'OFFLINE',
                    bio: 'I like to work on distributed systems.',
                    timezone: 'Europe/London',
                    showLocalTime: true,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully',
        type: user_profile_response_dto_1.UserProfileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user online/offline status' }),
    (0, swagger_1.ApiBody)({
        type: set_status_dto_1.SetStatusDto,
        examples: {
            online: {
                summary: 'Set status to online',
                value: {
                    status: 'ONLINE',
                },
            },
            offline: {
                summary: 'Set status to offline',
                value: {
                    status: 'OFFLINE',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status updated successfully',
        type: user_profile_response_dto_1.UserProfileResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, set_status_dto_1.SetStatusDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)('profile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Profile deleted successfully (no content)',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteProfile", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change current user password' }),
    (0, swagger_1.ApiBody)({
        type: change_password_dto_1.ChangePasswordDto,
        examples: {
            default: {
                summary: 'Change password request',
                value: {
                    currentPassword: 'OldPass123!',
                    newPassword: 'NewPass456!',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password changed successfully',
        type: change_password_response_dto_1.ChangePasswordResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Current password is incorrect' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    })),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map