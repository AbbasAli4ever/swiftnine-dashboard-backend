declare const AddChannelMemberDto_base: any;
export declare class AddChannelMemberDto extends AddChannelMemberDto_base {
    userId: string;
    role: 'admin' | 'member';
}
declare const BulkAddChannelMembersDto_base: any;
export declare class BulkAddChannelMembersDto extends BulkAddChannelMembersDto_base {
    members: AddChannelMemberDto[];
}
export {};
