import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MentionModel = runtime.Types.Result.DefaultSelection<Prisma.$MentionPayload>;
export type AggregateMention = {
    _count: MentionCountAggregateOutputType | null;
    _min: MentionMinAggregateOutputType | null;
    _max: MentionMaxAggregateOutputType | null;
};
export type MentionMinAggregateOutputType = {
    id: string | null;
    commentId: string | null;
    mentionedUserId: string | null;
    createdAt: Date | null;
};
export type MentionMaxAggregateOutputType = {
    id: string | null;
    commentId: string | null;
    mentionedUserId: string | null;
    createdAt: Date | null;
};
export type MentionCountAggregateOutputType = {
    id: number;
    commentId: number;
    mentionedUserId: number;
    createdAt: number;
    _all: number;
};
export type MentionMinAggregateInputType = {
    id?: true;
    commentId?: true;
    mentionedUserId?: true;
    createdAt?: true;
};
export type MentionMaxAggregateInputType = {
    id?: true;
    commentId?: true;
    mentionedUserId?: true;
    createdAt?: true;
};
export type MentionCountAggregateInputType = {
    id?: true;
    commentId?: true;
    mentionedUserId?: true;
    createdAt?: true;
    _all?: true;
};
export type MentionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentionWhereInput;
    orderBy?: Prisma.MentionOrderByWithRelationInput | Prisma.MentionOrderByWithRelationInput[];
    cursor?: Prisma.MentionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MentionCountAggregateInputType;
    _min?: MentionMinAggregateInputType;
    _max?: MentionMaxAggregateInputType;
};
export type GetMentionAggregateType<T extends MentionAggregateArgs> = {
    [P in keyof T & keyof AggregateMention]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMention[P]> : Prisma.GetScalarType<T[P], AggregateMention[P]>;
};
export type MentionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentionWhereInput;
    orderBy?: Prisma.MentionOrderByWithAggregationInput | Prisma.MentionOrderByWithAggregationInput[];
    by: Prisma.MentionScalarFieldEnum[] | Prisma.MentionScalarFieldEnum;
    having?: Prisma.MentionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MentionCountAggregateInputType | true;
    _min?: MentionMinAggregateInputType;
    _max?: MentionMaxAggregateInputType;
};
export type MentionGroupByOutputType = {
    id: string;
    commentId: string;
    mentionedUserId: string;
    createdAt: Date;
    _count: MentionCountAggregateOutputType | null;
    _min: MentionMinAggregateOutputType | null;
    _max: MentionMaxAggregateOutputType | null;
};
export type GetMentionGroupByPayload<T extends MentionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MentionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MentionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MentionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MentionGroupByOutputType[P]>;
}>>;
export type MentionWhereInput = {
    AND?: Prisma.MentionWhereInput | Prisma.MentionWhereInput[];
    OR?: Prisma.MentionWhereInput[];
    NOT?: Prisma.MentionWhereInput | Prisma.MentionWhereInput[];
    id?: Prisma.StringFilter<"Mention"> | string;
    commentId?: Prisma.StringFilter<"Mention"> | string;
    mentionedUserId?: Prisma.StringFilter<"Mention"> | string;
    createdAt?: Prisma.DateTimeFilter<"Mention"> | Date | string;
    comment?: Prisma.XOR<Prisma.CommentScalarRelationFilter, Prisma.CommentWhereInput>;
    mentionedUser?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type MentionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    comment?: Prisma.CommentOrderByWithRelationInput;
    mentionedUser?: Prisma.UserOrderByWithRelationInput;
};
export type MentionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    commentId_mentionedUserId?: Prisma.MentionCommentIdMentionedUserIdCompoundUniqueInput;
    AND?: Prisma.MentionWhereInput | Prisma.MentionWhereInput[];
    OR?: Prisma.MentionWhereInput[];
    NOT?: Prisma.MentionWhereInput | Prisma.MentionWhereInput[];
    commentId?: Prisma.StringFilter<"Mention"> | string;
    mentionedUserId?: Prisma.StringFilter<"Mention"> | string;
    createdAt?: Prisma.DateTimeFilter<"Mention"> | Date | string;
    comment?: Prisma.XOR<Prisma.CommentScalarRelationFilter, Prisma.CommentWhereInput>;
    mentionedUser?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "commentId_mentionedUserId">;
export type MentionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.MentionCountOrderByAggregateInput;
    _max?: Prisma.MentionMaxOrderByAggregateInput;
    _min?: Prisma.MentionMinOrderByAggregateInput;
};
export type MentionScalarWhereWithAggregatesInput = {
    AND?: Prisma.MentionScalarWhereWithAggregatesInput | Prisma.MentionScalarWhereWithAggregatesInput[];
    OR?: Prisma.MentionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MentionScalarWhereWithAggregatesInput | Prisma.MentionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Mention"> | string;
    commentId?: Prisma.StringWithAggregatesFilter<"Mention"> | string;
    mentionedUserId?: Prisma.StringWithAggregatesFilter<"Mention"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Mention"> | Date | string;
};
export type MentionCreateInput = {
    id?: string;
    createdAt?: Date | string;
    comment: Prisma.CommentCreateNestedOneWithoutMentionsInput;
    mentionedUser: Prisma.UserCreateNestedOneWithoutMentionsInput;
};
export type MentionUncheckedCreateInput = {
    id?: string;
    commentId: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type MentionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    comment?: Prisma.CommentUpdateOneRequiredWithoutMentionsNestedInput;
    mentionedUser?: Prisma.UserUpdateOneRequiredWithoutMentionsNestedInput;
};
export type MentionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentionCreateManyInput = {
    id?: string;
    commentId: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type MentionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentionListRelationFilter = {
    every?: Prisma.MentionWhereInput;
    some?: Prisma.MentionWhereInput;
    none?: Prisma.MentionWhereInput;
};
export type MentionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MentionCommentIdMentionedUserIdCompoundUniqueInput = {
    commentId: string;
    mentionedUserId: string;
};
export type MentionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MentionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MentionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MentionCreateNestedManyWithoutMentionedUserInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutMentionedUserInput, Prisma.MentionUncheckedCreateWithoutMentionedUserInput> | Prisma.MentionCreateWithoutMentionedUserInput[] | Prisma.MentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutMentionedUserInput | Prisma.MentionCreateOrConnectWithoutMentionedUserInput[];
    createMany?: Prisma.MentionCreateManyMentionedUserInputEnvelope;
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
};
export type MentionUncheckedCreateNestedManyWithoutMentionedUserInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutMentionedUserInput, Prisma.MentionUncheckedCreateWithoutMentionedUserInput> | Prisma.MentionCreateWithoutMentionedUserInput[] | Prisma.MentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutMentionedUserInput | Prisma.MentionCreateOrConnectWithoutMentionedUserInput[];
    createMany?: Prisma.MentionCreateManyMentionedUserInputEnvelope;
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
};
export type MentionUpdateManyWithoutMentionedUserNestedInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutMentionedUserInput, Prisma.MentionUncheckedCreateWithoutMentionedUserInput> | Prisma.MentionCreateWithoutMentionedUserInput[] | Prisma.MentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutMentionedUserInput | Prisma.MentionCreateOrConnectWithoutMentionedUserInput[];
    upsert?: Prisma.MentionUpsertWithWhereUniqueWithoutMentionedUserInput | Prisma.MentionUpsertWithWhereUniqueWithoutMentionedUserInput[];
    createMany?: Prisma.MentionCreateManyMentionedUserInputEnvelope;
    set?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    disconnect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    delete?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    update?: Prisma.MentionUpdateWithWhereUniqueWithoutMentionedUserInput | Prisma.MentionUpdateWithWhereUniqueWithoutMentionedUserInput[];
    updateMany?: Prisma.MentionUpdateManyWithWhereWithoutMentionedUserInput | Prisma.MentionUpdateManyWithWhereWithoutMentionedUserInput[];
    deleteMany?: Prisma.MentionScalarWhereInput | Prisma.MentionScalarWhereInput[];
};
export type MentionUncheckedUpdateManyWithoutMentionedUserNestedInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutMentionedUserInput, Prisma.MentionUncheckedCreateWithoutMentionedUserInput> | Prisma.MentionCreateWithoutMentionedUserInput[] | Prisma.MentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutMentionedUserInput | Prisma.MentionCreateOrConnectWithoutMentionedUserInput[];
    upsert?: Prisma.MentionUpsertWithWhereUniqueWithoutMentionedUserInput | Prisma.MentionUpsertWithWhereUniqueWithoutMentionedUserInput[];
    createMany?: Prisma.MentionCreateManyMentionedUserInputEnvelope;
    set?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    disconnect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    delete?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    update?: Prisma.MentionUpdateWithWhereUniqueWithoutMentionedUserInput | Prisma.MentionUpdateWithWhereUniqueWithoutMentionedUserInput[];
    updateMany?: Prisma.MentionUpdateManyWithWhereWithoutMentionedUserInput | Prisma.MentionUpdateManyWithWhereWithoutMentionedUserInput[];
    deleteMany?: Prisma.MentionScalarWhereInput | Prisma.MentionScalarWhereInput[];
};
export type MentionCreateNestedManyWithoutCommentInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutCommentInput, Prisma.MentionUncheckedCreateWithoutCommentInput> | Prisma.MentionCreateWithoutCommentInput[] | Prisma.MentionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutCommentInput | Prisma.MentionCreateOrConnectWithoutCommentInput[];
    createMany?: Prisma.MentionCreateManyCommentInputEnvelope;
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
};
export type MentionUncheckedCreateNestedManyWithoutCommentInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutCommentInput, Prisma.MentionUncheckedCreateWithoutCommentInput> | Prisma.MentionCreateWithoutCommentInput[] | Prisma.MentionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutCommentInput | Prisma.MentionCreateOrConnectWithoutCommentInput[];
    createMany?: Prisma.MentionCreateManyCommentInputEnvelope;
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
};
export type MentionUpdateManyWithoutCommentNestedInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutCommentInput, Prisma.MentionUncheckedCreateWithoutCommentInput> | Prisma.MentionCreateWithoutCommentInput[] | Prisma.MentionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutCommentInput | Prisma.MentionCreateOrConnectWithoutCommentInput[];
    upsert?: Prisma.MentionUpsertWithWhereUniqueWithoutCommentInput | Prisma.MentionUpsertWithWhereUniqueWithoutCommentInput[];
    createMany?: Prisma.MentionCreateManyCommentInputEnvelope;
    set?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    disconnect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    delete?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    update?: Prisma.MentionUpdateWithWhereUniqueWithoutCommentInput | Prisma.MentionUpdateWithWhereUniqueWithoutCommentInput[];
    updateMany?: Prisma.MentionUpdateManyWithWhereWithoutCommentInput | Prisma.MentionUpdateManyWithWhereWithoutCommentInput[];
    deleteMany?: Prisma.MentionScalarWhereInput | Prisma.MentionScalarWhereInput[];
};
export type MentionUncheckedUpdateManyWithoutCommentNestedInput = {
    create?: Prisma.XOR<Prisma.MentionCreateWithoutCommentInput, Prisma.MentionUncheckedCreateWithoutCommentInput> | Prisma.MentionCreateWithoutCommentInput[] | Prisma.MentionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.MentionCreateOrConnectWithoutCommentInput | Prisma.MentionCreateOrConnectWithoutCommentInput[];
    upsert?: Prisma.MentionUpsertWithWhereUniqueWithoutCommentInput | Prisma.MentionUpsertWithWhereUniqueWithoutCommentInput[];
    createMany?: Prisma.MentionCreateManyCommentInputEnvelope;
    set?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    disconnect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    delete?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    connect?: Prisma.MentionWhereUniqueInput | Prisma.MentionWhereUniqueInput[];
    update?: Prisma.MentionUpdateWithWhereUniqueWithoutCommentInput | Prisma.MentionUpdateWithWhereUniqueWithoutCommentInput[];
    updateMany?: Prisma.MentionUpdateManyWithWhereWithoutCommentInput | Prisma.MentionUpdateManyWithWhereWithoutCommentInput[];
    deleteMany?: Prisma.MentionScalarWhereInput | Prisma.MentionScalarWhereInput[];
};
export type MentionCreateWithoutMentionedUserInput = {
    id?: string;
    createdAt?: Date | string;
    comment: Prisma.CommentCreateNestedOneWithoutMentionsInput;
};
export type MentionUncheckedCreateWithoutMentionedUserInput = {
    id?: string;
    commentId: string;
    createdAt?: Date | string;
};
export type MentionCreateOrConnectWithoutMentionedUserInput = {
    where: Prisma.MentionWhereUniqueInput;
    create: Prisma.XOR<Prisma.MentionCreateWithoutMentionedUserInput, Prisma.MentionUncheckedCreateWithoutMentionedUserInput>;
};
export type MentionCreateManyMentionedUserInputEnvelope = {
    data: Prisma.MentionCreateManyMentionedUserInput | Prisma.MentionCreateManyMentionedUserInput[];
    skipDuplicates?: boolean;
};
export type MentionUpsertWithWhereUniqueWithoutMentionedUserInput = {
    where: Prisma.MentionWhereUniqueInput;
    update: Prisma.XOR<Prisma.MentionUpdateWithoutMentionedUserInput, Prisma.MentionUncheckedUpdateWithoutMentionedUserInput>;
    create: Prisma.XOR<Prisma.MentionCreateWithoutMentionedUserInput, Prisma.MentionUncheckedCreateWithoutMentionedUserInput>;
};
export type MentionUpdateWithWhereUniqueWithoutMentionedUserInput = {
    where: Prisma.MentionWhereUniqueInput;
    data: Prisma.XOR<Prisma.MentionUpdateWithoutMentionedUserInput, Prisma.MentionUncheckedUpdateWithoutMentionedUserInput>;
};
export type MentionUpdateManyWithWhereWithoutMentionedUserInput = {
    where: Prisma.MentionScalarWhereInput;
    data: Prisma.XOR<Prisma.MentionUpdateManyMutationInput, Prisma.MentionUncheckedUpdateManyWithoutMentionedUserInput>;
};
export type MentionScalarWhereInput = {
    AND?: Prisma.MentionScalarWhereInput | Prisma.MentionScalarWhereInput[];
    OR?: Prisma.MentionScalarWhereInput[];
    NOT?: Prisma.MentionScalarWhereInput | Prisma.MentionScalarWhereInput[];
    id?: Prisma.StringFilter<"Mention"> | string;
    commentId?: Prisma.StringFilter<"Mention"> | string;
    mentionedUserId?: Prisma.StringFilter<"Mention"> | string;
    createdAt?: Prisma.DateTimeFilter<"Mention"> | Date | string;
};
export type MentionCreateWithoutCommentInput = {
    id?: string;
    createdAt?: Date | string;
    mentionedUser: Prisma.UserCreateNestedOneWithoutMentionsInput;
};
export type MentionUncheckedCreateWithoutCommentInput = {
    id?: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type MentionCreateOrConnectWithoutCommentInput = {
    where: Prisma.MentionWhereUniqueInput;
    create: Prisma.XOR<Prisma.MentionCreateWithoutCommentInput, Prisma.MentionUncheckedCreateWithoutCommentInput>;
};
export type MentionCreateManyCommentInputEnvelope = {
    data: Prisma.MentionCreateManyCommentInput | Prisma.MentionCreateManyCommentInput[];
    skipDuplicates?: boolean;
};
export type MentionUpsertWithWhereUniqueWithoutCommentInput = {
    where: Prisma.MentionWhereUniqueInput;
    update: Prisma.XOR<Prisma.MentionUpdateWithoutCommentInput, Prisma.MentionUncheckedUpdateWithoutCommentInput>;
    create: Prisma.XOR<Prisma.MentionCreateWithoutCommentInput, Prisma.MentionUncheckedCreateWithoutCommentInput>;
};
export type MentionUpdateWithWhereUniqueWithoutCommentInput = {
    where: Prisma.MentionWhereUniqueInput;
    data: Prisma.XOR<Prisma.MentionUpdateWithoutCommentInput, Prisma.MentionUncheckedUpdateWithoutCommentInput>;
};
export type MentionUpdateManyWithWhereWithoutCommentInput = {
    where: Prisma.MentionScalarWhereInput;
    data: Prisma.XOR<Prisma.MentionUpdateManyMutationInput, Prisma.MentionUncheckedUpdateManyWithoutCommentInput>;
};
export type MentionCreateManyMentionedUserInput = {
    id?: string;
    commentId: string;
    createdAt?: Date | string;
};
export type MentionUpdateWithoutMentionedUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    comment?: Prisma.CommentUpdateOneRequiredWithoutMentionsNestedInput;
};
export type MentionUncheckedUpdateWithoutMentionedUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentionUncheckedUpdateManyWithoutMentionedUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentionCreateManyCommentInput = {
    id?: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type MentionUpdateWithoutCommentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mentionedUser?: Prisma.UserUpdateOneRequiredWithoutMentionsNestedInput;
};
export type MentionUncheckedUpdateWithoutCommentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentionUncheckedUpdateManyWithoutCommentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commentId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mention"]>;
export type MentionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commentId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mention"]>;
export type MentionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commentId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mention"]>;
export type MentionSelectScalar = {
    id?: boolean;
    commentId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
};
export type MentionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "commentId" | "mentionedUserId" | "createdAt", ExtArgs["result"]["mention"]>;
export type MentionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type MentionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type MentionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $MentionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Mention";
    objects: {
        comment: Prisma.$CommentPayload<ExtArgs>;
        mentionedUser: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        commentId: string;
        mentionedUserId: string;
        createdAt: Date;
    }, ExtArgs["result"]["mention"]>;
    composites: {};
};
export type MentionGetPayload<S extends boolean | null | undefined | MentionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MentionPayload, S>;
export type MentionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MentionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MentionCountAggregateInputType | true;
};
export interface MentionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Mention'];
        meta: {
            name: 'Mention';
        };
    };
    findUnique<T extends MentionFindUniqueArgs>(args: Prisma.SelectSubset<T, MentionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MentionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MentionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MentionFindFirstArgs>(args?: Prisma.SelectSubset<T, MentionFindFirstArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MentionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MentionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MentionFindManyArgs>(args?: Prisma.SelectSubset<T, MentionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MentionCreateArgs>(args: Prisma.SelectSubset<T, MentionCreateArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MentionCreateManyArgs>(args?: Prisma.SelectSubset<T, MentionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MentionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MentionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MentionDeleteArgs>(args: Prisma.SelectSubset<T, MentionDeleteArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MentionUpdateArgs>(args: Prisma.SelectSubset<T, MentionUpdateArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MentionDeleteManyArgs>(args?: Prisma.SelectSubset<T, MentionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MentionUpdateManyArgs>(args: Prisma.SelectSubset<T, MentionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MentionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MentionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MentionUpsertArgs>(args: Prisma.SelectSubset<T, MentionUpsertArgs<ExtArgs>>): Prisma.Prisma__MentionClient<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MentionCountArgs>(args?: Prisma.Subset<T, MentionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MentionCountAggregateOutputType> : number>;
    aggregate<T extends MentionAggregateArgs>(args: Prisma.Subset<T, MentionAggregateArgs>): Prisma.PrismaPromise<GetMentionAggregateType<T>>;
    groupBy<T extends MentionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MentionGroupByArgs['orderBy'];
    } : {
        orderBy?: MentionGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MentionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMentionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MentionFieldRefs;
}
export interface Prisma__MentionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    comment<T extends Prisma.CommentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CommentDefaultArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    mentionedUser<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MentionFieldRefs {
    readonly id: Prisma.FieldRef<"Mention", 'String'>;
    readonly commentId: Prisma.FieldRef<"Mention", 'String'>;
    readonly mentionedUserId: Prisma.FieldRef<"Mention", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Mention", 'DateTime'>;
}
export type MentionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where: Prisma.MentionWhereUniqueInput;
};
export type MentionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where: Prisma.MentionWhereUniqueInput;
};
export type MentionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where?: Prisma.MentionWhereInput;
    orderBy?: Prisma.MentionOrderByWithRelationInput | Prisma.MentionOrderByWithRelationInput[];
    cursor?: Prisma.MentionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MentionScalarFieldEnum | Prisma.MentionScalarFieldEnum[];
};
export type MentionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where?: Prisma.MentionWhereInput;
    orderBy?: Prisma.MentionOrderByWithRelationInput | Prisma.MentionOrderByWithRelationInput[];
    cursor?: Prisma.MentionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MentionScalarFieldEnum | Prisma.MentionScalarFieldEnum[];
};
export type MentionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where?: Prisma.MentionWhereInput;
    orderBy?: Prisma.MentionOrderByWithRelationInput | Prisma.MentionOrderByWithRelationInput[];
    cursor?: Prisma.MentionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MentionScalarFieldEnum | Prisma.MentionScalarFieldEnum[];
};
export type MentionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MentionCreateInput, Prisma.MentionUncheckedCreateInput>;
};
export type MentionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MentionCreateManyInput | Prisma.MentionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MentionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    data: Prisma.MentionCreateManyInput | Prisma.MentionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MentionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MentionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MentionUpdateInput, Prisma.MentionUncheckedUpdateInput>;
    where: Prisma.MentionWhereUniqueInput;
};
export type MentionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MentionUpdateManyMutationInput, Prisma.MentionUncheckedUpdateManyInput>;
    where?: Prisma.MentionWhereInput;
    limit?: number;
};
export type MentionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MentionUpdateManyMutationInput, Prisma.MentionUncheckedUpdateManyInput>;
    where?: Prisma.MentionWhereInput;
    limit?: number;
    include?: Prisma.MentionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MentionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where: Prisma.MentionWhereUniqueInput;
    create: Prisma.XOR<Prisma.MentionCreateInput, Prisma.MentionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MentionUpdateInput, Prisma.MentionUncheckedUpdateInput>;
};
export type MentionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where: Prisma.MentionWhereUniqueInput;
};
export type MentionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentionWhereInput;
    limit?: number;
};
export type MentionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
};
