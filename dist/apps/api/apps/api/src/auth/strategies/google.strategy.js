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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_constants_1 = require("../auth.constants");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(config) {
        super({
            clientID: config.getOrThrow('GOOGLE_CLIENT_ID'),
            clientSecret: config.getOrThrow('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.getOrThrow('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }
    async validate(_accessToken, _refreshToken, profile) {
        const email = this.extractVerifiedEmail(profile);
        if (!email) {
            throw new common_1.UnauthorizedException(auth_constants_1.GOOGLE_EMAIL_REQUIRED_MESSAGE);
        }
        return {
            googleId: profile.id,
            email,
            fullName: this.extractFullName(profile),
            avatarUrl: this.extractAvatarUrl(profile),
        };
    }
    extractVerifiedEmail(profile) {
        const verifiedProfileEmail = profile.emails?.find((email) => email.verified);
        if (verifiedProfileEmail?.value) {
            return verifiedProfileEmail.value.trim().toLowerCase();
        }
        if (profile._json.email && profile._json.email_verified) {
            return profile._json.email.trim().toLowerCase();
        }
        return null;
    }
    extractFullName(profile) {
        const candidates = [
            profile.displayName,
            profile._json.name,
            [profile._json.given_name, profile._json.family_name]
                .filter((value) => Boolean(value?.trim()))
                .join(' '),
        ];
        const fullName = candidates.find((value) => Boolean(value?.trim()));
        return fullName?.trim() || null;
    }
    extractAvatarUrl(profile) {
        const avatarUrl = profile.photos?.[0]?.value ?? profile._json.picture ?? null;
        return avatarUrl?.trim() || null;
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map