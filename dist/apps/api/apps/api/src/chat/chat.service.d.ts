import { PrismaService } from "../../../../libs/database/src";
import { ChatFanoutService } from './chat-fanout.service';
import { AttachmentsService } from '../attachments/attachments.service';
import type { CreateDmDto } from './dto/create-dm.dto';
import type { EditMessageDto } from './dto/edit-message.dto';
import type { ListMessagesQuery } from './dto/list-messages.dto';
import type { MarkReadDto } from './dto/mark-read.dto';
import type { SearchMessagesQuery } from './dto/search-messages.dto';
import type { SendMessageDto } from './dto/send-message.dto';
export declare class ChatService {
    private readonly prisma;
    private readonly fanout;
    private readonly attachments;
    constructor(prisma: PrismaService, fanout: ChatFanoutService, attachments: AttachmentsService);
    listMessages(workspaceId: string, userId: string, channelId: string, query: ListMessagesQuery): Promise<{
        items: {
            id: string;
            channelId: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            contentJson: Record<string, unknown>;
            plaintext: string;
            replyToMessageId: string | null;
            isEdited: boolean;
            editedAt: Date | null;
            isPinned: boolean;
            pinnedAt: Date | null;
            pinnedById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
            pinnedBy: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
            mentions: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            }[];
            reactions: {
                id: string;
                messageId: string;
                userId: string;
                emoji: string;
                createdAt: Date;
                user: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                };
            }[];
            attachments: {
                fileSize: number;
                url: string;
                expiresAt: Date;
                id: string;
                fileName: string;
                mimeType: string;
                s3Key: string;
            }[];
            replyTo: {
                id: string;
                senderId: string | null;
                kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
                plaintext: string;
                deletedAt: Date | null;
                sender: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                } | null;
            } | null;
            channel: {
                id: string;
                name: string | null;
                workspaceId: string;
                kind: import("@app/database/generated/prisma/enums").ChannelKind;
                privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
            };
        }[];
        nextCursor: string | null;
    }>;
    listPinnedMessages(workspaceId: string, userId: string, channelId: string): Promise<{
        id: string;
        channelId: string;
        senderId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        contentJson: Record<string, unknown>;
        plaintext: string;
        replyToMessageId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        pinnedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        sender: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        pinnedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        mentions: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        }[];
        reactions: {
            id: string;
            messageId: string;
            userId: string;
            emoji: string;
            createdAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
        attachments: {
            fileSize: number;
            url: string;
            expiresAt: Date;
            id: string;
            fileName: string;
            mimeType: string;
            s3Key: string;
        }[];
        replyTo: {
            id: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            plaintext: string;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
        } | null;
        channel: {
            id: string;
            name: string | null;
            workspaceId: string;
            kind: import("@app/database/generated/prisma/enums").ChannelKind;
            privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        };
    }[]>;
    sendMessage(workspaceId: string, userId: string, channelId: string, dto: SendMessageDto): Promise<{
        id: string;
        channelId: string;
        senderId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        contentJson: Record<string, unknown>;
        plaintext: string;
        replyToMessageId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        pinnedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        sender: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        pinnedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        mentions: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        }[];
        reactions: {
            id: string;
            messageId: string;
            userId: string;
            emoji: string;
            createdAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
        attachments: {
            fileSize: number;
            url: string;
            expiresAt: Date;
            id: string;
            fileName: string;
            mimeType: string;
            s3Key: string;
        }[];
        replyTo: {
            id: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            plaintext: string;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
        } | null;
        channel: {
            id: string;
            name: string | null;
            workspaceId: string;
            kind: import("@app/database/generated/prisma/enums").ChannelKind;
            privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        };
    }>;
    editMessage(workspaceId: string, userId: string, messageId: string, dto: EditMessageDto): Promise<{
        id: string;
        channelId: string;
        senderId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        contentJson: Record<string, unknown>;
        plaintext: string;
        replyToMessageId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        pinnedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        sender: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        pinnedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        mentions: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        }[];
        reactions: {
            id: string;
            messageId: string;
            userId: string;
            emoji: string;
            createdAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
        attachments: {
            fileSize: number;
            url: string;
            expiresAt: Date;
            id: string;
            fileName: string;
            mimeType: string;
            s3Key: string;
        }[];
        replyTo: {
            id: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            plaintext: string;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
        } | null;
        channel: {
            id: string;
            name: string | null;
            workspaceId: string;
            kind: import("@app/database/generated/prisma/enums").ChannelKind;
            privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        };
    }>;
    deleteMessage(workspaceId: string, userId: string, messageId: string): Promise<{
        id: string;
        channelId: string;
        senderId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        contentJson: Record<string, unknown>;
        plaintext: string;
        replyToMessageId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        pinnedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        sender: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        pinnedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        mentions: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        }[];
        reactions: {
            id: string;
            messageId: string;
            userId: string;
            emoji: string;
            createdAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
        attachments: {
            fileSize: number;
            url: string;
            expiresAt: Date;
            id: string;
            fileName: string;
            mimeType: string;
            s3Key: string;
        }[];
        replyTo: {
            id: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            plaintext: string;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
        } | null;
        channel: {
            id: string;
            name: string | null;
            workspaceId: string;
            kind: import("@app/database/generated/prisma/enums").ChannelKind;
            privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        };
    }>;
    toggleReaction(workspaceId: string, userId: string, messageId: string, emoji: string): Promise<{
        action: string;
        messageId: string;
        userId: string;
        emoji: string;
    }>;
    pinMessage(workspaceId: string, userId: string, messageId: string): Promise<{
        id: string;
        channelId: string;
        senderId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        contentJson: Record<string, unknown>;
        plaintext: string;
        replyToMessageId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        pinnedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        sender: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        pinnedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        mentions: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        }[];
        reactions: {
            id: string;
            messageId: string;
            userId: string;
            emoji: string;
            createdAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
        attachments: {
            fileSize: number;
            url: string;
            expiresAt: Date;
            id: string;
            fileName: string;
            mimeType: string;
            s3Key: string;
        }[];
        replyTo: {
            id: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            plaintext: string;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
        } | null;
        channel: {
            id: string;
            name: string | null;
            workspaceId: string;
            kind: import("@app/database/generated/prisma/enums").ChannelKind;
            privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        };
    }>;
    unpinMessage(workspaceId: string, userId: string, messageId: string): Promise<{
        id: string;
        channelId: string;
        senderId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
        contentJson: Record<string, unknown>;
        plaintext: string;
        replyToMessageId: string | null;
        isEdited: boolean;
        editedAt: Date | null;
        isPinned: boolean;
        pinnedAt: Date | null;
        pinnedById: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        sender: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        pinnedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
        mentions: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        }[];
        reactions: {
            id: string;
            messageId: string;
            userId: string;
            emoji: string;
            createdAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
        attachments: {
            fileSize: number;
            url: string;
            expiresAt: Date;
            id: string;
            fileName: string;
            mimeType: string;
            s3Key: string;
        }[];
        replyTo: {
            id: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            plaintext: string;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
        } | null;
        channel: {
            id: string;
            name: string | null;
            workspaceId: string;
            kind: import("@app/database/generated/prisma/enums").ChannelKind;
            privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        };
    }>;
    markRead(workspaceId: string, userId: string, channelId: string, dto: MarkReadDto): Promise<{
        channelId: string;
        userId: string;
        lastReadMessageId: string;
        unreadCount: number;
        readAt: Date;
    }>;
    setMute(workspaceId: string, userId: string, channelId: string, isMuted: boolean): Promise<{
        channelId: string;
        userId: string;
        isMuted: boolean;
    }>;
    createDm(workspaceId: string, userId: string, dto: CreateDmDto): Promise<{
        id: string;
        workspaceId: string;
        kind: import("@app/database/generated/prisma/enums").ChannelKind;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        name: string | null;
        description: string | null;
        projectId: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
        isMuted: boolean;
        unreadCount: number;
        lastReadMessageId: string | null;
        members: {
            id: string;
            userId: string;
            role: import("@app/database/generated/prisma/enums").Role;
            isMuted: boolean;
            unreadCount: number;
            lastReadMessageId: string | null;
            joinedAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
    }>;
    listDms(workspaceId: string, userId: string): Promise<{
        id: string;
        workspaceId: string;
        kind: import("@app/database/generated/prisma/enums").ChannelKind;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
        name: string | null;
        description: string | null;
        projectId: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
        isMuted: boolean;
        unreadCount: number;
        lastReadMessageId: string | null;
        members: {
            id: string;
            userId: string;
            role: import("@app/database/generated/prisma/enums").Role;
            isMuted: boolean;
            unreadCount: number;
            lastReadMessageId: string | null;
            joinedAt: Date;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        }[];
    }[]>;
    searchMessages(workspaceId: string, userId: string, query: SearchMessagesQuery): Promise<{
        items: {
            id: string;
            channelId: string;
            senderId: string | null;
            kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
            contentJson: Record<string, unknown>;
            plaintext: string;
            replyToMessageId: string | null;
            isEdited: boolean;
            editedAt: Date | null;
            isPinned: boolean;
            pinnedAt: Date | null;
            pinnedById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            sender: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
            pinnedBy: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            } | null;
            mentions: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            }[];
            reactions: {
                id: string;
                messageId: string;
                userId: string;
                emoji: string;
                createdAt: Date;
                user: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                };
            }[];
            attachments: {
                fileSize: number;
                url: string;
                expiresAt: Date;
                id: string;
                fileName: string;
                mimeType: string;
                s3Key: string;
            }[];
            replyTo: {
                id: string;
                senderId: string | null;
                kind: import("@app/database/generated/prisma/enums").ChannelMessageKind;
                plaintext: string;
                deletedAt: Date | null;
                sender: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                } | null;
            } | null;
            channel: {
                id: string;
                name: string | null;
                workspaceId: string;
                kind: import("@app/database/generated/prisma/enums").ChannelKind;
                privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
            };
        }[];
        nextCursor: string | null;
    }>;
    private normalizeContent;
    private assertReplyTarget;
    private validateMentionedUsers;
    private validateAttachmentIds;
    private assertChannelMember;
    private findMessageOrThrow;
    private messageInclude;
    private channelIncludeForList;
    private toMessageResponse;
    private toChannelResponse;
    private encodeCursor;
    private decodeCursor;
    private channelAttachmentPrefix;
}
