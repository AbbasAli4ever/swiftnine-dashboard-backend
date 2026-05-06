import { z } from 'zod';
declare const MessageContextSchema: z.ZodObject<{
    messageId: z.ZodString;
    before: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
    after: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
}, z.core.$strip>;
declare const MessageContextDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    messageId: z.ZodString;
    before: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
    after: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
}, z.core.$strip>, false>;
export declare class MessageContextDto extends MessageContextDto_base {
}
export type MessageContextQuery = z.output<typeof MessageContextSchema>;
export {};
