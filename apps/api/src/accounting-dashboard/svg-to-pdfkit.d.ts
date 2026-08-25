// svg-to-pdfkit ships no type declarations of its own. Only the single
// call signature this codebase uses is declared here — options are narrowed
// to the positioning/sizing subset actually passed by ReportPdfService.
declare module 'svg-to-pdfkit' {
  import type PDFDocument from 'pdfkit';

  function SVGtoPDF(
    doc: typeof PDFDocument.prototype,
    svg: string,
    x?: number,
    y?: number,
    options?: { width?: number; height?: number; preserveAspectRatio?: string },
  ): void;

  export = SVGtoPDF;
}
