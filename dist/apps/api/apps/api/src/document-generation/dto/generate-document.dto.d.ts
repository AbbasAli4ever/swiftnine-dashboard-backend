import { z } from 'zod';
export declare const GenerateDocumentSchema: z.ZodObject<{
    conversationId: z.ZodString;
    messageId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    fileName: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        heading: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        bullets: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const GenerateDocumentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    conversationId: z.ZodString;
    messageId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    fileName: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        heading: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        bullets: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>, false>;
export declare class GenerateDocumentDto extends GenerateDocumentDto_base {
    conversationId: string;
    messageId?: string;
    title: string;
    fileName?: string;
    sections: {
        heading?: string;
        body?: string;
        bullets?: string[];
    }[];
}
export type GenerateDocumentInput = z.output<typeof GenerateDocumentSchema>;
export {};
