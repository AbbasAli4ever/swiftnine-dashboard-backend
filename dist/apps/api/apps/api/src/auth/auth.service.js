"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_1 = require("../../../../libs/database/src");
const bcrypt = __importStar(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
const auth_constants_1 = require("./auth.constants");
const PASSWORD_SALT_ROUNDS = 10;
const INVALID_PASSWORD_SENTINEL_HASH = '$2b$10$Cpe5hcMUx8Lu80OFuFzGs.zvfGbrX44sec3nfV9UJobelf8reAm2q';
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                fullName: dto.fullName.trim(),
                email: this.normalizeEmail(dto.email),
                passwordHash,
            },
            select: auth_constants_1.AUTH_USER_SELECT,
        });
        return this.issueTokens(user);
    }
    async validateUser(email, password) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.prisma.user.findFirst({
            where: {
                email: normalizedEmail,
                deletedAt: null,
            },
            select: {
                ...auth_constants_1.AUTH_USER_SELECT,
                passwordHash: true,
            },
        });
        const passwordHash = user?.passwordHash ?? INVALID_PASSWORD_SENTINEL_HASH;
        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        if (!user?.passwordHash || !isPasswordValid) {
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        const { passwordHash: _passwordHash, ...authUser } = user;
        return authUser;
    }
    async login(user) {
        return this.issueTokens(user);
    }
    async issueTokens(user) {
        const accessToken = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
        });
        const rawRefreshToken = (0, node_crypto_1.randomUUID)();
        const tokenHash = await bcrypt.hash(rawRefreshToken, 10);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(Date.now() + auth_constants_1.REFRESH_TOKEN_TTL_MS),
            },
        });
        return { user, accessToken, refreshToken: rawRefreshToken };
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map