import { BadGatewayException } from '@nestjs/common';

export const MAX_DOCUMENT_SECTIONS = 30;

export const DOCUMENT_SYSTEM_PROMPT = `You are a document drafting assistant. Given a user's request, produce structured content for a document (report, proposal, summary, or presentation).

Respond with ONLY a JSON object matching this exact shape:
{
  "title": string,
  "sections": [
    { "heading"?: string, "body"?: string, "bullets"?: string[] }
  ]
}

Rules:
- Include at most ${MAX_DOCUMENT_SECTIONS} sections.
- Each section must have either "body" or "bullets" (or both), never neither.
- Keep body text under 2000 characters per section.
- Keep bullets concise, at most 15 per section.
- Do not include markdown formatting, only plain text.
- Write complete, well-organized content that directly addresses the user's request.`;

export function noImageReturnedException(): BadGatewayException {
  return new BadGatewayException('No image returned');
}

export function noDraftContentException(): BadGatewayException {
  return new BadGatewayException('No content generated');
}

export function invalidDraftJsonException(): BadGatewayException {
  return new BadGatewayException('Model returned invalid JSON');
}

export function unexpectedDraftShapeException(): BadGatewayException {
  return new BadGatewayException('Model returned an unexpected shape');
}
