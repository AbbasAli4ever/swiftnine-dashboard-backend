import { BadRequestException } from '@nestjs/common';
import { CommentsService } from './comments.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('CommentsService', () => {
  let prisma: {
    task: { findFirst: jest.Mock };
    comment: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      findUniqueOrThrow: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    workspaceMember: { findFirst: jest.Mock; findMany: jest.Mock };
    mention: { createMany: jest.Mock; findMany: jest.Mock; deleteMany: jest.Mock };
    reaction: { findUnique: jest.Mock; create: jest.Mock; findFirst: jest.Mock; delete: jest.Mock };
    $queryRaw: jest.Mock;
    $transaction: jest.Mock;
  };
  let sse: { broadcast: jest.Mock };
  let activity: { log: jest.Mock };
  let notifications: { notifyTaskAssignees: jest.Mock; createNotification: jest.Mock };
  let service: CommentsService;

  const taskSummary = {
    id: 'task-1',
    title: 'Comments task',
    taskNumber: 42,
    createdBy: 'owner-1',
    list: {
      id: 'list-1',
      name: 'Sprint',
      project: {
        id: 'project-1',
        name: 'Backend',
        workspaceId: 'workspace-1',
      },
    },
  };

  beforeEach(() => {
    prisma = {
      task: { findFirst: jest.fn().mockResolvedValue(taskSummary) },
      comment: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      workspaceMember: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      mention: {
        createMany: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      reaction: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) =>
      callback(prisma),
    );

    sse = { broadcast: jest.fn() };
    activity = { log: jest.fn().mockResolvedValue(undefined) };
    notifications = {
      notifyTaskAssignees: jest.fn().mockResolvedValue(undefined),
      createNotification: jest.fn().mockResolvedValue(undefined),
    };
    service = new CommentsService(prisma as never, sse as never, activity as never, notifications as never);
  });

  it('creates comments transactionally with mentions, notifications, and activity logs', async () => {
    prisma.workspaceMember.findMany.mockResolvedValue([
      {
        userId: 'user-2',
        user: { id: 'user-2', fullName: 'Member Two' },
      },
    ]);
    prisma.comment.create.mockResolvedValue({
      id: 'comment-1',
      parentId: null,
    });
    prisma.comment.findUniqueOrThrow.mockResolvedValue({
      id: 'comment-1',
      taskId: 'task-1',
    });

    const result = await service.createComment(
      'workspace-1',
      'user-1',
      'task-1',
      '  Hello team  ',
      undefined,
      ['user-2', 'user-2'],
    );

    expect(prisma.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          taskId: 'task-1',
          userId: 'user-1',
          content: 'Hello team',
        }),
      }),
    );
    expect(prisma.mention.createMany).toHaveBeenCalledWith({
      data: [{ commentId: 'comment-1', mentionedUserId: 'user-2' }],
    });
    expect(notifications.notifyTaskAssignees).toHaveBeenCalledWith('workspace-1', 'task-1', 'user-1', {
      type: 'comment:created',
      title: 'New comment on assigned task',
      message: 'Hello team',
      excludeUserIds: ['owner-1', 'user-2'],
    });
    expect(notifications.createNotification).toHaveBeenNthCalledWith(
      1,
      'workspace-1',
      'owner-1',
      'user-1',
      'comment_added',
      'New comment on Comments task',
      'Hello team',
      'comment',
      'comment-1',
      false,
    );
    expect(notifications.createNotification).toHaveBeenNthCalledWith(
      2,
      'workspace-1',
      'user-2',
      'user-1',
      'mentioned',
      'You were mentioned in Comments task',
      'Hello team',
      'comment',
      'comment-1',
      true,
    );
    expect(activity.log).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: 'workspace-1',
        entityType: 'comment',
        entityId: 'comment-1',
        action: 'comment_created',
        newValue: 'Hello team',
      }),
      prisma,
    );
    expect(sse.broadcast).toHaveBeenCalledWith('task-1', 'comment:created', result);
  });

  it('rejects invalid mentioned users outside the workspace', async () => {
    prisma.workspaceMember.findMany.mockResolvedValue([]);

    await expect(
      service.createComment('workspace-1', 'user-1', 'task-1', 'Hello', undefined, ['user-9']),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('treats reaction creation as idempotent for the same member and reaction face', async () => {
    prisma.comment.findFirst.mockResolvedValue({ id: 'comment-1', taskId: 'task-1' });
    prisma.workspaceMember.findFirst.mockResolvedValue({ id: 'member-1' });
    prisma.reaction.findUnique.mockResolvedValue({
      id: 'reaction-1',
      reactFace: 'like',
      member: { id: 'member-1', userId: 'user-1', role: 'MEMBER', user: { id: 'user-1' } },
    });

    const result = await service.addReaction('workspace-1', 'user-1', 'comment-1', ' like ');

    expect(prisma.reaction.findUnique).toHaveBeenCalledWith({
      where: {
        commentId_memberId_reactFace: {
          commentId: 'comment-1',
          memberId: 'member-1',
          reactFace: 'like',
        },
      },
      include: expect.any(Object),
    });
    expect(prisma.reaction.create).not.toHaveBeenCalled();
    expect(sse.broadcast).not.toHaveBeenCalledWith('task-1', 'reaction:created', expect.anything());
    expect(notifications.notifyTaskAssignees).not.toHaveBeenCalled();
    expect(result.id).toBe('reaction-1');
  });

  it('scopes reaction deletion to the workspace before removing it', async () => {
    prisma.reaction.findFirst.mockResolvedValue({
      id: 'reaction-1',
      commentId: 'comment-1',
      member: { id: 'member-1', userId: 'user-1' },
      comment: { id: 'comment-1', taskId: 'task-1' },
    });

    await service.deleteReaction('workspace-1', 'user-1', 'reaction-1');

    expect(prisma.reaction.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'reaction-1',
        comment: {
          task: {
            deletedAt: null,
            list: { deletedAt: null, project: { workspaceId: 'workspace-1', deletedAt: null } },
          },
        },
        member: { workspaceId: 'workspace-1', deletedAt: null },
      },
      include: {
        member: { select: { id: true, userId: true } },
        comment: { select: { id: true, taskId: true } },
      },
    });
    expect(prisma.reaction.delete).toHaveBeenCalledWith({ where: { id: 'reaction-1' } });
    expect(sse.broadcast).toHaveBeenCalledWith('task-1', 'reaction:deleted', {
      id: 'reaction-1',
      commentId: 'comment-1',
    });
  });

  it('soft deletes a comment tree recursively and logs the cascade', async () => {
    prisma.comment.findFirst.mockResolvedValue({
      id: 'comment-1',
      userId: 'user-1',
      taskId: 'task-1',
      parentId: null,
      content: 'To be deleted',
    });
    prisma.$queryRaw.mockResolvedValue([{ id: 'comment-1' }, { id: 'comment-2' }]);

    await service.deleteComment('workspace-1', 'user-1', 'comment-1', 'MEMBER');

    expect(prisma.comment.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['comment-1', 'comment-2'] }, deletedAt: null },
      data: { deletedAt: expect.any(Date) },
    });
    expect(activity.log).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: 'workspace-1',
        entityType: 'comment',
        entityId: 'comment-1',
        action: 'comment_deleted',
        metadata: expect.objectContaining({
          commentId: 'comment-1',
          deletedIds: ['comment-1', 'comment-2'],
        }),
      }),
      prisma,
    );
    expect(sse.broadcast).toHaveBeenCalledWith('task-1', 'comment:deleted', {
      id: 'comment-1',
      deletedIds: ['comment-1', 'comment-2'],
    });
  });

  it('only notifies newly added mentions during comment updates', async () => {
    prisma.comment.findFirst.mockResolvedValue({
      id: 'comment-1',
      userId: 'user-1',
      content: 'Old comment',
      createdAt: new Date(),
      taskId: 'task-1',
      parentId: null,
      task: taskSummary,
    });
    prisma.workspaceMember.findMany.mockResolvedValue([
      {
        userId: 'user-2',
        user: { id: 'user-2', fullName: 'Member Two' },
      },
      {
        userId: 'user-3',
        user: { id: 'user-3', fullName: 'Member Three' },
      },
    ]);
    prisma.mention.findMany.mockResolvedValue([{ mentionedUserId: 'user-2' }]);
    prisma.comment.findUniqueOrThrow.mockResolvedValue({
      id: 'comment-1',
      taskId: 'task-1',
    });

    await service.updateComment('workspace-1', 'user-1', 'comment-1', '  New comment  ', [
      'user-2',
      'user-3',
    ]);

    expect(prisma.mention.deleteMany).toHaveBeenCalledWith({ where: { commentId: 'comment-1' } });
    expect(prisma.mention.createMany).toHaveBeenCalledWith({
      data: [
        { commentId: 'comment-1', mentionedUserId: 'user-2' },
        { commentId: 'comment-1', mentionedUserId: 'user-3' },
      ],
    });
    expect(notifications.notifyTaskAssignees).toHaveBeenCalledWith('workspace-1', 'task-1', 'user-1', {
      type: 'comment:updated',
      title: 'Comment updated',
      message: 'New comment',
      excludeUserIds: ['user-3'],
    });
    expect(notifications.createNotification).toHaveBeenCalledWith(
      'workspace-1',
      'user-3',
      'user-1',
      'mentioned',
      'You were mentioned in Comments task',
      'New comment',
      'comment',
      'comment-1',
      true,
    );
    expect(activity.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'comment_updated',
        oldValue: 'Old comment',
        newValue: 'New comment',
      }),
      prisma,
    );
  });
});
