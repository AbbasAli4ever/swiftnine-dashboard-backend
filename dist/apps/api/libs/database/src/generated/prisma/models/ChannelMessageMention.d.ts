import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ChannelMessageMentionModel = runtime.Types.Result.DefaultSelection<Prisma.$ChannelMessageMentionPayload>;
export type AggregateChannelMessageMention = {
    _count: ChannelMessageMentionCountAggregateOutputType | null;
    _min: ChannelMessageMentionMinAggregateOutputType | null;
    _max: ChannelMessageMentionMaxAggregateOutputType | null;
};
export type ChannelMessageMentionMinAggregateOutputType = {
    id: string | null;
    messageId: string | null;
    mentionedUserId: string | null;
    createdAt: Date | null;
};
export type ChannelMessageMentionMaxAggregateOutputType = {
    id: string | null;
    messageId: string | null;
    mentionedUserId: string | null;
    createdAt: Date | null;
};
export type ChannelMessageMentionCountAggregateOutputType = {
    id: number;
    messageId: number;
    mentionedUserId: number;
    createdAt: number;
    _all: number;
};
export type ChannelMessageMentionMinAggregateInputType = {
    id?: true;
    messageId?: true;
    mentionedUserId?: true;
    createdAt?: true;
};
export type ChannelMessageMentionMaxAggregateInputType = {
    id?: true;
    messageId?: true;
    mentionedUserId?: true;
    createdAt?: true;
};
export type ChannelMessageMentionCountAggregateInputType = {
    id?: true;
    messageId?: true;
    mentionedUserId?: true;
    createdAt?: true;
    _all?: true;
};
export type ChannelMessageMentionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMessageMentionWhereInput;
    orderBy?: Prisma.ChannelMessageMentionOrderByWithRelationInput | Prisma.ChannelMessageMentionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageMentionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChannelMessageMentionCountAggregateInputType;
    _min?: ChannelMessageMentionMinAggregateInputType;
    _max?: ChannelMessageMentionMaxAggregateInputType;
};
export type GetChannelMessageMentionAggregateType<T extends ChannelMessageMentionAggregateArgs> = {
    [P in keyof T & keyof AggregateChannelMessageMention]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChannelMessageMention[P]> : Prisma.GetScalarType<T[P], AggregateChannelMessageMention[P]>;
};
export type ChannelMessageMentionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMessageMentionWhereInput;
    orderBy?: Prisma.ChannelMessageMentionOrderByWithAggregationInput | Prisma.ChannelMessageMentionOrderByWithAggregationInput[];
    by: Prisma.ChannelMessageMentionScalarFieldEnum[] | Prisma.ChannelMessageMentionScalarFieldEnum;
    having?: Prisma.ChannelMessageMentionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChannelMessageMentionCountAggregateInputType | true;
    _min?: ChannelMessageMentionMinAggregateInputType;
    _max?: ChannelMessageMentionMaxAggregateInputType;
};
export type ChannelMessageMentionGroupByOutputType = {
    id: string;
    messageId: string;
    mentionedUserId: string;
    createdAt: Date;
    _count: ChannelMessageMentionCountAggregateOutputType | null;
    _min: ChannelMessageMentionMinAggregateOutputType | null;
    _max: ChannelMessageMentionMaxAggregateOutputType | null;
};
export type GetChannelMessageMentionGroupByPayload<T extends ChannelMessageMentionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChannelMessageMentionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChannelMessageMentionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChannelMessageMentionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChannelMessageMentionGroupByOutputType[P]>;
}>>;
export type ChannelMessageMentionWhereInput = {
    AND?: Prisma.ChannelMessageMentionWhereInput | Prisma.ChannelMessageMentionWhereInput[];
    OR?: Prisma.ChannelMessageMentionWhereInput[];
    NOT?: Prisma.ChannelMessageMentionWhereInput | Prisma.ChannelMessageMentionWhereInput[];
    id?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    messageId?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    mentionedUserId?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    createdAt?: Prisma.DateTimeFilter<"ChannelMessageMention"> | Date | string;
    message?: Prisma.XOR<Prisma.ChannelMessageScalarRelationFilter, Prisma.ChannelMessageWhereInput>;
    mentionedUser?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ChannelMessageMentionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    message?: Prisma.ChannelMessageOrderByWithRelationInput;
    mentionedUser?: Prisma.UserOrderByWithRelationInput;
};
export type ChannelMessageMentionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    messageId_mentionedUserId?: Prisma.ChannelMessageMentionMessageIdMentionedUserIdCompoundUniqueInput;
    AND?: Prisma.ChannelMessageMentionWhereInput | Prisma.ChannelMessageMentionWhereInput[];
    OR?: Prisma.ChannelMessageMentionWhereInput[];
    NOT?: Prisma.ChannelMessageMentionWhereInput | Prisma.ChannelMessageMentionWhereInput[];
    messageId?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    mentionedUserId?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    createdAt?: Prisma.DateTimeFilter<"ChannelMessageMention"> | Date | string;
    message?: Prisma.XOR<Prisma.ChannelMessageScalarRelationFilter, Prisma.ChannelMessageWhereInput>;
    mentionedUser?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "messageId_mentionedUserId">;
export type ChannelMessageMentionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ChannelMessageMentionCountOrderByAggregateInput;
    _max?: Prisma.ChannelMessageMentionMaxOrderByAggregateInput;
    _min?: Prisma.ChannelMessageMentionMinOrderByAggregateInput;
};
export type ChannelMessageMentionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChannelMessageMentionScalarWhereWithAggregatesInput | Prisma.ChannelMessageMentionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChannelMessageMentionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChannelMessageMentionScalarWhereWithAggregatesInput | Prisma.ChannelMessageMentionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ChannelMessageMention"> | string;
    messageId?: Prisma.StringWithAggregatesFilter<"ChannelMessageMention"> | string;
    mentionedUserId?: Prisma.StringWithAggregatesFilter<"ChannelMessageMention"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ChannelMessageMention"> | Date | string;
};
export type ChannelMessageMentionCreateInput = {
    id?: string;
    createdAt?: Date | string;
    message: Prisma.ChannelMessageCreateNestedOneWithoutMentionsInput;
    mentionedUser: Prisma.UserCreateNestedOneWithoutChannelMessageMentionsInput;
};
export type ChannelMessageMentionUncheckedCreateInput = {
    id?: string;
    messageId: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type ChannelMessageMentionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    message?: Prisma.ChannelMessageUpdateOneRequiredWithoutMentionsNestedInput;
    mentionedUser?: Prisma.UserUpdateOneRequiredWithoutChannelMessageMentionsNestedInput;
};
export type ChannelMessageMentionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageMentionCreateManyInput = {
    id?: string;
    messageId: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type ChannelMessageMentionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageMentionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageMentionListRelationFilter = {
    every?: Prisma.ChannelMessageMentionWhereInput;
    some?: Prisma.ChannelMessageMentionWhereInput;
    none?: Prisma.ChannelMessageMentionWhereInput;
};
export type ChannelMessageMentionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChannelMessageMentionMessageIdMentionedUserIdCompoundUniqueInput = {
    messageId: string;
    mentionedUserId: string;
};
export type ChannelMessageMentionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMessageMentionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMessageMentionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    mentionedUserId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMessageMentionCreateNestedManyWithoutMentionedUserInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput> | Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMentionedUserInputEnvelope;
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
};
export type ChannelMessageMentionUncheckedCreateNestedManyWithoutMentionedUserInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput> | Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMentionedUserInputEnvelope;
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
};
export type ChannelMessageMentionUpdateManyWithoutMentionedUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput> | Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput[];
    upsert?: Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMentionedUserInput | Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMentionedUserInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMentionedUserInputEnvelope;
    set?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    update?: Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMentionedUserInput | Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMentionedUserInput[];
    updateMany?: Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMentionedUserInput | Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMentionedUserInput[];
    deleteMany?: Prisma.ChannelMessageMentionScalarWhereInput | Prisma.ChannelMessageMentionScalarWhereInput[];
};
export type ChannelMessageMentionUncheckedUpdateManyWithoutMentionedUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput> | Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput[];
    upsert?: Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMentionedUserInput | Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMentionedUserInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMentionedUserInputEnvelope;
    set?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    update?: Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMentionedUserInput | Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMentionedUserInput[];
    updateMany?: Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMentionedUserInput | Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMentionedUserInput[];
    deleteMany?: Prisma.ChannelMessageMentionScalarWhereInput | Prisma.ChannelMessageMentionScalarWhereInput[];
};
export type ChannelMessageMentionCreateNestedManyWithoutMessageInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageMentionCreateWithoutMessageInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMessageInputEnvelope;
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
};
export type ChannelMessageMentionUncheckedCreateNestedManyWithoutMessageInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageMentionCreateWithoutMessageInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMessageInputEnvelope;
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
};
export type ChannelMessageMentionUpdateManyWithoutMessageNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageMentionCreateWithoutMessageInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput[];
    upsert?: Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMessageInputEnvelope;
    set?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    update?: Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?: Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMessageInput | Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: Prisma.ChannelMessageMentionScalarWhereInput | Prisma.ChannelMessageMentionScalarWhereInput[];
};
export type ChannelMessageMentionUncheckedUpdateManyWithoutMessageNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput> | Prisma.ChannelMessageMentionCreateWithoutMessageInput[] | Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput | Prisma.ChannelMessageMentionCreateOrConnectWithoutMessageInput[];
    upsert?: Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageMentionUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: Prisma.ChannelMessageMentionCreateManyMessageInputEnvelope;
    set?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    disconnect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    delete?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    connect?: Prisma.ChannelMessageMentionWhereUniqueInput | Prisma.ChannelMessageMentionWhereUniqueInput[];
    update?: Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMessageInput | Prisma.ChannelMessageMentionUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?: Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMessageInput | Prisma.ChannelMessageMentionUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: Prisma.ChannelMessageMentionScalarWhereInput | Prisma.ChannelMessageMentionScalarWhereInput[];
};
export type ChannelMessageMentionCreateWithoutMentionedUserInput = {
    id?: string;
    createdAt?: Date | string;
    message: Prisma.ChannelMessageCreateNestedOneWithoutMentionsInput;
};
export type ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput = {
    id?: string;
    messageId: string;
    createdAt?: Date | string;
};
export type ChannelMessageMentionCreateOrConnectWithoutMentionedUserInput = {
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput>;
};
export type ChannelMessageMentionCreateManyMentionedUserInputEnvelope = {
    data: Prisma.ChannelMessageMentionCreateManyMentionedUserInput | Prisma.ChannelMessageMentionCreateManyMentionedUserInput[];
    skipDuplicates?: boolean;
};
export type ChannelMessageMentionUpsertWithWhereUniqueWithoutMentionedUserInput = {
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelMessageMentionUpdateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedUpdateWithoutMentionedUserInput>;
    create: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMentionedUserInput>;
};
export type ChannelMessageMentionUpdateWithWhereUniqueWithoutMentionedUserInput = {
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelMessageMentionUpdateWithoutMentionedUserInput, Prisma.ChannelMessageMentionUncheckedUpdateWithoutMentionedUserInput>;
};
export type ChannelMessageMentionUpdateManyWithWhereWithoutMentionedUserInput = {
    where: Prisma.ChannelMessageMentionScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelMessageMentionUpdateManyMutationInput, Prisma.ChannelMessageMentionUncheckedUpdateManyWithoutMentionedUserInput>;
};
export type ChannelMessageMentionScalarWhereInput = {
    AND?: Prisma.ChannelMessageMentionScalarWhereInput | Prisma.ChannelMessageMentionScalarWhereInput[];
    OR?: Prisma.ChannelMessageMentionScalarWhereInput[];
    NOT?: Prisma.ChannelMessageMentionScalarWhereInput | Prisma.ChannelMessageMentionScalarWhereInput[];
    id?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    messageId?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    mentionedUserId?: Prisma.StringFilter<"ChannelMessageMention"> | string;
    createdAt?: Prisma.DateTimeFilter<"ChannelMessageMention"> | Date | string;
};
export type ChannelMessageMentionCreateWithoutMessageInput = {
    id?: string;
    createdAt?: Date | string;
    mentionedUser: Prisma.UserCreateNestedOneWithoutChannelMessageMentionsInput;
};
export type ChannelMessageMentionUncheckedCreateWithoutMessageInput = {
    id?: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type ChannelMessageMentionCreateOrConnectWithoutMessageInput = {
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput>;
};
export type ChannelMessageMentionCreateManyMessageInputEnvelope = {
    data: Prisma.ChannelMessageMentionCreateManyMessageInput | Prisma.ChannelMessageMentionCreateManyMessageInput[];
    skipDuplicates?: boolean;
};
export type ChannelMessageMentionUpsertWithWhereUniqueWithoutMessageInput = {
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelMessageMentionUpdateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedUpdateWithoutMessageInput>;
    create: Prisma.XOR<Prisma.ChannelMessageMentionCreateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedCreateWithoutMessageInput>;
};
export type ChannelMessageMentionUpdateWithWhereUniqueWithoutMessageInput = {
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelMessageMentionUpdateWithoutMessageInput, Prisma.ChannelMessageMentionUncheckedUpdateWithoutMessageInput>;
};
export type ChannelMessageMentionUpdateManyWithWhereWithoutMessageInput = {
    where: Prisma.ChannelMessageMentionScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelMessageMentionUpdateManyMutationInput, Prisma.ChannelMessageMentionUncheckedUpdateManyWithoutMessageInput>;
};
export type ChannelMessageMentionCreateManyMentionedUserInput = {
    id?: string;
    messageId: string;
    createdAt?: Date | string;
};
export type ChannelMessageMentionUpdateWithoutMentionedUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    message?: Prisma.ChannelMessageUpdateOneRequiredWithoutMentionsNestedInput;
};
export type ChannelMessageMentionUncheckedUpdateWithoutMentionedUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageMentionUncheckedUpdateManyWithoutMentionedUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageMentionCreateManyMessageInput = {
    id?: string;
    mentionedUserId: string;
    createdAt?: Date | string;
};
export type ChannelMessageMentionUpdateWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mentionedUser?: Prisma.UserUpdateOneRequiredWithoutChannelMessageMentionsNestedInput;
};
export type ChannelMessageMentionUncheckedUpdateWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageMentionUncheckedUpdateManyWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    mentionedUserId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMessageMentionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMessageMention"]>;
export type ChannelMessageMentionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMessageMention"]>;
export type ChannelMessageMentionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMessageMention"]>;
export type ChannelMessageMentionSelectScalar = {
    id?: boolean;
    messageId?: boolean;
    mentionedUserId?: boolean;
    createdAt?: boolean;
};
export type ChannelMessageMentionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "messageId" | "mentionedUserId" | "createdAt", ExtArgs["result"]["channelMessageMention"]>;
export type ChannelMessageMentionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ChannelMessageMentionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ChannelMessageMentionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.ChannelMessageDefaultArgs<ExtArgs>;
    mentionedUser?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ChannelMessageMentionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChannelMessageMention";
    objects: {
        message: Prisma.$ChannelMessagePayload<ExtArgs>;
        mentionedUser: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        messageId: string;
        mentionedUserId: string;
        createdAt: Date;
    }, ExtArgs["result"]["channelMessageMention"]>;
    composites: {};
};
export type ChannelMessageMentionGetPayload<S extends boolean | null | undefined | ChannelMessageMentionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload, S>;
export type ChannelMessageMentionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChannelMessageMentionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChannelMessageMentionCountAggregateInputType | true;
};
export interface ChannelMessageMentionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChannelMessageMention'];
        meta: {
            name: 'ChannelMessageMention';
        };
    };
    findUnique<T extends ChannelMessageMentionFindUniqueArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChannelMessageMentionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChannelMessageMentionFindFirstArgs>(args?: Prisma.SelectSubset<T, ChannelMessageMentionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChannelMessageMentionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChannelMessageMentionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChannelMessageMentionFindManyArgs>(args?: Prisma.SelectSubset<T, ChannelMessageMentionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChannelMessageMentionCreateArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionCreateArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChannelMessageMentionCreateManyArgs>(args?: Prisma.SelectSubset<T, ChannelMessageMentionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChannelMessageMentionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChannelMessageMentionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChannelMessageMentionDeleteArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionDeleteArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChannelMessageMentionUpdateArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionUpdateArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChannelMessageMentionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChannelMessageMentionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChannelMessageMentionUpdateManyArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChannelMessageMentionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChannelMessageMentionUpsertArgs>(args: Prisma.SelectSubset<T, ChannelMessageMentionUpsertArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageMentionClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessageMentionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChannelMessageMentionCountArgs>(args?: Prisma.Subset<T, ChannelMessageMentionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChannelMessageMentionCountAggregateOutputType> : number>;
    aggregate<T extends ChannelMessageMentionAggregateArgs>(args: Prisma.Subset<T, ChannelMessageMentionAggregateArgs>): Prisma.PrismaPromise<GetChannelMessageMentionAggregateType<T>>;
    groupBy<T extends ChannelMessageMentionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChannelMessageMentionGroupByArgs['orderBy'];
    } : {
        orderBy?: ChannelMessageMentionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChannelMessageMentionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelMessageMentionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChannelMessageMentionFieldRefs;
}
export interface Prisma__ChannelMessageMentionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    message<T extends Prisma.ChannelMessageDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChannelMessageDefaultArgs<ExtArgs>>): Prisma.Prisma__ChannelMessageClient<runtime.Types.Result.GetResult<Prisma.$ChannelMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    mentionedUser<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChannelMessageMentionFieldRefs {
    readonly id: Prisma.FieldRef<"ChannelMessageMention", 'String'>;
    readonly messageId: Prisma.FieldRef<"ChannelMessageMention", 'String'>;
    readonly mentionedUserId: Prisma.FieldRef<"ChannelMessageMention", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ChannelMessageMention", 'DateTime'>;
}
export type ChannelMessageMentionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
};
export type ChannelMessageMentionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
};
export type ChannelMessageMentionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    where?: Prisma.ChannelMessageMentionWhereInput;
    orderBy?: Prisma.ChannelMessageMentionOrderByWithRelationInput | Prisma.ChannelMessageMentionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageMentionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMessageMentionScalarFieldEnum | Prisma.ChannelMessageMentionScalarFieldEnum[];
};
export type ChannelMessageMentionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    where?: Prisma.ChannelMessageMentionWhereInput;
    orderBy?: Prisma.ChannelMessageMentionOrderByWithRelationInput | Prisma.ChannelMessageMentionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageMentionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMessageMentionScalarFieldEnum | Prisma.ChannelMessageMentionScalarFieldEnum[];
};
export type ChannelMessageMentionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    where?: Prisma.ChannelMessageMentionWhereInput;
    orderBy?: Prisma.ChannelMessageMentionOrderByWithRelationInput | Prisma.ChannelMessageMentionOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMessageMentionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMessageMentionScalarFieldEnum | Prisma.ChannelMessageMentionScalarFieldEnum[];
};
export type ChannelMessageMentionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMessageMentionCreateInput, Prisma.ChannelMessageMentionUncheckedCreateInput>;
};
export type ChannelMessageMentionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChannelMessageMentionCreateManyInput | Prisma.ChannelMessageMentionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChannelMessageMentionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    data: Prisma.ChannelMessageMentionCreateManyInput | Prisma.ChannelMessageMentionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChannelMessageMentionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChannelMessageMentionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMessageMentionUpdateInput, Prisma.ChannelMessageMentionUncheckedUpdateInput>;
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
};
export type ChannelMessageMentionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChannelMessageMentionUpdateManyMutationInput, Prisma.ChannelMessageMentionUncheckedUpdateManyInput>;
    where?: Prisma.ChannelMessageMentionWhereInput;
    limit?: number;
};
export type ChannelMessageMentionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMessageMentionUpdateManyMutationInput, Prisma.ChannelMessageMentionUncheckedUpdateManyInput>;
    where?: Prisma.ChannelMessageMentionWhereInput;
    limit?: number;
    include?: Prisma.ChannelMessageMentionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChannelMessageMentionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMessageMentionCreateInput, Prisma.ChannelMessageMentionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChannelMessageMentionUpdateInput, Prisma.ChannelMessageMentionUncheckedUpdateInput>;
};
export type ChannelMessageMentionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
    where: Prisma.ChannelMessageMentionWhereUniqueInput;
};
export type ChannelMessageMentionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMessageMentionWhereInput;
    limit?: number;
};
export type ChannelMessageMentionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMessageMentionSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMessageMentionOmit<ExtArgs> | null;
    include?: Prisma.ChannelMessageMentionInclude<ExtArgs> | null;
};
