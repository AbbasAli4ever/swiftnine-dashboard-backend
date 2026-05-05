import { ForbiddenException } from '@nestjs/common';
import { ChatService } from './chat.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('ChatService', () => {
  let service: ChatService;
  let prisma: {
    channelMember: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
    attachment: {
      findMany: jest.Mock;
      updateMany: jest.Mock;
    };
    channelMessage: {
      findMany: jest.Mock;
      create: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    channelMessageMention: {
      createMany: jest.Mock;
      deleteMany: jest.Mock;
    };
    channelMessageReaction: {
      findFirst: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
    channel: {
      findFirst: jest.Mock;
      create: jest.Mock;
      findUniqueOrThrow: jest.Mock;
      findMany: jest.Mock;
    };
    user: {
      findUnique: jest.Mock;
    };
    workspaceMember: {
      findFirst: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let fanout: {
    incrementUnreadCounts: jest.Mock;
    notifyMessageCreated: jest.Mock;
  };
  let attachments: {
    toViewAttachment: jest.Mock;
  };
  let gateway: {
    emitMessageCreated: jest.Mock;
    emitMessageEdited: jest.Mock;
    emitMessageDeleted: jest.Mock;
    emitReaction: jest.Mock;
    emitMessagePinned: jest.Mock;
    emitMessageUnpinned: jest.Mock;
    emitMemberRead: jest.Mock;
  };
  let rateLimits: {
    assertMessageSend: jest.Mock;
    assertReactionToggle: jest.Mock;
  };
  let metrics: {
    recordMessageSent: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      channelMember: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      attachment: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
      channelMessage: {
        findMany: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      channelMessageMention: {
        createMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      channelMessageReaction: {
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      channel: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      workspaceMember: {
        findFirst: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation(
      async (callback: (tx: typeof prisma) => unknown) => callback(prisma),
    );

    fanout = {
      incrementUnreadCounts: jest.fn().mockResolvedValue(undefined),
      notifyMessageCreated: jest.fn().mockResolvedValue(undefined),
    };
    attachments = {
      toViewAttachment: jest.fn().mockImplementation(async (attachment) => ({
        ...attachment,
        fileSize: Number(attachment.fileSize ?? 0),
        url: 'https://signed.example.com/object',
        expiresAt: new Date('2026-05-05T00:00:00.000Z'),
      })),
    };
    gateway = {
      emitMessageCreated: jest.fn(),
      emitMessageEdited: jest.fn(),
      emitMessageDeleted: jest.fn(),
      emitReaction: jest.fn(),
      emitMessagePinned: jest.fn(),
      emitMessageUnpinned: jest.fn(),
      emitMemberRead: jest.fn(),
    };
    rateLimits = {
      assertMessageSend: jest.fn(),
      assertReactionToggle: jest.fn(),
    };
    metrics = {
      recordMessageSent: jest.fn(),
    };

    service = new ChatService(
      prisma as never,
      fanout as never,
      attachments as never,
      gateway as never,
      rateLimits as never,
      metrics as never,
    );
  });

  it('sends a message, increments unread counts, and fans out notifications', async () => {
    prisma.channelMember.findFirst.mockResolvedValue({
      id: 'membership-1',
      role: 'MEMBER',
      isMuted: false,
      unreadCount: 0,
      lastReadMessageId: null,
      channel: {
        id: 'channel-1',
        workspaceId: 'workspace-1',
        kind: 'CHANNEL',
        name: 'General',
        privacy: 'PUBLIC',
        members: [
          { userId: 'user-1', isMuted: false },
          { userId: 'user-2', isMuted: false },
        ],
      },
    });
    prisma.channelMember.findMany.mockResolvedValue([{ userId: 'user-2' }]);
    prisma.attachment.findMany.mockResolvedValue([]);
    prisma.channelMessage.create.mockResolvedValue({ id: 'message-1' });
    prisma.channelMessage.findFirst.mockResolvedValue(messageFixture());
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      fullName: 'Sender User',
    });

    const result = await service.sendMessage(
      'workspace-1',
      'user-1',
      'channel-1',
      {
        contentJson: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hello team' }],
            },
          ],
        },
        mentionedUserIds: ['user-2'],
        attachmentIds: [],
      } as never,
    );

    expect(prisma.channelMessage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        channelId: 'channel-1',
        senderId: 'user-1',
        plaintext: 'Hello team',
      }),
    });
    expect(fanout.incrementUnreadCounts).toHaveBeenCalledWith(
      'channel-1',
      'user-1',
      prisma,
    );
    expect(fanout.notifyMessageCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: 'workspace-1',
        channelId: 'channel-1',
        messageId: 'message-1',
        mentionedUserIds: ['user-2'],
      }),
    );
    expect(result.id).toBe('message-1');
    expect(result.plaintext).toBe('Hello team');
    expect(rateLimits.assertMessageSend).toHaveBeenCalledWith(
      'user-1',
      'channel-1',
    );
    expect(metrics.recordMessageSent).toHaveBeenCalledWith(
      'channel-1',
      'user-1',
    );
    expect(gateway.emitMessageCreated).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'message-1', channelId: 'channel-1' }),
    );
  });

  it('rejects edits outside the five-minute window', async () => {
    prisma.channelMessage.findFirst.mockResolvedValue(
      messageFixture({
        createdAt: new Date(Date.now() - 6 * 60 * 1000),
      }),
    );

    await expect(
      service.editMessage('workspace-1', 'user-1', 'message-1', {
        contentJson: { type: 'doc', content: [] },
        mentionedUserIds: [],
      } as never),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('soft deletes messages into a tombstone payload', async () => {
    prisma.channelMessage.findFirst
      .mockResolvedValueOnce(messageFixture())
      .mockResolvedValueOnce(
        messageFixture({
          deletedAt: new Date('2026-05-05T01:00:00.000Z'),
          contentJson: { deleted: true },
          plaintext: '',
        }),
      );
    prisma.channelMember.findFirst.mockResolvedValue({
      id: 'membership-1',
      role: 'MEMBER',
      isMuted: false,
      unreadCount: 0,
      lastReadMessageId: null,
      channel: {
        id: 'channel-1',
        workspaceId: 'workspace-1',
        kind: 'CHANNEL',
        name: 'General',
        privacy: 'PUBLIC',
        members: [{ userId: 'user-1', isMuted: false }],
      },
    });

    const result = await service.deleteMessage(
      'workspace-1',
      'user-1',
      'message-1',
    );

    expect(prisma.channelMessage.update).toHaveBeenCalledWith({
      where: { id: 'message-1' },
      data: {
        deletedAt: expect.any(Date),
        contentJson: { deleted: true },
        plaintext: '',
      },
    });
    expect(result.contentJson).toEqual({ deleted: true });
    expect(result.plaintext).toBe('');
    expect(gateway.emitMessageDeleted).toHaveBeenCalledWith(
      'channel-1',
      'message-1',
      expect.any(Date),
    );
  });

  it('deduplicates DM creation when a channel already exists', async () => {
    prisma.workspaceMember.findFirst
      .mockResolvedValueOnce({ id: 'member-1' })
      .mockResolvedValueOnce({ id: 'member-2' });
    prisma.channel.findFirst.mockResolvedValue(dmChannelFixture());

    const result = await service.createDm('workspace-1', 'user-1', {
      targetUserId: 'user-2',
    } as never);

    expect(prisma.channel.create).not.toHaveBeenCalled();
    expect(result.id).toBe('dm-1');
    expect(result.kind).toBe('DM');
  });

  it('broadcasts read pointers after mark-read succeeds', async () => {
    prisma.channelMember.findFirst.mockResolvedValue({
      id: 'membership-1',
      role: 'MEMBER',
      isMuted: false,
      unreadCount: 4,
      lastReadMessageId: null,
      channel: {
        id: 'channel-1',
        workspaceId: 'workspace-1',
        kind: 'CHANNEL',
        name: 'General',
        privacy: 'PUBLIC',
        members: [{ userId: 'user-1', isMuted: false }],
      },
    });
    prisma.channelMessage.findFirst.mockResolvedValue({
      id: 'message-9',
      createdAt: new Date('2026-05-05T00:00:00.000Z'),
    });
    prisma.channelMessage.count.mockResolvedValue(2);

    const result = await service.markRead(
      'workspace-1',
      'user-1',
      'channel-1',
      { lastReadMessageId: 'message-9' } as never,
    );

    expect(gateway.emitMemberRead).toHaveBeenCalledWith(
      expect.objectContaining({
        channelId: 'channel-1',
        userId: 'user-1',
        lastReadMessageId: 'message-9',
        unreadCount: 2,
      }),
    );
    expect(result.unreadCount).toBe(2);
  });
});

function messageFixture(
  overrides: Partial<{
    createdAt: Date;
    deletedAt: Date | null;
    contentJson: Record<string, unknown>;
    plaintext: string;
  }> = {},
) {
  return {
    id: 'message-1',
    channelId: 'channel-1',
    senderId: 'user-1',
    kind: 'USER',
    contentJson: overrides.contentJson ?? {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Hello team' }] },
      ],
    },
    plaintext: overrides.plaintext ?? 'Hello team',
    replyToMessageId: null,
    isEdited: false,
    editedAt: null,
    isPinned: false,
    pinnedAt: null,
    pinnedById: null,
    createdAt: overrides.createdAt ?? new Date('2026-05-05T00:00:00.000Z'),
    updatedAt: new Date('2026-05-05T00:00:00.000Z'),
    deletedAt: overrides.deletedAt ?? null,
    channel: {
      id: 'channel-1',
      workspaceId: 'workspace-1',
      kind: 'CHANNEL',
      privacy: 'PUBLIC',
      name: 'General',
    },
    sender: { id: 'user-1', fullName: 'Sender User', avatarUrl: null },
    pinnedBy: null,
    replyTo: null,
    mentions: [
      {
        mentionedUser: {
          id: 'user-2',
          fullName: 'Mentioned User',
          avatarUrl: null,
        },
      },
    ],
    reactions: [],
    attachments: [],
  };
}

function dmChannelFixture() {
  return {
    id: 'dm-1',
    workspaceId: 'workspace-1',
    kind: 'DM',
    privacy: 'PRIVATE',
    name: null,
    description: null,
    projectId: null,
    createdBy: 'user-1',
    createdAt: new Date('2026-05-05T00:00:00.000Z'),
    updatedAt: new Date('2026-05-05T00:00:00.000Z'),
    members: [
      {
        id: 'channel-member-1',
        userId: 'user-1',
        role: 'MEMBER',
        isMuted: false,
        unreadCount: 0,
        lastReadMessageId: null,
        joinedAt: new Date('2026-05-05T00:00:00.000Z'),
        user: { id: 'user-1', fullName: 'Sender User', avatarUrl: null },
      },
      {
        id: 'channel-member-2',
        userId: 'user-2',
        role: 'MEMBER',
        isMuted: false,
        unreadCount: 0,
        lastReadMessageId: null,
        joinedAt: new Date('2026-05-05T00:00:00.000Z'),
        user: { id: 'user-2', fullName: 'Other User', avatarUrl: null },
      },
    ],
  };
}
