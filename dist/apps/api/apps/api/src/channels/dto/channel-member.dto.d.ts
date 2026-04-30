import { z } from 'zod';
declare const AddChannelMemberDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<{
        member: "member";
        admin: "admin";
    }>;
}, z.core.$strip>, false>;
export declare class AddChannelMemberDto extends AddChannelMemberDto_base {
    userId: string;
    role: 'admin' | 'member';
}
declare const BulkAddChannelMembersDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    members: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        role: z.ZodEnum<{
            member: "member";
            admin: "admin";
        }>;
    }, z.core.$strip>>;
}, z.core.$strip>, false>;
export declare class BulkAddChannelMembersDto extends BulkAddChannelMembersDto_base {
    members: AddChannelMemberDto[];
}
export {};
