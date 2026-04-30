import { z } from 'zod';
declare const AddMemberDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        OWNER: "OWNER";
        MEMBER: "MEMBER";
    }>>;
}, z.core.$strip>, false>;
export declare class AddMemberDto extends AddMemberDto_base {
}
export {};
