import { z } from 'zod';
declare const CreateStatusDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    group: z.ZodEnum<{
        NOT_STARTED: "NOT_STARTED";
        ACTIVE: "ACTIVE";
        DONE: "DONE";
    }>;
}, z.core.$strip>, false>;
export declare class CreateStatusDto extends CreateStatusDto_base {
}
export {};
