import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ChannelJoinRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$ChannelJoinRequestPayload>;
export type AggregateChannelJoinRequest = {
    _count: ChannelJoinRequestCountAggregateOutputType | null;
    _min: ChannelJoinRequestMinAggregateOutputType | null;
    _max: ChannelJoinRequestMaxAggregateOutputType | null;
};
export type ChannelJoinRequestMinAggregateOutputType = {
    id: string | null;
    channelId: string | null;
    userId: string | null;
    status: $Enums.ChannelJoinRequestStatus | null;
    requestedAt: Date | null;
    decidedById: string | null;
    decidedAt: Date | null;
};
export type ChannelJoinRequestMaxAggregateOutputType = {
    id: string | null;
    channelId: string | null;
    userId: string | null;
    status: $Enums.ChannelJoinRequestStatus | null;
    requestedAt: Date | null;
    decidedById: string | null;
    decidedAt: Date | null;
};
export type ChannelJoinRequestCountAggregateOutputType = {
    id: number;
    channelId: number;
    userId: number;
    status: number;
    requestedAt: number;
    decidedById: number;
    decidedAt: number;
    _all: number;
};
export type ChannelJoinRequestMinAggregateInputType = {
    id?: true;
    channelId?: true;
    userId?: true;
    status?: true;
    requestedAt?: true;
    decidedById?: true;
    decidedAt?: true;
};
export type ChannelJoinRequestMaxAggregateInputType = {
    id?: true;
    channelId?: true;
    userId?: true;
    status?: true;
    requestedAt?: true;
    decidedById?: true;
    decidedAt?: true;
};
export type ChannelJoinRequestCountAggregateInputType = {
    id?: true;
    channelId?: true;
    userId?: true;
    status?: true;
    requestedAt?: true;
    decidedById?: true;
    decidedAt?: true;
    _all?: true;
};
export type ChannelJoinRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelJoinRequestWhereInput;
    orderBy?: Prisma.ChannelJoinRequestOrderByWithRelationInput | Prisma.ChannelJoinRequestOrderByWithRelationInput[];
    cursor?: Prisma.ChannelJoinRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChannelJoinRequestCountAggregateInputType;
    _min?: ChannelJoinRequestMinAggregateInputType;
    _max?: ChannelJoinRequestMaxAggregateInputType;
};
export type GetChannelJoinRequestAggregateType<T extends ChannelJoinRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateChannelJoinRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChannelJoinRequest[P]> : Prisma.GetScalarType<T[P], AggregateChannelJoinRequest[P]>;
};
export type ChannelJoinRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelJoinRequestWhereInput;
    orderBy?: Prisma.ChannelJoinRequestOrderByWithAggregationInput | Prisma.ChannelJoinRequestOrderByWithAggregationInput[];
    by: Prisma.ChannelJoinRequestScalarFieldEnum[] | Prisma.ChannelJoinRequestScalarFieldEnum;
    having?: Prisma.ChannelJoinRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChannelJoinRequestCountAggregateInputType | true;
    _min?: ChannelJoinRequestMinAggregateInputType;
    _max?: ChannelJoinRequestMaxAggregateInputType;
};
export type ChannelJoinRequestGroupByOutputType = {
    id: string;
    channelId: string;
    userId: string;
    status: $Enums.ChannelJoinRequestStatus;
    requestedAt: Date;
    decidedById: string | null;
    decidedAt: Date | null;
    _count: ChannelJoinRequestCountAggregateOutputType | null;
    _min: ChannelJoinRequestMinAggregateOutputType | null;
    _max: ChannelJoinRequestMaxAggregateOutputType | null;
};
export type GetChannelJoinRequestGroupByPayload<T extends ChannelJoinRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChannelJoinRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChannelJoinRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChannelJoinRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChannelJoinRequestGroupByOutputType[P]>;
}>>;
export type ChannelJoinRequestWhereInput = {
    AND?: Prisma.ChannelJoinRequestWhereInput | Prisma.ChannelJoinRequestWhereInput[];
    OR?: Prisma.ChannelJoinRequestWhereInput[];
    NOT?: Prisma.ChannelJoinRequestWhereInput | Prisma.ChannelJoinRequestWhereInput[];
    id?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    channelId?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    userId?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    status?: Prisma.EnumChannelJoinRequestStatusFilter<"ChannelJoinRequest"> | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFilter<"ChannelJoinRequest"> | Date | string;
    decidedById?: Prisma.StringNullableFilter<"ChannelJoinRequest"> | string | null;
    decidedAt?: Prisma.DateTimeNullableFilter<"ChannelJoinRequest"> | Date | string | null;
    channel?: Prisma.XOR<Prisma.ChannelScalarRelationFilter, Prisma.ChannelWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    decidedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type ChannelJoinRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedAt?: Prisma.SortOrder;
    decidedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    decidedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    channel?: Prisma.ChannelOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    decidedBy?: Prisma.UserOrderByWithRelationInput;
};
export type ChannelJoinRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    channelId_userId_status?: Prisma.ChannelJoinRequestChannelIdUserIdStatusCompoundUniqueInput;
    AND?: Prisma.ChannelJoinRequestWhereInput | Prisma.ChannelJoinRequestWhereInput[];
    OR?: Prisma.ChannelJoinRequestWhereInput[];
    NOT?: Prisma.ChannelJoinRequestWhereInput | Prisma.ChannelJoinRequestWhereInput[];
    channelId?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    userId?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    status?: Prisma.EnumChannelJoinRequestStatusFilter<"ChannelJoinRequest"> | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFilter<"ChannelJoinRequest"> | Date | string;
    decidedById?: Prisma.StringNullableFilter<"ChannelJoinRequest"> | string | null;
    decidedAt?: Prisma.DateTimeNullableFilter<"ChannelJoinRequest"> | Date | string | null;
    channel?: Prisma.XOR<Prisma.ChannelScalarRelationFilter, Prisma.ChannelWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    decidedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "channelId_userId_status">;
export type ChannelJoinRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedAt?: Prisma.SortOrder;
    decidedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    decidedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ChannelJoinRequestCountOrderByAggregateInput;
    _max?: Prisma.ChannelJoinRequestMaxOrderByAggregateInput;
    _min?: Prisma.ChannelJoinRequestMinOrderByAggregateInput;
};
export type ChannelJoinRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChannelJoinRequestScalarWhereWithAggregatesInput | Prisma.ChannelJoinRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChannelJoinRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChannelJoinRequestScalarWhereWithAggregatesInput | Prisma.ChannelJoinRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ChannelJoinRequest"> | string;
    channelId?: Prisma.StringWithAggregatesFilter<"ChannelJoinRequest"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ChannelJoinRequest"> | string;
    status?: Prisma.EnumChannelJoinRequestStatusWithAggregatesFilter<"ChannelJoinRequest"> | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeWithAggregatesFilter<"ChannelJoinRequest"> | Date | string;
    decidedById?: Prisma.StringNullableWithAggregatesFilter<"ChannelJoinRequest"> | string | null;
    decidedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ChannelJoinRequest"> | Date | string | null;
};
export type ChannelJoinRequestCreateInput = {
    id?: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedAt?: Date | string | null;
    channel: Prisma.ChannelCreateNestedOneWithoutJoinRequestsInput;
    user: Prisma.UserCreateNestedOneWithoutChannelJoinRequestsMadeInput;
    decidedBy?: Prisma.UserCreateNestedOneWithoutChannelJoinRequestsDecidedInput;
};
export type ChannelJoinRequestUncheckedCreateInput = {
    id?: string;
    channelId: string;
    userId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedById?: string | null;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    channel?: Prisma.ChannelUpdateOneRequiredWithoutJoinRequestsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutChannelJoinRequestsMadeNestedInput;
    decidedBy?: Prisma.UserUpdateOneWithoutChannelJoinRequestsDecidedNestedInput;
};
export type ChannelJoinRequestUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestCreateManyInput = {
    id?: string;
    channelId: string;
    userId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedById?: string | null;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestListRelationFilter = {
    every?: Prisma.ChannelJoinRequestWhereInput;
    some?: Prisma.ChannelJoinRequestWhereInput;
    none?: Prisma.ChannelJoinRequestWhereInput;
};
export type ChannelJoinRequestOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChannelJoinRequestChannelIdUserIdStatusCompoundUniqueInput = {
    channelId: string;
    userId: string;
    status: $Enums.ChannelJoinRequestStatus;
};
export type ChannelJoinRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedAt?: Prisma.SortOrder;
    decidedById?: Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
};
export type ChannelJoinRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedAt?: Prisma.SortOrder;
    decidedById?: Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
};
export type ChannelJoinRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    requestedAt?: Prisma.SortOrder;
    decidedById?: Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
};
export type ChannelJoinRequestCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput> | Prisma.ChannelJoinRequestCreateWithoutUserInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyUserInputEnvelope;
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
};
export type ChannelJoinRequestCreateNestedManyWithoutDecidedByInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput> | Prisma.ChannelJoinRequestCreateWithoutDecidedByInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyDecidedByInputEnvelope;
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
};
export type ChannelJoinRequestUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput> | Prisma.ChannelJoinRequestCreateWithoutUserInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyUserInputEnvelope;
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
};
export type ChannelJoinRequestUncheckedCreateNestedManyWithoutDecidedByInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput> | Prisma.ChannelJoinRequestCreateWithoutDecidedByInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyDecidedByInputEnvelope;
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
};
export type ChannelJoinRequestUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput> | Prisma.ChannelJoinRequestCreateWithoutUserInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutUserInput | Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyUserInputEnvelope;
    set?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    disconnect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    delete?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    update?: Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutUserInput | Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutUserInput | Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
};
export type ChannelJoinRequestUpdateManyWithoutDecidedByNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput> | Prisma.ChannelJoinRequestCreateWithoutDecidedByInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput[];
    upsert?: Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutDecidedByInput | Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutDecidedByInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyDecidedByInputEnvelope;
    set?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    disconnect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    delete?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    update?: Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutDecidedByInput | Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutDecidedByInput[];
    updateMany?: Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutDecidedByInput | Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutDecidedByInput[];
    deleteMany?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
};
export type ChannelJoinRequestUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput> | Prisma.ChannelJoinRequestCreateWithoutUserInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutUserInput | Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyUserInputEnvelope;
    set?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    disconnect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    delete?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    update?: Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutUserInput | Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutUserInput | Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
};
export type ChannelJoinRequestUncheckedUpdateManyWithoutDecidedByNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput> | Prisma.ChannelJoinRequestCreateWithoutDecidedByInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutDecidedByInput[];
    upsert?: Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutDecidedByInput | Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutDecidedByInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyDecidedByInputEnvelope;
    set?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    disconnect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    delete?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    update?: Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutDecidedByInput | Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutDecidedByInput[];
    updateMany?: Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutDecidedByInput | Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutDecidedByInput[];
    deleteMany?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
};
export type ChannelJoinRequestCreateNestedManyWithoutChannelInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput> | Prisma.ChannelJoinRequestCreateWithoutChannelInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyChannelInputEnvelope;
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
};
export type ChannelJoinRequestUncheckedCreateNestedManyWithoutChannelInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput> | Prisma.ChannelJoinRequestCreateWithoutChannelInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyChannelInputEnvelope;
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
};
export type ChannelJoinRequestUpdateManyWithoutChannelNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput> | Prisma.ChannelJoinRequestCreateWithoutChannelInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput[];
    upsert?: Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutChannelInput | Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutChannelInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyChannelInputEnvelope;
    set?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    disconnect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    delete?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    update?: Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutChannelInput | Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutChannelInput[];
    updateMany?: Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutChannelInput | Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutChannelInput[];
    deleteMany?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
};
export type ChannelJoinRequestUncheckedUpdateManyWithoutChannelNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput> | Prisma.ChannelJoinRequestCreateWithoutChannelInput[] | Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput | Prisma.ChannelJoinRequestCreateOrConnectWithoutChannelInput[];
    upsert?: Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutChannelInput | Prisma.ChannelJoinRequestUpsertWithWhereUniqueWithoutChannelInput[];
    createMany?: Prisma.ChannelJoinRequestCreateManyChannelInputEnvelope;
    set?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    disconnect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    delete?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    connect?: Prisma.ChannelJoinRequestWhereUniqueInput | Prisma.ChannelJoinRequestWhereUniqueInput[];
    update?: Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutChannelInput | Prisma.ChannelJoinRequestUpdateWithWhereUniqueWithoutChannelInput[];
    updateMany?: Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutChannelInput | Prisma.ChannelJoinRequestUpdateManyWithWhereWithoutChannelInput[];
    deleteMany?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
};
export type EnumChannelJoinRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.ChannelJoinRequestStatus;
};
export type ChannelJoinRequestCreateWithoutUserInput = {
    id?: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedAt?: Date | string | null;
    channel: Prisma.ChannelCreateNestedOneWithoutJoinRequestsInput;
    decidedBy?: Prisma.UserCreateNestedOneWithoutChannelJoinRequestsDecidedInput;
};
export type ChannelJoinRequestUncheckedCreateWithoutUserInput = {
    id?: string;
    channelId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedById?: string | null;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestCreateOrConnectWithoutUserInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput>;
};
export type ChannelJoinRequestCreateManyUserInputEnvelope = {
    data: Prisma.ChannelJoinRequestCreateManyUserInput | Prisma.ChannelJoinRequestCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ChannelJoinRequestCreateWithoutDecidedByInput = {
    id?: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedAt?: Date | string | null;
    channel: Prisma.ChannelCreateNestedOneWithoutJoinRequestsInput;
    user: Prisma.UserCreateNestedOneWithoutChannelJoinRequestsMadeInput;
};
export type ChannelJoinRequestUncheckedCreateWithoutDecidedByInput = {
    id?: string;
    channelId: string;
    userId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestCreateOrConnectWithoutDecidedByInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput>;
};
export type ChannelJoinRequestCreateManyDecidedByInputEnvelope = {
    data: Prisma.ChannelJoinRequestCreateManyDecidedByInput | Prisma.ChannelJoinRequestCreateManyDecidedByInput[];
    skipDuplicates?: boolean;
};
export type ChannelJoinRequestUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelJoinRequestUpdateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutUserInput>;
};
export type ChannelJoinRequestUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateWithoutUserInput, Prisma.ChannelJoinRequestUncheckedUpdateWithoutUserInput>;
};
export type ChannelJoinRequestUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ChannelJoinRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateManyMutationInput, Prisma.ChannelJoinRequestUncheckedUpdateManyWithoutUserInput>;
};
export type ChannelJoinRequestScalarWhereInput = {
    AND?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
    OR?: Prisma.ChannelJoinRequestScalarWhereInput[];
    NOT?: Prisma.ChannelJoinRequestScalarWhereInput | Prisma.ChannelJoinRequestScalarWhereInput[];
    id?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    channelId?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    userId?: Prisma.StringFilter<"ChannelJoinRequest"> | string;
    status?: Prisma.EnumChannelJoinRequestStatusFilter<"ChannelJoinRequest"> | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFilter<"ChannelJoinRequest"> | Date | string;
    decidedById?: Prisma.StringNullableFilter<"ChannelJoinRequest"> | string | null;
    decidedAt?: Prisma.DateTimeNullableFilter<"ChannelJoinRequest"> | Date | string | null;
};
export type ChannelJoinRequestUpsertWithWhereUniqueWithoutDecidedByInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelJoinRequestUpdateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedUpdateWithoutDecidedByInput>;
    create: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutDecidedByInput>;
};
export type ChannelJoinRequestUpdateWithWhereUniqueWithoutDecidedByInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateWithoutDecidedByInput, Prisma.ChannelJoinRequestUncheckedUpdateWithoutDecidedByInput>;
};
export type ChannelJoinRequestUpdateManyWithWhereWithoutDecidedByInput = {
    where: Prisma.ChannelJoinRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateManyMutationInput, Prisma.ChannelJoinRequestUncheckedUpdateManyWithoutDecidedByInput>;
};
export type ChannelJoinRequestCreateWithoutChannelInput = {
    id?: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutChannelJoinRequestsMadeInput;
    decidedBy?: Prisma.UserCreateNestedOneWithoutChannelJoinRequestsDecidedInput;
};
export type ChannelJoinRequestUncheckedCreateWithoutChannelInput = {
    id?: string;
    userId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedById?: string | null;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestCreateOrConnectWithoutChannelInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput>;
};
export type ChannelJoinRequestCreateManyChannelInputEnvelope = {
    data: Prisma.ChannelJoinRequestCreateManyChannelInput | Prisma.ChannelJoinRequestCreateManyChannelInput[];
    skipDuplicates?: boolean;
};
export type ChannelJoinRequestUpsertWithWhereUniqueWithoutChannelInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelJoinRequestUpdateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedUpdateWithoutChannelInput>;
    create: Prisma.XOR<Prisma.ChannelJoinRequestCreateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedCreateWithoutChannelInput>;
};
export type ChannelJoinRequestUpdateWithWhereUniqueWithoutChannelInput = {
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateWithoutChannelInput, Prisma.ChannelJoinRequestUncheckedUpdateWithoutChannelInput>;
};
export type ChannelJoinRequestUpdateManyWithWhereWithoutChannelInput = {
    where: Prisma.ChannelJoinRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateManyMutationInput, Prisma.ChannelJoinRequestUncheckedUpdateManyWithoutChannelInput>;
};
export type ChannelJoinRequestCreateManyUserInput = {
    id?: string;
    channelId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedById?: string | null;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestCreateManyDecidedByInput = {
    id?: string;
    channelId: string;
    userId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    channel?: Prisma.ChannelUpdateOneRequiredWithoutJoinRequestsNestedInput;
    decidedBy?: Prisma.UserUpdateOneWithoutChannelJoinRequestsDecidedNestedInput;
};
export type ChannelJoinRequestUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestUpdateWithoutDecidedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    channel?: Prisma.ChannelUpdateOneRequiredWithoutJoinRequestsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutChannelJoinRequestsMadeNestedInput;
};
export type ChannelJoinRequestUncheckedUpdateWithoutDecidedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestUncheckedUpdateManyWithoutDecidedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestCreateManyChannelInput = {
    id?: string;
    userId: string;
    status?: $Enums.ChannelJoinRequestStatus;
    requestedAt?: Date | string;
    decidedById?: string | null;
    decidedAt?: Date | string | null;
};
export type ChannelJoinRequestUpdateWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutChannelJoinRequestsMadeNestedInput;
    decidedBy?: Prisma.UserUpdateOneWithoutChannelJoinRequestsDecidedNestedInput;
};
export type ChannelJoinRequestUncheckedUpdateWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestUncheckedUpdateManyWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumChannelJoinRequestStatusFieldUpdateOperationsInput | $Enums.ChannelJoinRequestStatus;
    requestedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    decidedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ChannelJoinRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    status?: boolean;
    requestedAt?: boolean;
    decidedById?: boolean;
    decidedAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    decidedBy?: boolean | Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs>;
}, ExtArgs["result"]["channelJoinRequest"]>;
export type ChannelJoinRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    status?: boolean;
    requestedAt?: boolean;
    decidedById?: boolean;
    decidedAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    decidedBy?: boolean | Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs>;
}, ExtArgs["result"]["channelJoinRequest"]>;
export type ChannelJoinRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    status?: boolean;
    requestedAt?: boolean;
    decidedById?: boolean;
    decidedAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    decidedBy?: boolean | Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs>;
}, ExtArgs["result"]["channelJoinRequest"]>;
export type ChannelJoinRequestSelectScalar = {
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    status?: boolean;
    requestedAt?: boolean;
    decidedById?: boolean;
    decidedAt?: boolean;
};
export type ChannelJoinRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "channelId" | "userId" | "status" | "requestedAt" | "decidedById" | "decidedAt", ExtArgs["result"]["channelJoinRequest"]>;
export type ChannelJoinRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    decidedBy?: boolean | Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs>;
};
export type ChannelJoinRequestIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    decidedBy?: boolean | Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs>;
};
export type ChannelJoinRequestIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    decidedBy?: boolean | Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs>;
};
export type $ChannelJoinRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChannelJoinRequest";
    objects: {
        channel: Prisma.$ChannelPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
        decidedBy: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        channelId: string;
        userId: string;
        status: $Enums.ChannelJoinRequestStatus;
        requestedAt: Date;
        decidedById: string | null;
        decidedAt: Date | null;
    }, ExtArgs["result"]["channelJoinRequest"]>;
    composites: {};
};
export type ChannelJoinRequestGetPayload<S extends boolean | null | undefined | ChannelJoinRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload, S>;
export type ChannelJoinRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChannelJoinRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChannelJoinRequestCountAggregateInputType | true;
};
export interface ChannelJoinRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChannelJoinRequest'];
        meta: {
            name: 'ChannelJoinRequest';
        };
    };
    findUnique<T extends ChannelJoinRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChannelJoinRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChannelJoinRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, ChannelJoinRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChannelJoinRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChannelJoinRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChannelJoinRequestFindManyArgs>(args?: Prisma.SelectSubset<T, ChannelJoinRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChannelJoinRequestCreateArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestCreateArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChannelJoinRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, ChannelJoinRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChannelJoinRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChannelJoinRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChannelJoinRequestDeleteArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChannelJoinRequestUpdateArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChannelJoinRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChannelJoinRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChannelJoinRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChannelJoinRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChannelJoinRequestUpsertArgs>(args: Prisma.SelectSubset<T, ChannelJoinRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__ChannelJoinRequestClient<runtime.Types.Result.GetResult<Prisma.$ChannelJoinRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChannelJoinRequestCountArgs>(args?: Prisma.Subset<T, ChannelJoinRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChannelJoinRequestCountAggregateOutputType> : number>;
    aggregate<T extends ChannelJoinRequestAggregateArgs>(args: Prisma.Subset<T, ChannelJoinRequestAggregateArgs>): Prisma.PrismaPromise<GetChannelJoinRequestAggregateType<T>>;
    groupBy<T extends ChannelJoinRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChannelJoinRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: ChannelJoinRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChannelJoinRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelJoinRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChannelJoinRequestFieldRefs;
}
export interface Prisma__ChannelJoinRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    channel<T extends Prisma.ChannelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChannelDefaultArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    decidedBy<T extends Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChannelJoinRequest$decidedByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChannelJoinRequestFieldRefs {
    readonly id: Prisma.FieldRef<"ChannelJoinRequest", 'String'>;
    readonly channelId: Prisma.FieldRef<"ChannelJoinRequest", 'String'>;
    readonly userId: Prisma.FieldRef<"ChannelJoinRequest", 'String'>;
    readonly status: Prisma.FieldRef<"ChannelJoinRequest", 'ChannelJoinRequestStatus'>;
    readonly requestedAt: Prisma.FieldRef<"ChannelJoinRequest", 'DateTime'>;
    readonly decidedById: Prisma.FieldRef<"ChannelJoinRequest", 'String'>;
    readonly decidedAt: Prisma.FieldRef<"ChannelJoinRequest", 'DateTime'>;
}
export type ChannelJoinRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
};
export type ChannelJoinRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
};
export type ChannelJoinRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    where?: Prisma.ChannelJoinRequestWhereInput;
    orderBy?: Prisma.ChannelJoinRequestOrderByWithRelationInput | Prisma.ChannelJoinRequestOrderByWithRelationInput[];
    cursor?: Prisma.ChannelJoinRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelJoinRequestScalarFieldEnum | Prisma.ChannelJoinRequestScalarFieldEnum[];
};
export type ChannelJoinRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    where?: Prisma.ChannelJoinRequestWhereInput;
    orderBy?: Prisma.ChannelJoinRequestOrderByWithRelationInput | Prisma.ChannelJoinRequestOrderByWithRelationInput[];
    cursor?: Prisma.ChannelJoinRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelJoinRequestScalarFieldEnum | Prisma.ChannelJoinRequestScalarFieldEnum[];
};
export type ChannelJoinRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    where?: Prisma.ChannelJoinRequestWhereInput;
    orderBy?: Prisma.ChannelJoinRequestOrderByWithRelationInput | Prisma.ChannelJoinRequestOrderByWithRelationInput[];
    cursor?: Prisma.ChannelJoinRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelJoinRequestScalarFieldEnum | Prisma.ChannelJoinRequestScalarFieldEnum[];
};
export type ChannelJoinRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelJoinRequestCreateInput, Prisma.ChannelJoinRequestUncheckedCreateInput>;
};
export type ChannelJoinRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChannelJoinRequestCreateManyInput | Prisma.ChannelJoinRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChannelJoinRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    data: Prisma.ChannelJoinRequestCreateManyInput | Prisma.ChannelJoinRequestCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChannelJoinRequestIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChannelJoinRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateInput, Prisma.ChannelJoinRequestUncheckedUpdateInput>;
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
};
export type ChannelJoinRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateManyMutationInput, Prisma.ChannelJoinRequestUncheckedUpdateManyInput>;
    where?: Prisma.ChannelJoinRequestWhereInput;
    limit?: number;
};
export type ChannelJoinRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelJoinRequestUpdateManyMutationInput, Prisma.ChannelJoinRequestUncheckedUpdateManyInput>;
    where?: Prisma.ChannelJoinRequestWhereInput;
    limit?: number;
    include?: Prisma.ChannelJoinRequestIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChannelJoinRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelJoinRequestCreateInput, Prisma.ChannelJoinRequestUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChannelJoinRequestUpdateInput, Prisma.ChannelJoinRequestUncheckedUpdateInput>;
};
export type ChannelJoinRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
    where: Prisma.ChannelJoinRequestWhereUniqueInput;
};
export type ChannelJoinRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelJoinRequestWhereInput;
    limit?: number;
};
export type ChannelJoinRequest$decidedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type ChannelJoinRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelJoinRequestSelect<ExtArgs> | null;
    omit?: Prisma.ChannelJoinRequestOmit<ExtArgs> | null;
    include?: Prisma.ChannelJoinRequestInclude<ExtArgs> | null;
};
