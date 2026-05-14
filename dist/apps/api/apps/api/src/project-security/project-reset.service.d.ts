import { PrismaService } from "../../../../libs/database/src";
export declare class ProjectResetService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createResetToken(projectId: string, now?: Date): Promise<{
        token: `${string}-${string}-${string}-${string}-${string}`;
        tokenHash: string;
        expiresAt: Date;
    }>;
    assertResetRequestAllowed(projectId: string, now?: Date): Promise<void>;
    findValidResetToken(rawToken: string, now?: Date): Promise<{
        id: string;
        projectId: string;
    }>;
    consumeResetToken(rawToken: string, now?: Date): Promise<{
        id: string;
        projectId: string;
    }>;
    hashToken(rawToken: string): string;
    pruneExpiredResetTokens(now?: Date): Promise<number>;
}
