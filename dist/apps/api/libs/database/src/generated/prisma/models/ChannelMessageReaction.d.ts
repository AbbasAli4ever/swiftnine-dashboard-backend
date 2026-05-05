import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ChannelMessageReactionModel = runtime.Types.Result.DefaultSelection<Prisma.$ChannelMessageReactionPayload>;
export type AggregateChannelMessageReaction = {
    _count: ChannelMessageReactionCountAggregateOutputType | null;
    _min: ChannelMessageReactionMinAggregateOutputType | null;
    _max: ChannelMessageReactionMaxAggregateOutputType | null;
};
export type ChannelMessageReactionMinAggregateOutputType = {
    id: string | null;
    messageId: string | null;
    userId: string | null;
    emoji: string | null;
    createdAt: Date | null;
};
export type ChannelMessageReactionMaxAggregateOutputType = {
    id: string | null;
    messageId: string | null;
    userId: string | null;
    emoji: string | null;
    createdAt: Date | null;
};
export type ChannelMessageReactionCountAggregateOutputType = {
    id: number;
    messageId: number;
    userId: number;
    emoji: number;
    createdAt: number;
    _all: number;
};
export type ChannelMessageReactionMinAggregateInputType = {
    id?: true;
    messageId?: true;
    userId?: true;
    emoji?: true;
    createdAt?: true;
};
export type ChannelMessageReactionMaxAggregateInputType = {
    id?: true;
    messageId?: true;
    userId?: true;
    emoji?: true;
    createdAt?: true;
};
export type ChannelMessageReactionCountAggregateInputType = {
    id?: true;
    messageId?: true;
    userId?: true;
    emoji?: true;
    createdAt?: true;
    _all?: true;
};
export type ChannelMessageReactionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMessageReactionWhereInput;
    orderBy?: Prisma.ChannelMessageReactionOrderByWithRelationInput | Prisma.ChannelMessageReactionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChannelMessageReactionCountAggregateInputType;
    _min?: ChannelMessageReactionMinAggregateInputType;
    _max?: ChannelMessageReactionMaxAggregateInputType;
};
export type GetChannelMessageReactionAggregateType<T extends ChannelMessageReactionAggregateArgs> = {
    [P in keyof T & keyof AggregateChannelMessageReaction]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChannelMessageReaction[P]> : Prisma.GetScalarType<T[P], AggregateChannelMessageReaction[P]>;
};
export type ChannelMessageReactionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMessageReactionWhereInput;
    orderBy?: Prisma.ChannelMessageReactionOrderByWithAggregationInput | Prisma.ChannelMessageReactionOrderByWithAggregationInput[];
    by: Prisma.ChannelMessageReactionScalarFieldEnum[] | Prisma.ChannelMessageReactionScalarFieldEnum;
    having?: Prisma.ChannelMessageReactionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChannelMessageReactionCountAggregateInputType | true;
    _min?: ChannelMessageReactionMinAggregateInputType;
    _max?: ChannelMessageReactionMaxAggregateInputType;
};
export type ChannelMessageReactionGroupByOutputType = {
    id: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt: Date;
    _count: ChannelMessageReactionCountAggregateOutputType | null;
    _min: ChannelMessageReactionMinAggregateOutputType | null;
    _max: ChannelMessageReactionMaxAggregateOutputType | null;
};
export type GetChannelMessageReactionGroupByPayload<T extends ChannelMessageReactionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChannelMessageReactionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChannelMessageReactionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChannelMessageReactionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChannelMessageReactionGroupByOutputType[P]>;
}>>;
export type ChannelMessageReactionWhereInput = {
    AND?: Prisma.ChannelMessageReactionWhereInput | Prisma.ChannelMessageReactionWhereInput[];
    OR?: Prisma.ChannelMessageReactionWhereInput[];
    NOT?: Prisma.ChannelMessageReactionWhereInput | Prisma.ChannelMessageReactionWhereInput[];
    id?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    messageId?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    userId?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    emoji?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    createdAt?: Prisma.DateTimeFilter<"ChannelMessageReaction"> | Date | string;
    message?: Prisma.XOR<Prisma.ChannelMessageScalarRelationFilter, Prisma.ChannelMessageWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ChannelMessageReactionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    emoji?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    message?: Prisma.ChannelMessageOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ChannelMessageReactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    messageId_userId_emoji?: Prisma.ChannelMessageReactionMessageIdUserIdEmojiCompoundUniqueInput;
    AND?: Prisma.ChannelMessageReactionWhereInput | Prisma.ChannelMessageReactionWhereInput[];
    OR?: Prisma.ChannelMessageReactionWhereInput[];
    NOT?: Prisma.ChannelMessageReactionWhereInput | Prisma.ChannelMessageReactionWhereInput[];
    messageId?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    userId?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    emoji?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    createdAt?: Prisma.DateTimeFilter<"ChannelMessageReaction"> | Date | string;
    message?: Prisma.XOR<Prisma.ChannelMessageScalarRelationFilter, Prisma.ChannelMessageWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "messageId_userId_emoji">;
export type ChannelMessageReactionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    emoji?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ChannelMessageReactionCountOrderByAggregateInput;
    _max?: Prisma.ChannelMessageReactionMaxOrderByAggregateInput;
    _min?: Prisma.ChannelMessageReactionMinOrderByAggregateInput;
};
export type ChannelMessageReactionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChannelMessageReactionScalarWhereWithAggregatesInput | Prisma.ChannelMessageReactionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChannelMessageReactionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChannelMessageReactionScalarWhereWithAggregatesInput | Prisma.ChannelMessageReactionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ChannelMessageReaction"> | string;
    messageId?: Prisma.StringWithAggregatesFilter<"ChannelMessageReaction"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ChannelMessageReaction"> | string;
    emoji?: Prisma.StringWithAggregatesFilter<"ChannelMessageReaction"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ChannelMessageReaction"> | Date | string;
};
export type ChannelMessageReactionCreateInput = {
    id?: string;
    emoji: string;
    createdAt?: Date | string;
    message: Prisma.ChannelMessageCreateNestedOneWithoutReactionsInput;
    user: Prisma.UserCreateNestedOneWithoutChannelMessageReactionsInput;
};
export type ChannelMessageReactionUncheckedCreateInput = {
    id?: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt?: Date | string;
};
export type ChannelMessageReactionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    message?: Prisma.ChannelMessageUpdateOneRequiredWithoutReactionsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutChannelMessageReactionsNestedInput;
};
export type ChannelMessageReactionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageReactionCreateManyInput = {
    id?: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt?: Date | string;
};
export type ChannelMessageReactionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageReactionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageReactionListRelationFilter = {
    every?: Prisma.ChannelMessageReactionWhereInput;
    some?: Prisma.ChannelMessageReactionWhereInput;
    none?: Prisma.ChannelMessageReactionWhereInput;
};
export type ChannelMessageReactionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChannelMessageReactionMessageIdUserIdEmojiCompoundUniqueInput = {
    messageId: string;
    userId: string;
    emoji: string;
};
export type ChannelMessageReactionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    emoji?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMessageReactionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    emoji?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMessageReactionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    emoji?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMessageReactionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput> | Prisma.ChannelMessageReactionCreateWithoutUserInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyUserInputEnvelope;
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
};
export type ChannelMessageReactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput> | Prisma.ChannelMessageReactionCreateWithoutUserInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyUserInputEnvelope;
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
};
export type ChannelMessageReactionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput> | Prisma.ChannelMessageReactionCreateWithoutUserInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutUserInput | Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyUserInputEnvelope;
    set?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    update?: Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutUserInput | Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutUserInput | Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChannelMessageReactionScalarWhereInput | Prisma.ChannelMessageReactionScalarWhereInput[];
};
export type ChannelMessageReactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput> | Prisma.ChannelMessageReactionCreateWithoutUserInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutUserInput | Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyUserInputEnvelope;
    set?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    update?: Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutUserInput | Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutUserInput | Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChannelMessageReactionScalarWhereInput | Prisma.ChannelMessageReactionScalarWhereInput[];
};
export type ChannelMessageReactionCreateNestedManyWithoutMessageInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageReactionCreateWithoutMessageInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyMessageInputEnvelope;
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
};
export type ChannelMessageReactionUncheckedCreateNestedManyWithoutMessageInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageReactionCreateWithoutMessageInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyMessageInputEnvelope;
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
};
export type ChannelMessageReactionUpdateManyWithoutMessageNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageReactionCreateWithoutMessageInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput[];
    upsert?: Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyMessageInputEnvelope;
    set?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    update?: Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?: Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutMessageInput | Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: Prisma.ChannelMessageReactionScalarWhereInput | Prisma.ChannelMessageReactionScalarWhereInput[];
};
export type ChannelMessageReactionUncheckedUpdateManyWithoutMessageNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageReactionCreateWithoutMessageInput[] | Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageReactionCreateOrConnectWithoutMessageInput[];
    upsert?: Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageReactionUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageReactionCreateManyMessageInputEnvelope;
    set?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageReactionWhereUniqueInput | Prisma.ChannelMessageReactionWhereUniqueInput[];
    update?: Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageReactionUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?: Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutMessageInput | Prisma.ChannelMessageReactionUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: Prisma.ChannelMessageReactionScalarWhereInput | Prisma.ChannelMessageReactionScalarWhereInput[];
};
export type ChannelMessageReactionCreateWithoutUserInput = {
    id?: string;
    emoji: string;
    createdAt?: Date | string;
    message: Prisma.ChannelMessageCreateNestedOneWithoutReactionsInput;
};
export type ChannelMessageReactionUncheckedCreateWithoutUserInput = {
    id?: string;
    messageId: string;
    emoji: string;
    createdAt?: Date | string;
};
export type ChannelMessageReactionCreateOrConnectWithoutUserInput = {
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput>;
};
export type ChannelMessageReactionCreateManyUserInputEnvelope = {
    data: Prisma.ChannelMessageReactionCreateManyUserInput | Prisma.ChannelMessageReactionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ChannelMessageReactionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelMessageReactionUpdateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutUserInput>;
};
export type ChannelMessageReactionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelMessageReactionUpdateWithoutUserInput, Prisma.ChannelMessageReactionUncheckedUpdateWithoutUserInput>;
};
export type ChannelMessageReactionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ChannelMessageReactionScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelMessageReactionUpdateManyMutationInput, Prisma.ChannelMessageReactionUncheckedUpdateManyWithoutUserInput>;
};
export type ChannelMessageReactionScalarWhereInput = {
    AND?: Prisma.ChannelMessageReactionScalarWhereInput | Prisma.ChannelMessageReactionScalarWhereInput[];
    OR?: Prisma.ChannelMessageReactionScalarWhereInput[];
    NOT?: Prisma.ChannelMessageReactionScalarWhereInput | Prisma.ChannelMessageReactionScalarWhereInput[];
    id?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    messageId?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    userId?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    emoji?: Prisma.StringFilter<"ChannelMessageReaction"> | string;
    createdAt?: Prisma.DateTimeFilter<"ChannelMessageReaction"> | Date | string;
};
export type ChannelMessageReactionCreateWithoutMessageInput = {
    id?: string;
    emoji: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutChannelMessageReactionsInput;
};
export type ChannelMessageReactionUncheckedCreateWithoutMessageInput = {
    id?: string;
    userId: string;
    emoji: string;
    createdAt?: Date | string;
};
export type ChannelMessageReactionCreateOrConnectWithoutMessageInput = {
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput>;
};
export type ChannelMessageReactionCreateManyMessageInputEnvelope = {
    data: Prisma.ChannelMessageReactionCreateManyMessageInput | Prisma.ChannelMessageReactionCreateManyMessageInput[];
    skipDuplicates?: boolean;
};
export type ChannelMessageReactionUpsertWithWhereUniqueWithoutMessageInput = {
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelMessageReactionUpdateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedUpdateWithoutMessageInput>;
    create: Prisma.XOR<Prisma.ChannelMessageReactionCreateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedCreateWithoutMessageInput>;
};
export type ChannelMessageReactionUpdateWithWhereUniqueWithoutMessageInput = {
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelMessageReactionUpdateWithoutMessageInput, Prisma.ChannelMessageReactionUncheckedUpdateWithoutMessageInput>;
};
export type ChannelMessageReactionUpdateManyWithWhereWithoutMessageInput = {
    where: Prisma.ChannelMessageReactionScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelMessageReactionUpdateManyMutationInput, Prisma.ChannelMessageReactionUncheckedUpdateManyWithoutMessageInput>;
};
export type ChannelMessageReactionCreateManyUserInput = {
    id?: string;
    messageId: string;
    emoji: string;
    createdAt?: Date | string;
};
export type ChannelMessageReactionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    message?: Prisma.ChannelMessageUpdateOneRequiredWithoutReactionsNestedInput;
};
export type ChannelMessageReactionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageReactionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageReactionCreateManyMessageInput = {
    id?: string;
    userId: string;
    emoji: string;
    createdAt?: Date | string;
};
export type ChannelMessageReactionUpdateWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutChannelMessageReactionsNestedInput;
};
export type ChannelMessageReactionUncheckedUpdateWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageReactionUncheckedUpdateManyWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    emoji?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageReactionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    emoji?: boolean;
    createdAt?: boolean;
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMessageReaction"]>;
export type ChannelMessageReactionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    emoji?: boolean;
    createdAt?: boolean;
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMessageReaction"]>;
export type ChannelMessageReactionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    emoji?: boolean;
    createdAt?: boolean;
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMessageReaction"]>;
export type ChannelMessageReactionSelectScalar = {
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    emoji?: boolean;
    createdAt?: boolean;
};
export type ChannelMessageReactionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "messageId" | "userId" | "emoji" | "createdAt", ExtArgs["result"]["channelMessageReaction"]>;
export type ChannelMessageReactionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ChannelMessageReactionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ChannelMessageReactionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ChannelMessageReactionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChannelMessageReaction";
    objects: {
        message: Prisma.$ChannelMessagePayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: Date;
    }, ExtArgs["result"]["channelMessageReaction"]>;
    composites: {};
};
export type ChannelMessageReactionGetPayload<S extends boolean | null | undefined | ChannelMessageReactionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload, S>;
export type ChannelMessageReactionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChannelMessageReactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChannelMessageReactionCountAggregateInputType | true;
};
export interface ChannelMessageReactionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChannelMessageReaction'];
        meta: {
            name: 'ChannelMessageReaction';
        };
    };
    findUnique<T extends ChannelMessageReactionFindUniqueArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChannelMessageReactionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChannelMessageReactionFindFirstArgs>(args?: Prisma.SelectSubset<T, ChannelMessageReactionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChannelMessageReactionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChannelMessageReactionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChannelMessageReactionFindManyArgs>(args?: Prisma.SelectSubset<T, ChannelMessageReactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChannelMessageReactionCreateArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionCreateArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChannelMessageReactionCreateManyArgs>(args?: Prisma.SelectSubset<T, ChannelMessageReactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChannelMessageReactionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChannelMessageReactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChannelMessageReactionDeleteArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionDeleteArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChannelMessageReactionUpdateArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionUpdateArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChannelMessageReactionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChannelMessageReactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChannelMessageReactionUpdateManyArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChannelMessageReactionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChannelMessageReactionUpsertArgs>(args: Prisma.SelectSubset<T, ChannelMessageReactionUpsertArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageReactionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageReactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChannelMessageReactionCountArgs>(args?: Prisma.Subset<T, ChannelMessageReactionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChannelMessageReactionCountAggregateOutputType> : number>;
    aggregate<T extends ChannelMessageReactionAggregateArgs>(args: Prisma.Subset<T, ChannelMessageReactionAggregateArgs>): Prisma.PrismaPromise<GetChannelMessageReactionAggregateType<T>>;
    groupBy<T extends ChannelMessageReactionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChannelMessageReactionGroupByArgs['orderBy'];
    } : {
        orderBy?: ChannelMessageReactionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChannelMessageReactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelMessageReactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChannelMessageReactionFieldRefs;
}
export interface Prisma__ChannelMessageReactionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    message<T extends Prisma.ChannelMessageDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChannelMessageDefaultArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChannelMessageReactionFieldRefs {
    readonly id: Prisma.FieldRef<"ChannelMessageReaction", 'String'>;
    readonly messageId: Prisma.FieldRef<"ChannelMessageReaction", 'String'>;
    readonly userId: Prisma.FieldRef<"ChannelMessageReaction", 'String'>;
    readonly emoji: Prisma.FieldRef<"ChannelMessageReaction", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ChannelMessageReaction", 'DateTime'>;
}
export type ChannelMessageReactionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
};
export type ChannelMessageReactionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
};
export type ChannelMessageReactionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    where?: Prisma.ChannelMessageReactionWhereInput;
    orderBy?: Prisma.ChannelMessageReactionOrderByWithRelationInput | Prisma.ChannelMessageReactionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMessageReactionScalarFieldEnum | Prisma.ChannelMessageReactionScalarFieldEnum[];
};
export type ChannelMessageReactionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    where?: Prisma.ChannelMessageReactionWhereInput;
    orderBy?: Prisma.ChannelMessageReactionOrderByWithRelationInput | Prisma.ChannelMessageReactionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMessageReactionScalarFieldEnum | Prisma.ChannelMessageReactionScalarFieldEnum[];
};
export type ChannelMessageReactionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    where?: Prisma.ChannelMessageReactionWhereInput;
    orderBy?: Prisma.ChannelMessageReactionOrderByWithRelationInput | Prisma.ChannelMessageReactionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMessageReactionScalarFieldEnum | Prisma.ChannelMessageReactionScalarFieldEnum[];
};
export type ChannelMessageReactionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMessageReactionCreateInput, Prisma.ChannelMessageReactionUncheckedCreateInput>;
};
export type ChannelMessageReactionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChannelMessageReactionCreateManyInput | Prisma.ChannelMessageReactionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChannelMessageReactionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    data: Prisma.ChannelMessageReactionCreateManyInput | Prisma.ChannelMessageReactionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChannelMessageReactionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChannelMessageReactionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMessageReactionUpdateInput, Prisma.ChannelMessageReactionUncheckedUpdateInput>;
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
};
export type ChannelMessageReactionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChannelMessageReactionUpdateManyMutationInput, Prisma.ChannelMessageReactionUncheckedUpdateManyInput>;
    where?: Prisma.ChannelMessageReactionWhereInput;
    limit?: number;
};
export type ChannelMessageReactionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMessageReactionUpdateManyMutationInput, Prisma.ChannelMessageReactionUncheckedUpdateManyInput>;
    where?: Prisma.ChannelMessageReactionWhereInput;
    limit?: number;
    include?: Prisma.ChannelMessageReactionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChannelMessageReactionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMessageReactionCreateInput, Prisma.ChannelMessageReactionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChannelMessageReactionUpdateInput, Prisma.ChannelMessageReactionUncheckedUpdateInput>;
};
export type ChannelMessageReactionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageReactionWhereUniqueInput;
};
export type ChannelMessageReactionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMessageReactionWhereInput;
    limit?: number;
};
export type ChannelMessageReactionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageReactionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageReactionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageReactionInclude<ExtArgs> | null;
};
