import { z } from 'zod';
declare const CreateMessageDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    role: z.ZodEnum<{
        USER: "USER";
        ASSISTANT: "ASSISTANT";
    }>;
    content: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        COMPLETE: "COMPLETE";
        ABORTED: "ABORTED";
    }>>;
    title: z.ZodOptional<z.ZodString>;
    attachmentIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class CreateMessageDto extends CreateMessageDto_base {
}
export {};
