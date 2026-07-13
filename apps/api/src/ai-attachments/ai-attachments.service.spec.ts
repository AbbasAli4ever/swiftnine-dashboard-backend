import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AttachmentUploadStatus } from '@app/database/generated/prisma/client';
import { AiAttachmentsService } from './ai-attachments.service';
import {
  ALLOWED_MIME_TYPES_BY_CONTENT_TYPE,
  MAX_FILE_SIZE_BY_CONTENT_TYPE,
} from './ai-attachments.constants';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('AiAttachmentsService', () => {
  let service: AiAttachmentsService;
  let prisma: {
    attachment: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    aiConversationMessage: { findFirst: jest.Mock };
  };
  let s3: {
    bucket: string;
    basePrefix: jest.Mock;
    buildKey: jest.Mock;
    createPresignedPutUrl: jest.Mock;
    createPresignedGetUrl: jest.Mock;
    assertKeyWithinPrefix: jest.Mock;
    resolveUploadedFileMetadata: jest.Mock;
    validateMimeType: jest.Mock;
    validateFileSize: jest.Mock;
    putObject: jest.Mock;
  };
  let config: { get: jest.Mock };
  let conversations: { assertOwned: jest.Mock };
  let scanner: { scan: jest.Mock };

  const WORKSPACE_ID = 'workspace-1';
  const USER_ID = 'user-1';
  const CONVERSATION_ID = 'conversation-1';

  beforeEach(() => {
    prisma = {
      attachment: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      aiConversationMessage: { findFirst: jest.fn() },
    };
    s3 = {
      bucket: 'test-bucket',
      basePrefix: jest.fn().mockReturnValue('swiftnine/docs/app'),
      buildKey: jest.fn((...segments: string[]) => segments.join('/')),
      createPresignedPutUrl: jest.fn().mockResolvedValue('https://signed.example.com/put'),
      createPresignedGetUrl: jest.fn().mockResolvedValue('https://signed.example.com/get'),
      assertKeyWithinPrefix: jest.fn(),
      resolveUploadedFileMetadata: jest.fn(),
      validateMimeType: jest.fn(),
      validateFileSize: jest.fn(),
      putObject: jest.fn().mockResolvedValue(undefined),
    };
    config = { get: jest.fn().mockReturnValue(undefined) };
    conversations = { assertOwned: jest.fn().mockResolvedValue(undefined) };
    scanner = { scan: jest.fn().mockResolvedValue({ clean: true }) };

    service = new AiAttachmentsService(
      prisma as never,
      s3 as never,
      config as never,
      conversations as never,
      scanner as never,
    );
  });

  describe('presign', () => {
    it('validates conversation ownership, mime/size, and creates a PENDING attachment', async () => {
      prisma.attachment.create.mockResolvedValue({ id: 'attachment-1' });

      const result = await service.presign(USER_ID, WORKSPACE_ID, {
        conversationId: CONVERSATION_ID,
        fileName: 'diagram.png',
        mimeType: 'image/png',
        fileSize: 1024,
        attachmentType: 'image',
      });

      expect(conversations.assertOwned).toHaveBeenCalledWith(WORKSPACE_ID, USER_ID, CONVERSATION_ID);
      expect(s3.validateMimeType).toHaveBeenCalledWith(
        'image/png',
        ALLOWED_MIME_TYPES_BY_CONTENT_TYPE.IMAGE,
      );
      expect(s3.validateFileSize).toHaveBeenCalledWith(1024, MAX_FILE_SIZE_BY_CONTENT_TYPE.IMAGE);
      expect(prisma.attachment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            aiConversationId: CONVERSATION_ID,
            uploadedBy: USER_ID,
            uploadStatus: AttachmentUploadStatus.PENDING,
            contentType: 'IMAGE',
          }),
        }),
      );
      expect(result).toEqual({
        attachmentId: 'attachment-1',
        uploadUrl: 'https://signed.example.com/put',
        s3Key: expect.any(String),
        expiresIn: expect.any(Number),
      });
    });

    it('rejects an unsupported mime type before touching the database', async () => {
      s3.validateMimeType.mockImplementation(() => {
        throw new BadRequestException('Unsupported file type');
      });

      await expect(
        service.presign(USER_ID, WORKSPACE_ID, {
          conversationId: CONVERSATION_ID,
          fileName: 'malware.exe',
          mimeType: 'application/x-msdownload',
          fileSize: 1024,
          attachmentType: 'image',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.attachment.create).not.toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    const pendingRow = () => ({
      id: 'attachment-1',
      aiConversationId: CONVERSATION_ID,
      aiConversationMessageId: null,
      fileName: 'diagram.png',
      mimeType: 'image/png',
      fileSize: BigInt(1024),
      s3Key: 'swiftnine/docs/app/ai-attachments/conversation-conversation-1/abc-diagram.png',
      contentType: 'IMAGE' as const,
      uploadStatus: AttachmentUploadStatus.PENDING,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    it('resolves metadata via HEAD, scans, marks CONFIRMED, and links the message', async () => {
      prisma.attachment.findFirst.mockResolvedValue(pendingRow());
      s3.resolveUploadedFileMetadata.mockResolvedValue({
        fileName: 'diagram.png',
        mimeType: 'image/png',
        fileSize: BigInt(2048),
      });
      prisma.aiConversationMessage.findFirst.mockResolvedValue({ id: 'message-1' });
      prisma.attachment.update.mockResolvedValue({
        ...pendingRow(),
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
        aiConversationMessageId: 'message-1',
        fileSize: BigInt(2048),
      });

      const result = await service.confirm(USER_ID, WORKSPACE_ID, 'attachment-1', {
        messageId: 'message-1',
      });

      expect(s3.assertKeyWithinPrefix).toHaveBeenCalled();
      expect(scanner.scan).toHaveBeenCalledWith({ bucket: 'test-bucket', key: pendingRow().s3Key });
      expect(prisma.attachment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'attachment-1' },
          data: expect.objectContaining({
            uploadStatus: AttachmentUploadStatus.CONFIRMED,
            aiConversationMessageId: 'message-1',
          }),
        }),
      );
      expect(result.url).toBe('https://signed.example.com/get');
    });

    it('is idempotent when the attachment is already CONFIRMED', async () => {
      prisma.attachment.findFirst.mockResolvedValue({
        ...pendingRow(),
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
      });

      await service.confirm(USER_ID, WORKSPACE_ID, 'attachment-1', {});

      expect(s3.resolveUploadedFileMetadata).not.toHaveBeenCalled();
      expect(scanner.scan).not.toHaveBeenCalled();
      expect(prisma.attachment.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the attachment is not owned by this user/workspace', async () => {
      prisma.attachment.findFirst.mockResolvedValue(null);

      await expect(
        service.confirm(USER_ID, WORKSPACE_ID, 'attachment-1', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('soft deletes an owned attachment', async () => {
      prisma.attachment.findFirst.mockResolvedValue({
        id: 'attachment-1',
        aiConversationId: CONVERSATION_ID,
        aiConversationMessageId: null,
        fileName: 'diagram.png',
        mimeType: 'image/png',
        fileSize: BigInt(1024),
        s3Key: 'key',
        contentType: 'IMAGE',
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
        createdAt: new Date(),
      });

      const result = await service.remove(USER_ID, WORKSPACE_ID, 'attachment-1');

      expect(prisma.attachment.update).toHaveBeenCalledWith({
        where: { id: 'attachment-1' },
        data: { deletedAt: expect.any(Date) },
      });
      expect(result).toEqual({ id: 'attachment-1' });
    });

    it('throws NotFoundException for an attachment outside this workspace/user', async () => {
      prisma.attachment.findFirst.mockResolvedValue(null);

      await expect(service.remove(USER_ID, WORKSPACE_ID, 'attachment-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createGeneratedAttachment', () => {
    const buffer = Buffer.from('pdf-bytes');

    it('validates ownership and size, uploads directly, and creates a CONFIRMED attachment', async () => {
      prisma.attachment.create.mockResolvedValue({
        id: 'attachment-1',
        aiConversationId: CONVERSATION_ID,
        aiConversationMessageId: null,
        fileName: 'report.pdf',
        mimeType: 'application/pdf',
        fileSize: BigInt(buffer.length),
        s3Key: 'swiftnine/docs/app/ai-attachments/conversation-conversation-1/report.pdf',
        contentType: 'GENERATED_PDF',
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
        createdAt: new Date(),
      });

      const result = await service.createGeneratedAttachment(USER_ID, WORKSPACE_ID, {
        conversationId: CONVERSATION_ID,
        fileName: 'report.pdf',
        mimeType: 'application/pdf',
        buffer,
        attachmentType: 'generated-pdf',
      });

      expect(conversations.assertOwned).toHaveBeenCalledWith(WORKSPACE_ID, USER_ID, CONVERSATION_ID);
      expect(s3.validateMimeType).toHaveBeenCalledWith(
        'application/pdf',
        ALLOWED_MIME_TYPES_BY_CONTENT_TYPE.GENERATED_PDF,
      );
      expect(s3.validateFileSize).toHaveBeenCalledWith(
        buffer.length,
        MAX_FILE_SIZE_BY_CONTENT_TYPE.GENERATED_PDF,
      );
      expect(s3.putObject).toHaveBeenCalledWith(expect.any(String), buffer, 'application/pdf');
      expect(prisma.attachment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            aiConversationId: CONVERSATION_ID,
            uploadedBy: USER_ID,
            uploadStatus: AttachmentUploadStatus.CONFIRMED,
            contentType: 'GENERATED_PDF',
          }),
        }),
      );
      expect(result.id).toBe('attachment-1');
      expect(result.url).toBe('https://signed.example.com/get');
    });

    it('links the attachment to a message when messageId is provided', async () => {
      prisma.aiConversationMessage.findFirst.mockResolvedValue({ id: 'message-1' });
      prisma.attachment.create.mockResolvedValue({
        id: 'attachment-1',
        aiConversationId: CONVERSATION_ID,
        aiConversationMessageId: 'message-1',
        fileName: 'deck.pptx',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        fileSize: BigInt(buffer.length),
        s3Key: 'key',
        contentType: 'GENERATED_PPT',
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
        createdAt: new Date(),
      });

      await service.createGeneratedAttachment(USER_ID, WORKSPACE_ID, {
        conversationId: CONVERSATION_ID,
        messageId: 'message-1',
        fileName: 'deck.pptx',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        buffer,
        attachmentType: 'generated-ppt',
      });

      expect(prisma.attachment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ aiConversationMessageId: 'message-1' }),
        }),
      );
    });

    it('rejects an oversized buffer before uploading', async () => {
      s3.validateFileSize.mockImplementation(() => {
        throw new BadRequestException('File is too large');
      });

      await expect(
        service.createGeneratedAttachment(USER_ID, WORKSPACE_ID, {
          conversationId: CONVERSATION_ID,
          fileName: 'huge.pdf',
          mimeType: 'application/pdf',
          buffer,
          attachmentType: 'generated-pdf',
        }),
      ).rejects.toThrow(BadRequestException);
      expect(s3.putObject).not.toHaveBeenCalled();
      expect(prisma.attachment.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when linking to a message outside the conversation', async () => {
      prisma.aiConversationMessage.findFirst.mockResolvedValue(null);

      await expect(
        service.createGeneratedAttachment(USER_ID, WORKSPACE_ID, {
          conversationId: CONVERSATION_ID,
          messageId: 'not-owned',
          fileName: 'report.pdf',
          mimeType: 'application/pdf',
          buffer,
          attachmentType: 'generated-pdf',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(s3.putObject).not.toHaveBeenCalled();
    });
  });
});
