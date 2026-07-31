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

export const MAX_DECK_SLIDES = 20;

// Purely a crash-guard against a malformed/runaway response requesting an
// unreasonable number of parallel image calls in one synchronous request (no
// HTTP timeout exists in this stack). Not a creative target — the model decides
// the real per-deck image count based on content, and should never approach this.
export const MAX_DECK_IMAGES_SAFETY_CEILING = 8;

export const PRESENTATION_SYSTEM_PROMPT = `You are a presentation drafting assistant. Given a user's request, produce structured content for a visually varied slide deck.

Respond with ONLY a JSON object matching this exact shape:
{
  "title": string,
  "subtitle"?: string,
  "theme": {
    "accentColor": string,   // 6-digit hex, no "#", e.g. "2563EB"
    "headFont": "Arial" | "Georgia" | "Verdana" | "Trebuchet MS",
    "bodyFont": "Arial" | "Georgia" | "Verdana" | "Trebuchet MS"
  },
  "slides": [ Slide, ... ]  // 1 to ${MAX_DECK_SLIDES} slides
}

Each Slide is one of these layout types (the "type" field selects which):
- { "type": "title", "heading": string, "subheading"?: string }
- { "type": "bullets", "heading": string, "bullets": string[] }  // at most 6 bullets
- { "type": "image-left" | "image-right", "heading": string, "body"?: string, "bullets"?: string[], "imagePrompt": string }
- { "type": "chart", "heading": string, "chartType": "bar" | "line" | "pie" | "doughnut", "labels": string[], "values": number[] }
- { "type": "quote", "quote": string, "attribution"?: string }
- { "type": "section-divider", "heading": string }

Rules:
- Pick exactly one theme (accentColor + headFont + bodyFont) for the entire deck up front — do not vary it slide to slide.
- Start with a "title" slide.
- Use "section-divider" slides to separate major sections in longer decks.
- Only give an "image-left"/"image-right" slide an "imagePrompt" when a real image would genuinely clarify or reinforce that specific slide's point — not on every slide. Most decks need only a few image slides, some need none.
- "imagePrompt" must describe the desired image itself (subject, style, composition) — never code, markup, or instructions to a program.
- Use "chart" slides only when the content has real comparable/numeric data to show.
- Do not include markdown formatting in any text field, only plain text.
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
