import { z } from 'zod';
declare const UpdateChannelDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
    privacy: z.ZodOptional<z.ZodEnum<{
        PUBLIC: "PUBLIC";
        PRIVATE: "PRIVATE";
    }>>;
}, z.core.$strip>, false>;
export declare class UpdateChannelDto extends UpdateChannelDto_base {
    name?: string;
    description?: string | null;
    privacy?: 'PUBLIC' | 'PRIVATE';
}
export {};
