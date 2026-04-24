import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ReactionModel = runtime.Types.Result.DefaultSelection<Prisma.$ReactionPayload>;
export type AggregateReaction = {
    _count: ReactionCountAggregateOutputType | null;
    _min: ReactionMinAggregateOutputType | null;
    _max: ReactionMaxAggregateOutputType | null;
};
export type ReactionMinAggregateOutputType = {
    id: string | null;
    commentId: string | null;
    memberId: string | null;
    reactFace: string | null;
    createdAt: Date | null;
};
export type ReactionMaxAggregateOutputType = {
    id: string | null;
    commentId: string | null;
    memberId: string | null;
    reactFace: string | null;
    createdAt: Date | null;
};
export type ReactionCountAggregateOutputType = {
    id: number;
    commentId: number;
    memberId: number;
    reactFace: number;
    createdAt: number;
    _all: number;
};
export type ReactionMinAggregateInputType = {
    id?: true;
    commentId?: true;
    memberId?: true;
    reactFace?: true;
    createdAt?: true;
};
export type ReactionMaxAggregateInputType = {
    id?: true;
    commentId?: true;
    memberId?: true;
    reactFace?: true;
    createdAt?: true;
};
export type ReactionCountAggregateInputType = {
    id?: true;
    commentId?: true;
    memberId?: true;
    reactFace?: true;
    createdAt?: true;
    _all?: true;
};
export type ReactionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithRelationInput | Prisma.ReactionOrderByWithRelationInput[];
    cursor?: Prisma.ReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ReactionCountAggregateInputType;
    _min?: ReactionMinAggregateInputType;
    _max?: ReactionMaxAggregateInputType;
};
export type GetReactionAggregateType<T extends ReactionAggregateArgs> = {
    [P in keyof T & keyof AggregateReaction]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReaction[P]> : Prisma.GetScalarType<T[P], AggregateReaction[P]>;
};
export type ReactionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithAggregationInput | Prisma.ReactionOrderByWithAggregationInput[];
    by: Prisma.ReactionScalarFieldEnum[] | Prisma.ReactionScalarFieldEnum;
    having?: Prisma.ReactionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReactionCountAggregateInputType | true;
    _min?: ReactionMinAggregateInputType;
    _max?: ReactionMaxAggregateInputType;
};
export type ReactionGroupByOutputType = {
    id: string;
    commentId: string;
    memberId: string;
    reactFace: string;
    createdAt: Date;
    _count: ReactionCountAggregateOutputType | null;
    _min: ReactionMinAggregateOutputType | null;
    _max: ReactionMaxAggregateOutputType | null;
};
export type GetReactionGroupByPayload<T extends ReactionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReactionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReactionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReactionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReactionGroupByOutputType[P]>;
}>>;
export type ReactionWhereInput = {
    AND?: Prisma.ReactionWhereInput | Prisma.ReactionWhereInput[];
    OR?: Prisma.ReactionWhereInput[];
    NOT?: Prisma.ReactionWhereInput | Prisma.ReactionWhereInput[];
    id?: Prisma.StringFilter<"Reaction"> | string;
    commentId?: Prisma.StringFilter<"Reaction"> | string;
    memberId?: Prisma.StringFilter<"Reaction"> | string;
    reactFace?: Prisma.StringFilter<"Reaction"> | string;
    createdAt?: Prisma.DateTimeFilter<"Reaction"> | Date | string;
    comment?: Prisma.XOR<Prisma.CommentScalarRelationFilter, Prisma.CommentWhereInput>;
    member?: Prisma.XOR<Prisma.WorkspaceMemberScalarRelationFilter, Prisma.WorkspaceMemberWhereInput>;
};
export type ReactionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    reactFace?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    comment?: Prisma.CommentOrderByWithRelationInput;
    member?: Prisma.WorkspaceMemberOrderByWithRelationInput;
};
export type ReactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ReactionWhereInput | Prisma.ReactionWhereInput[];
    OR?: Prisma.ReactionWhereInput[];
    NOT?: Prisma.ReactionWhereInput | Prisma.ReactionWhereInput[];
    commentId?: Prisma.StringFilter<"Reaction"> | string;
    memberId?: Prisma.StringFilter<"Reaction"> | string;
    reactFace?: Prisma.StringFilter<"Reaction"> | string;
    createdAt?: Prisma.DateTimeFilter<"Reaction"> | Date | string;
    comment?: Prisma.XOR<Prisma.CommentScalarRelationFilter, Prisma.CommentWhereInput>;
    member?: Prisma.XOR<Prisma.WorkspaceMemberScalarRelationFilter, Prisma.WorkspaceMemberWhereInput>;
}, "id">;
export type ReactionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    reactFace?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ReactionCountOrderByAggregateInput;
    _max?: Prisma.ReactionMaxOrderByAggregateInput;
    _min?: Prisma.ReactionMinOrderByAggregateInput;
};
export type ReactionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReactionScalarWhereWithAggregatesInput | Prisma.ReactionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReactionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReactionScalarWhereWithAggregatesInput | Prisma.ReactionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Reaction"> | string;
    commentId?: Prisma.StringWithAggregatesFilter<"Reaction"> | string;
    memberId?: Prisma.StringWithAggregatesFilter<"Reaction"> | string;
    reactFace?: Prisma.StringWithAggregatesFilter<"Reaction"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Reaction"> | Date | string;
};
export type ReactionCreateInput = {
    id?: string;
    reactFace?: string;
    createdAt?: Date | string;
    comment: Prisma.CommentCreateNestedOneWithoutReactionsInput;
    member: Prisma.WorkspaceMemberCreateNestedOneWithoutReactionsInput;
};
export type ReactionUncheckedCreateInput = {
    id?: string;
    commentId: string;
    memberId: string;
    reactFace?: string;
    createdAt?: Date | string;
};
export type ReactionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    comment?: Prisma.CommentUpdateOneRequiredWithoutReactionsNestedInput;
    member?: Prisma.WorkspaceMemberUpdateOneRequiredWithoutReactionsNestedInput;
};
export type ReactionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    memberId?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReactionCreateManyInput = {
    id?: string;
    commentId: string;
    memberId: string;
    reactFace?: string;
    createdAt?: Date | string;
};
export type ReactionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReactionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    memberId?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReactionListRelationFilter = {
    every?: Prisma.ReactionWhereInput;
    some?: Prisma.ReactionWhereInput;
    none?: Prisma.ReactionWhereInput;
};
export type ReactionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReactionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    reactFace?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReactionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    reactFace?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReactionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    commentId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    reactFace?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ReactionCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutMemberInput, Prisma.ReactionUncheckedCreateWithoutMemberInput> | Prisma.ReactionCreateWithoutMemberInput[] | Prisma.ReactionUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutMemberInput | Prisma.ReactionCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.ReactionCreateManyMemberInputEnvelope;
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
};
export type ReactionUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutMemberInput, Prisma.ReactionUncheckedCreateWithoutMemberInput> | Prisma.ReactionCreateWithoutMemberInput[] | Prisma.ReactionUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutMemberInput | Prisma.ReactionCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.ReactionCreateManyMemberInputEnvelope;
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
};
export type ReactionUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutMemberInput, Prisma.ReactionUncheckedCreateWithoutMemberInput> | Prisma.ReactionCreateWithoutMemberInput[] | Prisma.ReactionUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutMemberInput | Prisma.ReactionCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.ReactionUpsertWithWhereUniqueWithoutMemberInput | Prisma.ReactionUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.ReactionCreateManyMemberInputEnvelope;
    set?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    disconnect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    delete?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    update?: Prisma.ReactionUpdateWithWhereUniqueWithoutMemberInput | Prisma.ReactionUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.ReactionUpdateManyWithWhereWithoutMemberInput | Prisma.ReactionUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.ReactionScalarWhereInput | Prisma.ReactionScalarWhereInput[];
};
export type ReactionUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutMemberInput, Prisma.ReactionUncheckedCreateWithoutMemberInput> | Prisma.ReactionCreateWithoutMemberInput[] | Prisma.ReactionUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutMemberInput | Prisma.ReactionCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.ReactionUpsertWithWhereUniqueWithoutMemberInput | Prisma.ReactionUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.ReactionCreateManyMemberInputEnvelope;
    set?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    disconnect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    delete?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    update?: Prisma.ReactionUpdateWithWhereUniqueWithoutMemberInput | Prisma.ReactionUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.ReactionUpdateManyWithWhereWithoutMemberInput | Prisma.ReactionUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.ReactionScalarWhereInput | Prisma.ReactionScalarWhereInput[];
};
export type ReactionCreateNestedManyWithoutCommentInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutCommentInput, Prisma.ReactionUncheckedCreateWithoutCommentInput> | Prisma.ReactionCreateWithoutCommentInput[] | Prisma.ReactionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutCommentInput | Prisma.ReactionCreateOrConnectWithoutCommentInput[];
    createMany?: Prisma.ReactionCreateManyCommentInputEnvelope;
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
};
export type ReactionUncheckedCreateNestedManyWithoutCommentInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutCommentInput, Prisma.ReactionUncheckedCreateWithoutCommentInput> | Prisma.ReactionCreateWithoutCommentInput[] | Prisma.ReactionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutCommentInput | Prisma.ReactionCreateOrConnectWithoutCommentInput[];
    createMany?: Prisma.ReactionCreateManyCommentInputEnvelope;
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
};
export type ReactionUpdateManyWithoutCommentNestedInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutCommentInput, Prisma.ReactionUncheckedCreateWithoutCommentInput> | Prisma.ReactionCreateWithoutCommentInput[] | Prisma.ReactionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutCommentInput | Prisma.ReactionCreateOrConnectWithoutCommentInput[];
    upsert?: Prisma.ReactionUpsertWithWhereUniqueWithoutCommentInput | Prisma.ReactionUpsertWithWhereUniqueWithoutCommentInput[];
    createMany?: Prisma.ReactionCreateManyCommentInputEnvelope;
    set?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    disconnect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    delete?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    update?: Prisma.ReactionUpdateWithWhereUniqueWithoutCommentInput | Prisma.ReactionUpdateWithWhereUniqueWithoutCommentInput[];
    updateMany?: Prisma.ReactionUpdateManyWithWhereWithoutCommentInput | Prisma.ReactionUpdateManyWithWhereWithoutCommentInput[];
    deleteMany?: Prisma.ReactionScalarWhereInput | Prisma.ReactionScalarWhereInput[];
};
export type ReactionUncheckedUpdateManyWithoutCommentNestedInput = {
    create?: Prisma.XOR<Prisma.ReactionCreateWithoutCommentInput, Prisma.ReactionUncheckedCreateWithoutCommentInput> | Prisma.ReactionCreateWithoutCommentInput[] | Prisma.ReactionUncheckedCreateWithoutCommentInput[];
    connectOrCreate?: Prisma.ReactionCreateOrConnectWithoutCommentInput | Prisma.ReactionCreateOrConnectWithoutCommentInput[];
    upsert?: Prisma.ReactionUpsertWithWhereUniqueWithoutCommentInput | Prisma.ReactionUpsertWithWhereUniqueWithoutCommentInput[];
    createMany?: Prisma.ReactionCreateManyCommentInputEnvelope;
    set?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    disconnect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    delete?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    connect?: Prisma.ReactionWhereUniqueInput | Prisma.ReactionWhereUniqueInput[];
    update?: Prisma.ReactionUpdateWithWhereUniqueWithoutCommentInput | Prisma.ReactionUpdateWithWhereUniqueWithoutCommentInput[];
    updateMany?: Prisma.ReactionUpdateManyWithWhereWithoutCommentInput | Prisma.ReactionUpdateManyWithWhereWithoutCommentInput[];
    deleteMany?: Prisma.ReactionScalarWhereInput | Prisma.ReactionScalarWhereInput[];
};
export type ReactionCreateWithoutMemberInput = {
    id?: string;
    reactFace?: string;
    createdAt?: Date | string;
    comment: Prisma.CommentCreateNestedOneWithoutReactionsInput;
};
export type ReactionUncheckedCreateWithoutMemberInput = {
    id?: string;
    commentId: string;
    reactFace?: string;
    createdAt?: Date | string;
};
export type ReactionCreateOrConnectWithoutMemberInput = {
    where: Prisma.ReactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReactionCreateWithoutMemberInput, Prisma.ReactionUncheckedCreateWithoutMemberInput>;
};
export type ReactionCreateManyMemberInputEnvelope = {
    data: Prisma.ReactionCreateManyMemberInput | Prisma.ReactionCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type ReactionUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.ReactionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReactionUpdateWithoutMemberInput, Prisma.ReactionUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.ReactionCreateWithoutMemberInput, Prisma.ReactionUncheckedCreateWithoutMemberInput>;
};
export type ReactionUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.ReactionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReactionUpdateWithoutMemberInput, Prisma.ReactionUncheckedUpdateWithoutMemberInput>;
};
export type ReactionUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.ReactionScalarWhereInput;
    data: Prisma.XOR<Prisma.ReactionUpdateManyMutationInput, Prisma.ReactionUncheckedUpdateManyWithoutMemberInput>;
};
export type ReactionScalarWhereInput = {
    AND?: Prisma.ReactionScalarWhereInput | Prisma.ReactionScalarWhereInput[];
    OR?: Prisma.ReactionScalarWhereInput[];
    NOT?: Prisma.ReactionScalarWhereInput | Prisma.ReactionScalarWhereInput[];
    id?: Prisma.StringFilter<"Reaction"> | string;
    commentId?: Prisma.StringFilter<"Reaction"> | string;
    memberId?: Prisma.StringFilter<"Reaction"> | string;
    reactFace?: Prisma.StringFilter<"Reaction"> | string;
    createdAt?: Prisma.DateTimeFilter<"Reaction"> | Date | string;
};
export type ReactionCreateWithoutCommentInput = {
    id?: string;
    reactFace?: string;
    createdAt?: Date | string;
    member: Prisma.WorkspaceMemberCreateNestedOneWithoutReactionsInput;
};
export type ReactionUncheckedCreateWithoutCommentInput = {
    id?: string;
    memberId: string;
    reactFace?: string;
    createdAt?: Date | string;
};
export type ReactionCreateOrConnectWithoutCommentInput = {
    where: Prisma.ReactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReactionCreateWithoutCommentInput, Prisma.ReactionUncheckedCreateWithoutCommentInput>;
};
export type ReactionCreateManyCommentInputEnvelope = {
    data: Prisma.ReactionCreateManyCommentInput | Prisma.ReactionCreateManyCommentInput[];
    skipDuplicates?: boolean;
};
export type ReactionUpsertWithWhereUniqueWithoutCommentInput = {
    where: Prisma.ReactionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReactionUpdateWithoutCommentInput, Prisma.ReactionUncheckedUpdateWithoutCommentInput>;
    create: Prisma.XOR<Prisma.ReactionCreateWithoutCommentInput, Prisma.ReactionUncheckedCreateWithoutCommentInput>;
};
export type ReactionUpdateWithWhereUniqueWithoutCommentInput = {
    where: Prisma.ReactionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReactionUpdateWithoutCommentInput, Prisma.ReactionUncheckedUpdateWithoutCommentInput>;
};
export type ReactionUpdateManyWithWhereWithoutCommentInput = {
    where: Prisma.ReactionScalarWhereInput;
    data: Prisma.XOR<Prisma.ReactionUpdateManyMutationInput, Prisma.ReactionUncheckedUpdateManyWithoutCommentInput>;
};
export type ReactionCreateManyMemberInput = {
    id?: string;
    commentId: string;
    reactFace?: string;
    createdAt?: Date | string;
};
export type ReactionUpdateWithoutMemberInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    comment?: Prisma.CommentUpdateOneRequiredWithoutReactionsNestedInput;
};
export type ReactionUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReactionUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    commentId?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReactionCreateManyCommentInput = {
    id?: string;
    memberId: string;
    reactFace?: string;
    createdAt?: Date | string;
};
export type ReactionUpdateWithoutCommentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    member?: Prisma.WorkspaceMemberUpdateOneRequiredWithoutReactionsNestedInput;
};
export type ReactionUncheckedUpdateWithoutCommentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    memberId?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReactionUncheckedUpdateManyWithoutCommentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    memberId?: Prisma.StringFieldUpdateOperationsInput | string;
    reactFace?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReactionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commentId?: boolean;
    memberId?: boolean;
    reactFace?: boolean;
    createdAt?: boolean;
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.WorkspaceMemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reaction"]>;
export type ReactionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commentId?: boolean;
    memberId?: boolean;
    reactFace?: boolean;
    createdAt?: boolean;
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.WorkspaceMemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reaction"]>;
export type ReactionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    commentId?: boolean;
    memberId?: boolean;
    reactFace?: boolean;
    createdAt?: boolean;
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.WorkspaceMemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reaction"]>;
export type ReactionSelectScalar = {
    id?: boolean;
    commentId?: boolean;
    memberId?: boolean;
    reactFace?: boolean;
    createdAt?: boolean;
};
export type ReactionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "commentId" | "memberId" | "reactFace" | "createdAt", ExtArgs["result"]["reaction"]>;
export type ReactionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.WorkspaceMemberDefaultArgs<ExtArgs>;
};
export type ReactionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.WorkspaceMemberDefaultArgs<ExtArgs>;
};
export type ReactionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    comment?: boolean | Prisma.CommentDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.WorkspaceMemberDefaultArgs<ExtArgs>;
};
export type $ReactionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Reaction";
    objects: {
        comment: Prisma.$CommentPayload<ExtArgs>;
        member: Prisma.$WorkspaceMemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        commentId: string;
        memberId: string;
        reactFace: string;
        createdAt: Date;
    }, ExtArgs["result"]["reaction"]>;
    composites: {};
};
export type ReactionGetPayload<S extends boolean | null | undefined | ReactionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReactionPayload, S>;
export type ReactionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReactionCountAggregateInputType | true;
};
export interface ReactionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Reaction'];
        meta: {
            name: 'Reaction';
        };
    };
    findUnique<T extends ReactionFindUniqueArgs>(args: Prisma.SelectSubset<T, ReactionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ReactionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ReactionFindFirstArgs>(args?: Prisma.SelectSubset<T, ReactionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ReactionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReactionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ReactionFindManyArgs>(args?: Prisma.SelectSubset<T, ReactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ReactionCreateArgs>(args: Prisma.SelectSubset<T, ReactionCreateArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ReactionCreateManyArgs>(args?: Prisma.SelectSubset<T, ReactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ReactionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ReactionDeleteArgs>(args: Prisma.SelectSubset<T, ReactionDeleteArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ReactionUpdateArgs>(args: Prisma.SelectSubset<T, ReactionUpdateArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ReactionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ReactionUpdateManyArgs>(args: Prisma.SelectSubset<T, ReactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ReactionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ReactionUpsertArgs>(args: Prisma.SelectSubset<T, ReactionUpsertArgs<ExtArgs>>): Prisma.Prisma__ReactionClient<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ReactionCountArgs>(args?: Prisma.Subset<T, ReactionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReactionCountAggregateOutputType> : number>;
    aggregate<T extends ReactionAggregateArgs>(args: Prisma.Subset<T, ReactionAggregateArgs>): Prisma.PrismaPromise<GetReactionAggregateType<T>>;
    groupBy<T extends ReactionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReactionGroupByArgs['orderBy'];
    } : {
        orderBy?: ReactionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ReactionFieldRefs;
}
export interface Prisma__ReactionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    comment<T extends Prisma.CommentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CommentDefaultArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    member<T extends Prisma.WorkspaceMemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceMemberDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ReactionFieldRefs {
    readonly id: Prisma.FieldRef<"Reaction", 'String'>;
    readonly commentId: Prisma.FieldRef<"Reaction", 'String'>;
    readonly memberId: Prisma.FieldRef<"Reaction", 'String'>;
    readonly reactFace: Prisma.FieldRef<"Reaction", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Reaction", 'DateTime'>;
}
export type ReactionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where: Prisma.ReactionWhereUniqueInput;
};
export type ReactionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where: Prisma.ReactionWhereUniqueInput;
};
export type ReactionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithRelationInput | Prisma.ReactionOrderByWithRelationInput[];
    cursor?: Prisma.ReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReactionScalarFieldEnum | Prisma.ReactionScalarFieldEnum[];
};
export type ReactionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithRelationInput | Prisma.ReactionOrderByWithRelationInput[];
    cursor?: Prisma.ReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReactionScalarFieldEnum | Prisma.ReactionScalarFieldEnum[];
};
export type ReactionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithRelationInput | Prisma.ReactionOrderByWithRelationInput[];
    cursor?: Prisma.ReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReactionScalarFieldEnum | Prisma.ReactionScalarFieldEnum[];
};
export type ReactionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReactionCreateInput, Prisma.ReactionUncheckedCreateInput>;
};
export type ReactionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ReactionCreateManyInput | Prisma.ReactionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ReactionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    data: Prisma.ReactionCreateManyInput | Prisma.ReactionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ReactionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ReactionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReactionUpdateInput, Prisma.ReactionUncheckedUpdateInput>;
    where: Prisma.ReactionWhereUniqueInput;
};
export type ReactionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ReactionUpdateManyMutationInput, Prisma.ReactionUncheckedUpdateManyInput>;
    where?: Prisma.ReactionWhereInput;
    limit?: number;
};
export type ReactionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ReactionUpdateManyMutationInput, Prisma.ReactionUncheckedUpdateManyInput>;
    where?: Prisma.ReactionWhereInput;
    limit?: number;
    include?: Prisma.ReactionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ReactionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where: Prisma.ReactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReactionCreateInput, Prisma.ReactionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ReactionUpdateInput, Prisma.ReactionUncheckedUpdateInput>;
};
export type ReactionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where: Prisma.ReactionWhereUniqueInput;
};
export type ReactionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReactionWhereInput;
    limit?: number;
};
export type ReactionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
};
