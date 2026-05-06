import { PrismaService } from "../../../../libs/database/src";
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
export type ChatSystemEventPayload = {
    event: string;
    [key: string]: unknown;
};
export declare class ChatSystemService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    emit(channelId: string, payload: ChatSystemEventPayload, db?: PrismaService | Prisma.TransactionClient): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        channelId: string;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        contentJson: import("@prisma/client/runtime/client").JsonValue;
        plaintext: string;
        isEdited: boolean;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        replyToMessageId: string | null;
        pinnedById: string | null;
        senderId: string | null;
    }>;
}
