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
        isEdited: boolean;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        channelId: string;
        senderId: string | null;
        contentJson: import("@prisma/client/runtime/client").JsonValue;
        plaintext: string;
        replyToMessageId: string | null;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        pinnedById: string | null;
    }>;
}
