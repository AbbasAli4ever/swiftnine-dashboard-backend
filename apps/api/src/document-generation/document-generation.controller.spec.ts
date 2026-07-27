import { DocumentGenerationController } from './document-generation.controller';

describe('DocumentGenerationController', () => {
  let controller: DocumentGenerationController;
  let pdf: { render: jest.Mock };
  let ppt: { render: jest.Mock };
  let attachments: { createGeneratedAttachment: jest.Mock };

  const req = {
    user: { id: 'user-1' },
    workspaceContext: { workspaceId: 'workspace-1' },
  } as never;

  beforeEach(() => {
    pdf = { render: jest.fn().mockResolvedValue(Buffer.from('pdf-bytes')) };
    ppt = { render: jest.fn().mockResolvedValue(Buffer.from('ppt-bytes')) };
    attachments = { createGeneratedAttachment: jest.fn().mockResolvedValue({ id: 'attachment-1' }) };
    controller = new DocumentGenerationController(pdf as never, ppt as never, attachments as never);
  });

  describe('generatePdf', () => {
    it('renders then creates a generated attachment with a slugified default filename', async () => {
      const dto = {
        conversationId: 'conversation-1',
        title: 'Q3 Roadmap Summary',
        sections: [{ body: 'Body text' }],
      } as never;

      const result = await controller.generatePdf(req, dto);

      expect(pdf.render).toHaveBeenCalledWith(dto);
      expect(attachments.createGeneratedAttachment).toHaveBeenCalledWith('user-1', 'workspace-1', {
        conversationId: 'conversation-1',
        messageId: undefined,
        fileName: 'q3-roadmap-summary.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('pdf-bytes'),
        attachmentType: 'generated-pdf',
      });
      expect(result).toEqual({ success: true, data: { id: 'attachment-1' }, message: 'PDF generated' });
    });

    it('uses the provided fileName when given', async () => {
      const dto = {
        conversationId: 'conversation-1',
        messageId: 'message-1',
        title: 'Report',
        fileName: 'custom.pdf',
        sections: [{ body: 'Body' }],
      } as never;

      await controller.generatePdf(req, dto);

      expect(attachments.createGeneratedAttachment).toHaveBeenCalledWith(
        'user-1',
        'workspace-1',
        expect.objectContaining({ fileName: 'custom.pdf', messageId: 'message-1' }),
      );
    });
  });

  describe('generatePpt', () => {
    it('renders then creates a generated attachment with the ppt mimetype', async () => {
      const dto = {
        conversationId: 'conversation-1',
        title: 'Sales Deck',
        sections: [{ bullets: ['Point one'] }],
      } as never;

      const result = await controller.generatePpt(req, dto);

      expect(ppt.render).toHaveBeenCalledWith(dto);
      expect(attachments.createGeneratedAttachment).toHaveBeenCalledWith(
        'user-1',
        'workspace-1',
        expect.objectContaining({
          fileName: 'sales-deck.pptx',
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          attachmentType: 'generated-ppt',
        }),
      );
      expect(result).toEqual({ success: true, data: { id: 'attachment-1' }, message: 'PowerPoint generated' });
    });
  });
});
