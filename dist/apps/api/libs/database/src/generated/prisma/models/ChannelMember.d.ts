import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ChannelMemberModel = runtime.Types.Result.DefaultSelection<Prisma.$ChannelMemberPayload>;
export type AggregateChannelMember = {
    _count: ChannelMemberCountAggregateOutputType | null;
    _min: ChannelMemberMinAggregateOutputType | null;
    _max: ChannelMemberMaxAggregateOutputType | null;
};
export type ChannelMemberMinAggregateOutputType = {
    id: string | null;
    channelId: string | null;
    userId: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
};
export type ChannelMemberMaxAggregateOutputType = {
    id: string | null;
    channelId: string | null;
    userId: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
};
export type ChannelMemberCountAggregateOutputType = {
    id: number;
    channelId: number;
    userId: number;
    role: number;
    createdAt: number;
    _all: number;
};
export type ChannelMemberMinAggregateInputType = {
    id?: true;
    channelId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
};
export type ChannelMemberMaxAggregateInputType = {
    id?: true;
    channelId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
};
export type ChannelMemberCountAggregateInputType = {
    id?: true;
    channelId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
    _all?: true;
};
export type ChannelMemberAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMemberWhereInput;
    orderBy?: Prisma.ChannelMemberOrderByWithRelationInput | Prisma.ChannelMemberOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChannelMemberCountAggregateInputType;
    _min?: ChannelMemberMinAggregateInputType;
    _max?: ChannelMemberMaxAggregateInputType;
};
export type GetChannelMemberAggregateType<T extends ChannelMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateChannelMember]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChannelMember[P]> : Prisma.GetScalarType<T[P], AggregateChannelMember[P]>;
};
export type ChannelMemberGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMemberWhereInput;
    orderBy?: Prisma.ChannelMemberOrderByWithAggregationInput | Prisma.ChannelMemberOrderByWithAggregationInput[];
    by: Prisma.ChannelMemberScalarFieldEnum[] | Prisma.ChannelMemberScalarFieldEnum;
    having?: Prisma.ChannelMemberScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChannelMemberCountAggregateInputType | true;
    _min?: ChannelMemberMinAggregateInputType;
    _max?: ChannelMemberMaxAggregateInputType;
};
export type ChannelMemberGroupByOutputType = {
    id: string;
    channelId: string;
    userId: string;
    role: $Enums.Role;
    createdAt: Date;
    _count: ChannelMemberCountAggregateOutputType | null;
    _min: ChannelMemberMinAggregateOutputType | null;
    _max: ChannelMemberMaxAggregateOutputType | null;
};
export type GetChannelMemberGroupByPayload<T extends ChannelMemberGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChannelMemberGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChannelMemberGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChannelMemberGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChannelMemberGroupByOutputType[P]>;
}>>;
export type ChannelMemberWhereInput = {
    AND?: Prisma.ChannelMemberWhereInput | Prisma.ChannelMemberWhereInput[];
    OR?: Prisma.ChannelMemberWhereInput[];
    NOT?: Prisma.ChannelMemberWhereInput | Prisma.ChannelMemberWhereInput[];
    id?: Prisma.StringFilter<"ChannelMember"> | string;
    channelId?: Prisma.StringFilter<"ChannelMember"> | string;
    userId?: Prisma.StringFilter<"ChannelMember"> | string;
    role?: Prisma.EnumRoleFilter<"ChannelMember"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"ChannelMember"> | Date | string;
    channel?: Prisma.XOR<Prisma.ChannelScalarRelationFilter, Prisma.ChannelWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ChannelMemberOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    channel?: Prisma.ChannelOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ChannelMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    channelId_userId?: Prisma.ChannelMemberChannelIdUserIdCompoundUniqueInput;
    AND?: Prisma.ChannelMemberWhereInput | Prisma.ChannelMemberWhereInput[];
    OR?: Prisma.ChannelMemberWhereInput[];
    NOT?: Prisma.ChannelMemberWhereInput | Prisma.ChannelMemberWhereInput[];
    channelId?: Prisma.StringFilter<"ChannelMember"> | string;
    userId?: Prisma.StringFilter<"ChannelMember"> | string;
    role?: Prisma.EnumRoleFilter<"ChannelMember"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"ChannelMember"> | Date | string;
    channel?: Prisma.XOR<Prisma.ChannelScalarRelationFilter, Prisma.ChannelWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "channelId_userId">;
export type ChannelMemberOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ChannelMemberCountOrderByAggregateInput;
    _max?: Prisma.ChannelMemberMaxOrderByAggregateInput;
    _min?: Prisma.ChannelMemberMinOrderByAggregateInput;
};
export type ChannelMemberScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChannelMemberScalarWhereWithAggregatesInput | Prisma.ChannelMemberScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChannelMemberScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChannelMemberScalarWhereWithAggregatesInput | Prisma.ChannelMemberScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ChannelMember"> | string;
    channelId?: Prisma.StringWithAggregatesFilter<"ChannelMember"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ChannelMember"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"ChannelMember"> | $Enums.Role;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ChannelMember"> | Date | string;
};
export type ChannelMemberCreateInput = {
    id?: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
    channel: Prisma.ChannelCreateNestedOneWithoutMembersInput;
    user: Prisma.UserCreateNestedOneWithoutChannelMembersInput;
};
export type ChannelMemberUncheckedCreateInput = {
    id?: string;
    channelId: string;
    userId: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
};
export type ChannelMemberUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    channel?: Prisma.ChannelUpdateOneRequiredWithoutMembersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutChannelMembersNestedInput;
};
export type ChannelMemberUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMemberCreateManyInput = {
    id?: string;
    channelId: string;
    userId: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
};
export type ChannelMemberUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMemberUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMemberListRelationFilter = {
    every?: Prisma.ChannelMemberWhereInput;
    some?: Prisma.ChannelMemberWhereInput;
    none?: Prisma.ChannelMemberWhereInput;
};
export type ChannelMemberOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChannelMemberChannelIdUserIdCompoundUniqueInput = {
    channelId: string;
    userId: string;
};
export type ChannelMemberCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMemberMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMemberMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    channelId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ChannelMemberCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutUserInput, Prisma.ChannelMemberUncheckedCreateWithoutUserInput> | Prisma.ChannelMemberCreateWithoutUserInput[] | Prisma.ChannelMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutUserInput | Prisma.ChannelMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChannelMemberCreateManyUserInputEnvelope;
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
};
export type ChannelMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutUserInput, Prisma.ChannelMemberUncheckedCreateWithoutUserInput> | Prisma.ChannelMemberCreateWithoutUserInput[] | Prisma.ChannelMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutUserInput | Prisma.ChannelMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ChannelMemberCreateManyUserInputEnvelope;
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
};
export type ChannelMemberUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutUserInput, Prisma.ChannelMemberUncheckedCreateWithoutUserInput> | Prisma.ChannelMemberCreateWithoutUserInput[] | Prisma.ChannelMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutUserInput | Prisma.ChannelMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChannelMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.ChannelMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChannelMemberCreateManyUserInputEnvelope;
    set?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    disconnect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    delete?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    update?: Prisma.ChannelMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.ChannelMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChannelMemberUpdateManyWithWhereWithoutUserInput | Prisma.ChannelMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChannelMemberScalarWhereInput | Prisma.ChannelMemberScalarWhereInput[];
};
export type ChannelMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutUserInput, Prisma.ChannelMemberUncheckedCreateWithoutUserInput> | Prisma.ChannelMemberCreateWithoutUserInput[] | Prisma.ChannelMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutUserInput | Prisma.ChannelMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ChannelMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.ChannelMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ChannelMemberCreateManyUserInputEnvelope;
    set?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    disconnect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    delete?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    update?: Prisma.ChannelMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.ChannelMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ChannelMemberUpdateManyWithWhereWithoutUserInput | Prisma.ChannelMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ChannelMemberScalarWhereInput | Prisma.ChannelMemberScalarWhereInput[];
};
export type ChannelMemberCreateNestedManyWithoutChannelInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutChannelInput, Prisma.ChannelMemberUncheckedCreateWithoutChannelInput> | Prisma.ChannelMemberCreateWithoutChannelInput[] | Prisma.ChannelMemberUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutChannelInput | Prisma.ChannelMemberCreateOrConnectWithoutChannelInput[];
    createMany?: Prisma.ChannelMemberCreateManyChannelInputEnvelope;
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
};
export type ChannelMemberUncheckedCreateNestedManyWithoutChannelInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutChannelInput, Prisma.ChannelMemberUncheckedCreateWithoutChannelInput> | Prisma.ChannelMemberCreateWithoutChannelInput[] | Prisma.ChannelMemberUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutChannelInput | Prisma.ChannelMemberCreateOrConnectWithoutChannelInput[];
    createMany?: Prisma.ChannelMemberCreateManyChannelInputEnvelope;
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
};
export type ChannelMemberUpdateManyWithoutChannelNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutChannelInput, Prisma.ChannelMemberUncheckedCreateWithoutChannelInput> | Prisma.ChannelMemberCreateWithoutChannelInput[] | Prisma.ChannelMemberUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutChannelInput | Prisma.ChannelMemberCreateOrConnectWithoutChannelInput[];
    upsert?: Prisma.ChannelMemberUpsertWithWhereUniqueWithoutChannelInput | Prisma.ChannelMemberUpsertWithWhereUniqueWithoutChannelInput[];
    createMany?: Prisma.ChannelMemberCreateManyChannelInputEnvelope;
    set?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    disconnect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    delete?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    update?: Prisma.ChannelMemberUpdateWithWhereUniqueWithoutChannelInput | Prisma.ChannelMemberUpdateWithWhereUniqueWithoutChannelInput[];
    updateMany?: Prisma.ChannelMemberUpdateManyWithWhereWithoutChannelInput | Prisma.ChannelMemberUpdateManyWithWhereWithoutChannelInput[];
    deleteMany?: Prisma.ChannelMemberScalarWhereInput | Prisma.ChannelMemberScalarWhereInput[];
};
export type ChannelMemberUncheckedUpdateManyWithoutChannelNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelMemberCreateWithoutChannelInput, Prisma.ChannelMemberUncheckedCreateWithoutChannelInput> | Prisma.ChannelMemberCreateWithoutChannelInput[] | Prisma.ChannelMemberUncheckedCreateWithoutChannelInput[];
    connectOrCreate?: Prisma.ChannelMemberCreateOrConnectWithoutChannelInput | Prisma.ChannelMemberCreateOrConnectWithoutChannelInput[];
    upsert?: Prisma.ChannelMemberUpsertWithWhereUniqueWithoutChannelInput | Prisma.ChannelMemberUpsertWithWhereUniqueWithoutChannelInput[];
    createMany?: Prisma.ChannelMemberCreateManyChannelInputEnvelope;
    set?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    disconnect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    delete?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    connect?: Prisma.ChannelMemberWhereUniqueInput | Prisma.ChannelMemberWhereUniqueInput[];
    update?: Prisma.ChannelMemberUpdateWithWhereUniqueWithoutChannelInput | Prisma.ChannelMemberUpdateWithWhereUniqueWithoutChannelInput[];
    updateMany?: Prisma.ChannelMemberUpdateManyWithWhereWithoutChannelInput | Prisma.ChannelMemberUpdateManyWithWhereWithoutChannelInput[];
    deleteMany?: Prisma.ChannelMemberScalarWhereInput | Prisma.ChannelMemberScalarWhereInput[];
};
export type ChannelMemberCreateWithoutUserInput = {
    id?: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
    channel: Prisma.ChannelCreateNestedOneWithoutMembersInput;
};
export type ChannelMemberUncheckedCreateWithoutUserInput = {
    id?: string;
    channelId: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
};
export type ChannelMemberCreateOrConnectWithoutUserInput = {
    where: Prisma.ChannelMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMemberCreateWithoutUserInput, Prisma.ChannelMemberUncheckedCreateWithoutUserInput>;
};
export type ChannelMemberCreateManyUserInputEnvelope = {
    data: Prisma.ChannelMemberCreateManyUserInput | Prisma.ChannelMemberCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ChannelMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChannelMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelMemberUpdateWithoutUserInput, Prisma.ChannelMemberUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ChannelMemberCreateWithoutUserInput, Prisma.ChannelMemberUncheckedCreateWithoutUserInput>;
};
export type ChannelMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ChannelMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelMemberUpdateWithoutUserInput, Prisma.ChannelMemberUncheckedUpdateWithoutUserInput>;
};
export type ChannelMemberUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ChannelMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelMemberUpdateManyMutationInput, Prisma.ChannelMemberUncheckedUpdateManyWithoutUserInput>;
};
export type ChannelMemberScalarWhereInput = {
    AND?: Prisma.ChannelMemberScalarWhereInput | Prisma.ChannelMemberScalarWhereInput[];
    OR?: Prisma.ChannelMemberScalarWhereInput[];
    NOT?: Prisma.ChannelMemberScalarWhereInput | Prisma.ChannelMemberScalarWhereInput[];
    id?: Prisma.StringFilter<"ChannelMember"> | string;
    channelId?: Prisma.StringFilter<"ChannelMember"> | string;
    userId?: Prisma.StringFilter<"ChannelMember"> | string;
    role?: Prisma.EnumRoleFilter<"ChannelMember"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"ChannelMember"> | Date | string;
};
export type ChannelMemberCreateWithoutChannelInput = {
    id?: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutChannelMembersInput;
};
export type ChannelMemberUncheckedCreateWithoutChannelInput = {
    id?: string;
    userId: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
};
export type ChannelMemberCreateOrConnectWithoutChannelInput = {
    where: Prisma.ChannelMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMemberCreateWithoutChannelInput, Prisma.ChannelMemberUncheckedCreateWithoutChannelInput>;
};
export type ChannelMemberCreateManyChannelInputEnvelope = {
    data: Prisma.ChannelMemberCreateManyChannelInput | Prisma.ChannelMemberCreateManyChannelInput[];
    skipDuplicates?: boolean;
};
export type ChannelMemberUpsertWithWhereUniqueWithoutChannelInput = {
    where: Prisma.ChannelMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelMemberUpdateWithoutChannelInput, Prisma.ChannelMemberUncheckedUpdateWithoutChannelInput>;
    create: Prisma.XOR<Prisma.ChannelMemberCreateWithoutChannelInput, Prisma.ChannelMemberUncheckedCreateWithoutChannelInput>;
};
export type ChannelMemberUpdateWithWhereUniqueWithoutChannelInput = {
    where: Prisma.ChannelMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelMemberUpdateWithoutChannelInput, Prisma.ChannelMemberUncheckedUpdateWithoutChannelInput>;
};
export type ChannelMemberUpdateManyWithWhereWithoutChannelInput = {
    where: Prisma.ChannelMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelMemberUpdateManyMutationInput, Prisma.ChannelMemberUncheckedUpdateManyWithoutChannelInput>;
};
export type ChannelMemberCreateManyUserInput = {
    id?: string;
    channelId: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
};
export type ChannelMemberUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    channel?: Prisma.ChannelUpdateOneRequiredWithoutMembersNestedInput;
};
export type ChannelMemberUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMemberUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    channelId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMemberCreateManyChannelInput = {
    id?: string;
    userId: string;
    role?: $Enums.Role;
    createdAt?: Date | string;
};
export type ChannelMemberUpdateWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutChannelMembersNestedInput;
};
export type ChannelMemberUncheckedUpdateWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMemberUncheckedUpdateManyWithoutChannelInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelMemberSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMember"]>;
export type ChannelMemberSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMember"]>;
export type ChannelMemberSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channelMember"]>;
export type ChannelMemberSelectScalar = {
    id?: boolean;
    channelId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
};
export type ChannelMemberOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "channelId" | "userId" | "role" | "createdAt", ExtArgs["result"]["channelMember"]>;
export type ChannelMemberInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ChannelMemberIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ChannelMemberIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    channel?: boolean | Prisma.ChannelDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ChannelMemberPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ChannelMember";
    objects: {
        channel: Prisma.$ChannelPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        channelId: string;
        userId: string;
        role: $Enums.Role;
        createdAt: Date;
    }, ExtArgs["result"]["channelMember"]>;
    composites: {};
};
export type ChannelMemberGetPayload<S extends boolean | null | undefined | ChannelMemberDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload, S>;
export type ChannelMemberCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChannelMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChannelMemberCountAggregateInputType | true;
};
export interface ChannelMemberDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ChannelMember'];
        meta: {
            name: 'ChannelMember';
        };
    };
    findUnique<T extends ChannelMemberFindUniqueArgs>(args: Prisma.SelectSubset<T, ChannelMemberFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChannelMemberFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChannelMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChannelMemberFindFirstArgs>(args?: Prisma.SelectSubset<T, ChannelMemberFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChannelMemberFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChannelMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChannelMemberFindManyArgs>(args?: Prisma.SelectSubset<T, ChannelMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChannelMemberCreateArgs>(args: Prisma.SelectSubset<T, ChannelMemberCreateArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChannelMemberCreateManyArgs>(args?: Prisma.SelectSubset<T, ChannelMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChannelMemberCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChannelMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChannelMemberDeleteArgs>(args: Prisma.SelectSubset<T, ChannelMemberDeleteArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChannelMemberUpdateArgs>(args: Prisma.SelectSubset<T, ChannelMemberUpdateArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChannelMemberDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChannelMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChannelMemberUpdateManyArgs>(args: Prisma.SelectSubset<T, ChannelMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChannelMemberUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChannelMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChannelMemberUpsertArgs>(args: Prisma.SelectSubset<T, ChannelMemberUpsertArgs<ExtArgs>>): Prisma.Prisma__ChannelMemberClient<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChannelMemberCountArgs>(args?: Prisma.Subset<T, ChannelMemberCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChannelMemberCountAggregateOutputType> : number>;
    aggregate<T extends ChannelMemberAggregateArgs>(args: Prisma.Subset<T, ChannelMemberAggregateArgs>): Prisma.PrismaPromise<GetChannelMemberAggregateType<T>>;
    groupBy<T extends ChannelMemberGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChannelMemberGroupByArgs['orderBy'];
    } : {
        orderBy?: ChannelMemberGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChannelMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChannelMemberFieldRefs;
}
export interface Prisma__ChannelMemberClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    channel<T extends Prisma.ChannelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ChannelDefaultArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChannelMemberFieldRefs {
    readonly id: Prisma.FieldRef<"ChannelMember", 'String'>;
    readonly channelId: Prisma.FieldRef<"ChannelMember", 'String'>;
    readonly userId: Prisma.FieldRef<"ChannelMember", 'String'>;
    readonly role: Prisma.FieldRef<"ChannelMember", 'Role'>;
    readonly createdAt: Prisma.FieldRef<"ChannelMember", 'DateTime'>;
}
export type ChannelMemberFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    where: Prisma.ChannelMemberWhereUniqueInput;
};
export type ChannelMemberFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    where: Prisma.ChannelMemberWhereUniqueInput;
};
export type ChannelMemberFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    where?: Prisma.ChannelMemberWhereInput;
    orderBy?: Prisma.ChannelMemberOrderByWithRelationInput | Prisma.ChannelMemberOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMemberScalarFieldEnum | Prisma.ChannelMemberScalarFieldEnum[];
};
export type ChannelMemberFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    where?: Prisma.ChannelMemberWhereInput;
    orderBy?: Prisma.ChannelMemberOrderByWithRelationInput | Prisma.ChannelMemberOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMemberScalarFieldEnum | Prisma.ChannelMemberScalarFieldEnum[];
};
export type ChannelMemberFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    where?: Prisma.ChannelMemberWhereInput;
    orderBy?: Prisma.ChannelMemberOrderByWithRelationInput | Prisma.ChannelMemberOrderByWithRelationInput[];
    cursor?: Prisma.ChannelMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelMemberScalarFieldEnum | Prisma.ChannelMemberScalarFieldEnum[];
};
export type ChannelMemberCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMemberCreateInput, Prisma.ChannelMemberUncheckedCreateInput>;
};
export type ChannelMemberCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChannelMemberCreateManyInput | Prisma.ChannelMemberCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChannelMemberCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    data: Prisma.ChannelMemberCreateManyInput | Prisma.ChannelMemberCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChannelMemberIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChannelMemberUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMemberUpdateInput, Prisma.ChannelMemberUncheckedUpdateInput>;
    where: Prisma.ChannelMemberWhereUniqueInput;
};
export type ChannelMemberUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChannelMemberUpdateManyMutationInput, Prisma.ChannelMemberUncheckedUpdateManyInput>;
    where?: Prisma.ChannelMemberWhereInput;
    limit?: number;
};
export type ChannelMemberUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelMemberUpdateManyMutationInput, Prisma.ChannelMemberUncheckedUpdateManyInput>;
    where?: Prisma.ChannelMemberWhereInput;
    limit?: number;
    include?: Prisma.ChannelMemberIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChannelMemberUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    where: Prisma.ChannelMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelMemberCreateInput, Prisma.ChannelMemberUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChannelMemberUpdateInput, Prisma.ChannelMemberUncheckedUpdateInput>;
};
export type ChannelMemberDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
    where: Prisma.ChannelMemberWhereUniqueInput;
};
export type ChannelMemberDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMemberWhereInput;
    limit?: number;
};
export type ChannelMemberDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelMemberSelect<ExtArgs> | null;
    omit?: Prisma.ChannelMemberOmit<ExtArgs> | null;
    include?: Prisma.ChannelMemberInclude<ExtArgs> | null;
};
