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
exports.PptGenerationService = void 0;
const common_1 = require("@nestjs/common");
const pptxgenjs_1 = __importDefault(require("pptxgenjs"));
let PptGenerationService = class PptGenerationService {
    async render(input) {
        const pptx = new pptxgenjs_1.default();
        const titleSlide = pptx.addSlide();
        titleSlide.addText(input.title, {
            x: 0.5,
            y: 2,
            w: '90%',
            fontSize: 32,
            bold: true,
            align: 'center',
        });
        for (const section of input.sections) {
            const slide = pptx.addSlide();
            if (section.heading) {
                slide.addText(section.heading, { x: 0.5, y: 0.4, w: '90%', fontSize: 24, bold: true });
            }
            const bodyLines = section.bullets?.length
                ? section.bullets.map((text) => ({ text, options: { bullet: true, breakLine: true } }))
                : section.body
                    ? [{ text: section.body, options: { breakLine: true } }]
                    : [];
            if (bodyLines.length) {
                slide.addText(bodyLines, { x: 0.5, y: 1.3, w: '90%', h: '70%', fontSize: 16, valign: 'top' });
            }
        }
        const buffer = await pptx.write({ outputType: 'nodebuffer' });
        return buffer;
    }
};
exports.PptGenerationService = PptGenerationService;
exports.PptGenerationService = PptGenerationService = __decorate([
    (0, common_1.Injectable)()
], PptGenerationService);
//# sourceMappingURL=ppt-generation.service.js.map