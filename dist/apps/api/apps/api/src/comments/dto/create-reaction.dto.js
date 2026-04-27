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
exports.CreateReactionDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
const CreateReactionSchema = zod_1.z.object({
    reactFace: zod_1.z.string().trim().min(1, 'reactFace is required').max(64),
});
class CreateReactionDto extends (0, nestjs_zod_1.createZodDto)(CreateReactionSchema) {
    reactFace = '';
}
exports.CreateReactionDto = CreateReactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Reaction identifier (emoji or name)', example: 'like' }),
    __metadata("design:type", String)
], CreateReactionDto.prototype, "reactFace", void 0);
//# sourceMappingURL=create-reaction.dto.js.map