import { z } from 'zod';
declare const InviteMemberDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    email: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        OWNER: "OWNER";
        MEMBER: "MEMBER";
    }>>;
}, z.core.$strip>, false>;
export declare class InviteMemberDto extends InviteMemberDto_base {
}
export {};
