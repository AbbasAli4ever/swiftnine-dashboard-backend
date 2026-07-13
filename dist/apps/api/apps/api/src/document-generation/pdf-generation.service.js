"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfGenerationService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
let PdfGenerationService = class PdfGenerationService {
    async render(input) {
        const doc = new pdfkit_1.default({ margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        const done = new Promise((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
        });
        doc.fontSize(20).text(input.title, { underline: true });
        doc.moveDown();
        for (const section of input.sections) {
            if (section.heading) {
                doc.fontSize(14).text(section.heading);
                doc.moveDown(0.5);
            }
            if (section.body) {
                doc.fontSize(11).text(section.body);
                doc.moveDown(0.5);
            }
            if (section.bullets?.length) {
                for (const bullet of section.bullets) {
                    doc.fontSize(11).text(`•  ${bullet}`, { indent: 20 });
                }
                doc.moveDown(0.5);
            }
            doc.moveDown();
        }
        doc.end();
        return done;
    }
};
exports.PdfGenerationService = PdfGenerationService;
exports.PdfGenerationService = PdfGenerationService = __decorate([
    (0, common_1.Injectable)()
], PdfGenerationService);
//# sourceMappingURL=pdf-generation.service.js.map