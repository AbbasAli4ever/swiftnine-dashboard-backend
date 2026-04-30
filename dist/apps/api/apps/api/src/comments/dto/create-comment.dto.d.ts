declare const CreateCommentDto_base: any;
export declare class CreateCommentDto extends CreateCommentDto_base {
    content: string;
    parentId?: string;
    mentionedUserIds?: string[];
}
export {};
