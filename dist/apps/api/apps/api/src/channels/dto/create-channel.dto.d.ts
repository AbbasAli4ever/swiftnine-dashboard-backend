import { z } from 'zod';
declare const CreateChannelDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    privacy: z.ZodOptional<z.ZodEnum<{
        PUBLIC: "PUBLIC";
        PRIVATE: "PRIVATE";
    }>>;
    projectId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateChannelDto extends CreateChannelDto_base {
    name: string;
    description?: string;
    privacy?: 'PUBLIC' | 'PRIVATE';
    projectId?: string;
}
export {};
