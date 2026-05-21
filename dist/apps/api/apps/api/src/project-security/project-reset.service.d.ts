import { PrismaService } from "../../../../libs/database/src";
export declare class ProjectResetService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createResetOtp(projectId: string, now?: Date): Promise<{
        otp: string;
        otpHash: string;
        expiresAt: Date;
    }>;
    assertResetRequestAllowed(projectId: string, now?: Date): Promise<void>;
    findValidResetOtp(otp: string, now?: Date): Promise<{
        id: string;
        projectId: string;
    }>;
    consumeResetOtp(otp: string, now?: Date): Promise<{
        id: string;
        projectId: string;
    }>;
    generateOtp(): string;
    hashOtp(otp: string): string;
    pruneExpiredResetTokens(now?: Date): Promise<number>;
}
