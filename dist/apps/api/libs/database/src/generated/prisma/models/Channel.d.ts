import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ChannelModel = runtime.Types.Result.DefaultSelection<Prisma.$ChannelPayload>;
export type AggregateChannel = {
    _count: ChannelCountAggregateOutputType | null;
    _min: ChannelMinAggregateOutputType | null;
    _max: ChannelMaxAggregateOutputType | null;
};
export type ChannelMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    projectId: string | null;
    name: string | null;
    description: string | null;
    privacy: $Enums.ChannelPrivacy | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ChannelMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    projectId: string | null;
    name: string | null;
    description: string | null;
    privacy: $Enums.ChannelPrivacy | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ChannelCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    projectId: number;
    name: number;
    description: number;
    privacy: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ChannelMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    projectId?: true;
    name?: true;
    description?: true;
    privacy?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ChannelMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    projectId?: true;
    name?: true;
    description?: true;
    privacy?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ChannelCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    projectId?: true;
    name?: true;
    description?: true;
    privacy?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ChannelAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelWhereInput;
    orderBy?: Prisma.ChannelOrderByWithRelationInput | Prisma.ChannelOrderByWithRelationInput[];
    cursor?: Prisma.ChannelWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ChannelCountAggregateInputType;
    _min?: ChannelMinAggregateInputType;
    _max?: ChannelMaxAggregateInputType;
};
export type GetChannelAggregateType<T extends ChannelAggregateArgs> = {
    [P in keyof T & keyof AggregateChannel]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateChannel[P]> : Prisma.GetScalarType<T[P], AggregateChannel[P]>;
};
export type ChannelGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelWhereInput;
    orderBy?: Prisma.ChannelOrderByWithAggregationInput | Prisma.ChannelOrderByWithAggregationInput[];
    by: Prisma.ChannelScalarFieldEnum[] | Prisma.ChannelScalarFieldEnum;
    having?: Prisma.ChannelScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChannelCountAggregateInputType | true;
    _min?: ChannelMinAggregateInputType;
    _max?: ChannelMaxAggregateInputType;
};
export type ChannelGroupByOutputType = {
    id: string;
    workspaceId: string;
    projectId: string | null;
    name: string;
    description: string | null;
    privacy: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    _count: ChannelCountAggregateOutputType | null;
    _min: ChannelMinAggregateOutputType | null;
    _max: ChannelMaxAggregateOutputType | null;
};
export type GetChannelGroupByPayload<T extends ChannelGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ChannelGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ChannelGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ChannelGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ChannelGroupByOutputType[P]>;
}>>;
export type ChannelWhereInput = {
    AND?: Prisma.ChannelWhereInput | Prisma.ChannelWhereInput[];
    OR?: Prisma.ChannelWhereInput[];
    NOT?: Prisma.ChannelWhereInput | Prisma.ChannelWhereInput[];
    id?: Prisma.StringFilter<"Channel"> | string;
    workspaceId?: Prisma.StringFilter<"Channel"> | string;
    projectId?: Prisma.StringNullableFilter<"Channel"> | string | null;
    name?: Prisma.StringFilter<"Channel"> | string;
    description?: Prisma.StringNullableFilter<"Channel"> | string | null;
    privacy?: Prisma.EnumChannelPrivacyFilter<"Channel"> | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFilter<"Channel"> | string;
    createdAt?: Prisma.DateTimeFilter<"Channel"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Channel"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    project?: Prisma.XOR<Prisma.ProjectNullableScalarRelationFilter, Prisma.ProjectWhereInput> | null;
    members?: Prisma.ChannelMemberListRelationFilter;
};
export type ChannelOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    privacy?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    project?: Prisma.ProjectOrderByWithRelationInput;
    members?: Prisma.ChannelMemberOrderByRelationAggregateInput;
};
export type ChannelWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ChannelWhereInput | Prisma.ChannelWhereInput[];
    OR?: Prisma.ChannelWhereInput[];
    NOT?: Prisma.ChannelWhereInput | Prisma.ChannelWhereInput[];
    workspaceId?: Prisma.StringFilter<"Channel"> | string;
    projectId?: Prisma.StringNullableFilter<"Channel"> | string | null;
    name?: Prisma.StringFilter<"Channel"> | string;
    description?: Prisma.StringNullableFilter<"Channel"> | string | null;
    privacy?: Prisma.EnumChannelPrivacyFilter<"Channel"> | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFilter<"Channel"> | string;
    createdAt?: Prisma.DateTimeFilter<"Channel"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Channel"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    project?: Prisma.XOR<Prisma.ProjectNullableScalarRelationFilter, Prisma.ProjectWhereInput> | null;
    members?: Prisma.ChannelMemberListRelationFilter;
}, "id">;
export type ChannelOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    privacy?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ChannelCountOrderByAggregateInput;
    _max?: Prisma.ChannelMaxOrderByAggregateInput;
    _min?: Prisma.ChannelMinOrderByAggregateInput;
};
export type ChannelScalarWhereWithAggregatesInput = {
    AND?: Prisma.ChannelScalarWhereWithAggregatesInput | Prisma.ChannelScalarWhereWithAggregatesInput[];
    OR?: Prisma.ChannelScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ChannelScalarWhereWithAggregatesInput | Prisma.ChannelScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Channel"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"Channel"> | string;
    projectId?: Prisma.StringNullableWithAggregatesFilter<"Channel"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"Channel"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Channel"> | string | null;
    privacy?: Prisma.EnumChannelPrivacyWithAggregatesFilter<"Channel"> | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringWithAggregatesFilter<"Channel"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Channel"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Channel"> | Date | string;
};
export type ChannelCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutChannelsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutChannelsInput;
    members?: Prisma.ChannelMemberCreateNestedManyWithoutChannelInput;
};
export type ChannelUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.ChannelMemberUncheckedCreateNestedManyWithoutChannelInput;
};
export type ChannelUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutChannelsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutChannelsNestedInput;
    members?: Prisma.ChannelMemberUpdateManyWithoutChannelNestedInput;
};
export type ChannelUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.ChannelMemberUncheckedUpdateManyWithoutChannelNestedInput;
};
export type ChannelCreateManyInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelListRelationFilter = {
    every?: Prisma.ChannelWhereInput;
    some?: Prisma.ChannelWhereInput;
    none?: Prisma.ChannelWhereInput;
};
export type ChannelOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ChannelCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    privacy?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChannelMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    privacy?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChannelMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    privacy?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ChannelScalarRelationFilter = {
    is?: Prisma.ChannelWhereInput;
    isNot?: Prisma.ChannelWhereInput;
};
export type ChannelCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutWorkspaceInput, Prisma.ChannelUncheckedCreateWithoutWorkspaceInput> | Prisma.ChannelCreateWithoutWorkspaceInput[] | Prisma.ChannelUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutWorkspaceInput | Prisma.ChannelCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.ChannelCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
};
export type ChannelUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutWorkspaceInput, Prisma.ChannelUncheckedCreateWithoutWorkspaceInput> | Prisma.ChannelCreateWithoutWorkspaceInput[] | Prisma.ChannelUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutWorkspaceInput | Prisma.ChannelCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.ChannelCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
};
export type ChannelUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutWorkspaceInput, Prisma.ChannelUncheckedCreateWithoutWorkspaceInput> | Prisma.ChannelCreateWithoutWorkspaceInput[] | Prisma.ChannelUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutWorkspaceInput | Prisma.ChannelCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.ChannelUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.ChannelUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.ChannelCreateManyWorkspaceInputEnvelope;
    set?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    disconnect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    delete?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    update?: Prisma.ChannelUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.ChannelUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.ChannelUpdateManyWithWhereWithoutWorkspaceInput | Prisma.ChannelUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.ChannelScalarWhereInput | Prisma.ChannelScalarWhereInput[];
};
export type ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutWorkspaceInput, Prisma.ChannelUncheckedCreateWithoutWorkspaceInput> | Prisma.ChannelCreateWithoutWorkspaceInput[] | Prisma.ChannelUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutWorkspaceInput | Prisma.ChannelCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.ChannelUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.ChannelUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.ChannelCreateManyWorkspaceInputEnvelope;
    set?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    disconnect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    delete?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    update?: Prisma.ChannelUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.ChannelUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.ChannelUpdateManyWithWhereWithoutWorkspaceInput | Prisma.ChannelUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.ChannelScalarWhereInput | Prisma.ChannelScalarWhereInput[];
};
export type ChannelCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutProjectInput, Prisma.ChannelUncheckedCreateWithoutProjectInput> | Prisma.ChannelCreateWithoutProjectInput[] | Prisma.ChannelUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutProjectInput | Prisma.ChannelCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ChannelCreateManyProjectInputEnvelope;
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
};
export type ChannelUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutProjectInput, Prisma.ChannelUncheckedCreateWithoutProjectInput> | Prisma.ChannelCreateWithoutProjectInput[] | Prisma.ChannelUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutProjectInput | Prisma.ChannelCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ChannelCreateManyProjectInputEnvelope;
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
};
export type ChannelUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutProjectInput, Prisma.ChannelUncheckedCreateWithoutProjectInput> | Prisma.ChannelCreateWithoutProjectInput[] | Prisma.ChannelUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutProjectInput | Prisma.ChannelCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ChannelUpsertWithWhereUniqueWithoutProjectInput | Prisma.ChannelUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ChannelCreateManyProjectInputEnvelope;
    set?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    disconnect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    delete?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    update?: Prisma.ChannelUpdateWithWhereUniqueWithoutProjectInput | Prisma.ChannelUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ChannelUpdateManyWithWhereWithoutProjectInput | Prisma.ChannelUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ChannelScalarWhereInput | Prisma.ChannelScalarWhereInput[];
};
export type ChannelUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutProjectInput, Prisma.ChannelUncheckedCreateWithoutProjectInput> | Prisma.ChannelCreateWithoutProjectInput[] | Prisma.ChannelUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutProjectInput | Prisma.ChannelCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ChannelUpsertWithWhereUniqueWithoutProjectInput | Prisma.ChannelUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ChannelCreateManyProjectInputEnvelope;
    set?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    disconnect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    delete?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    connect?: Prisma.ChannelWhereUniqueInput | Prisma.ChannelWhereUniqueInput[];
    update?: Prisma.ChannelUpdateWithWhereUniqueWithoutProjectInput | Prisma.ChannelUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ChannelUpdateManyWithWhereWithoutProjectInput | Prisma.ChannelUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ChannelScalarWhereInput | Prisma.ChannelScalarWhereInput[];
};
export type EnumChannelPrivacyFieldUpdateOperationsInput = {
    set?: $Enums.ChannelPrivacy;
};
export type ChannelCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutMembersInput, Prisma.ChannelUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutMembersInput;
    connect?: Prisma.ChannelWhereUniqueInput;
};
export type ChannelUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.ChannelCreateWithoutMembersInput, Prisma.ChannelUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.ChannelCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.ChannelUpsertWithoutMembersInput;
    connect?: Prisma.ChannelWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ChannelUpdateToOneWithWhereWithoutMembersInput, Prisma.ChannelUpdateWithoutMembersInput>, Prisma.ChannelUncheckedUpdateWithoutMembersInput>;
};
export type ChannelCreateWithoutWorkspaceInput = {
    id?: string;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    project?: Prisma.ProjectCreateNestedOneWithoutChannelsInput;
    members?: Prisma.ChannelMemberCreateNestedManyWithoutChannelInput;
};
export type ChannelUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    projectId?: string | null;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.ChannelMemberUncheckedCreateNestedManyWithoutChannelInput;
};
export type ChannelCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.ChannelWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelCreateWithoutWorkspaceInput, Prisma.ChannelUncheckedCreateWithoutWorkspaceInput>;
};
export type ChannelCreateManyWorkspaceInputEnvelope = {
    data: Prisma.ChannelCreateManyWorkspaceInput | Prisma.ChannelCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type ChannelUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.ChannelWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelUpdateWithoutWorkspaceInput, Prisma.ChannelUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.ChannelCreateWithoutWorkspaceInput, Prisma.ChannelUncheckedCreateWithoutWorkspaceInput>;
};
export type ChannelUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.ChannelWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelUpdateWithoutWorkspaceInput, Prisma.ChannelUncheckedUpdateWithoutWorkspaceInput>;
};
export type ChannelUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.ChannelScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelUpdateManyMutationInput, Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type ChannelScalarWhereInput = {
    AND?: Prisma.ChannelScalarWhereInput | Prisma.ChannelScalarWhereInput[];
    OR?: Prisma.ChannelScalarWhereInput[];
    NOT?: Prisma.ChannelScalarWhereInput | Prisma.ChannelScalarWhereInput[];
    id?: Prisma.StringFilter<"Channel"> | string;
    workspaceId?: Prisma.StringFilter<"Channel"> | string;
    projectId?: Prisma.StringNullableFilter<"Channel"> | string | null;
    name?: Prisma.StringFilter<"Channel"> | string;
    description?: Prisma.StringNullableFilter<"Channel"> | string | null;
    privacy?: Prisma.EnumChannelPrivacyFilter<"Channel"> | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFilter<"Channel"> | string;
    createdAt?: Prisma.DateTimeFilter<"Channel"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Channel"> | Date | string;
};
export type ChannelCreateWithoutProjectInput = {
    id?: string;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutChannelsInput;
    members?: Prisma.ChannelMemberCreateNestedManyWithoutChannelInput;
};
export type ChannelUncheckedCreateWithoutProjectInput = {
    id?: string;
    workspaceId: string;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.ChannelMemberUncheckedCreateNestedManyWithoutChannelInput;
};
export type ChannelCreateOrConnectWithoutProjectInput = {
    where: Prisma.ChannelWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelCreateWithoutProjectInput, Prisma.ChannelUncheckedCreateWithoutProjectInput>;
};
export type ChannelCreateManyProjectInputEnvelope = {
    data: Prisma.ChannelCreateManyProjectInput | Prisma.ChannelCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ChannelUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ChannelWhereUniqueInput;
    update: Prisma.XOR<Prisma.ChannelUpdateWithoutProjectInput, Prisma.ChannelUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ChannelCreateWithoutProjectInput, Prisma.ChannelUncheckedCreateWithoutProjectInput>;
};
export type ChannelUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ChannelWhereUniqueInput;
    data: Prisma.XOR<Prisma.ChannelUpdateWithoutProjectInput, Prisma.ChannelUncheckedUpdateWithoutProjectInput>;
};
export type ChannelUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ChannelScalarWhereInput;
    data: Prisma.XOR<Prisma.ChannelUpdateManyMutationInput, Prisma.ChannelUncheckedUpdateManyWithoutProjectInput>;
};
export type ChannelCreateWithoutMembersInput = {
    id?: string;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutChannelsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutChannelsInput;
};
export type ChannelUncheckedCreateWithoutMembersInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelCreateOrConnectWithoutMembersInput = {
    where: Prisma.ChannelWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelCreateWithoutMembersInput, Prisma.ChannelUncheckedCreateWithoutMembersInput>;
};
export type ChannelUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.ChannelUpdateWithoutMembersInput, Prisma.ChannelUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.ChannelCreateWithoutMembersInput, Prisma.ChannelUncheckedCreateWithoutMembersInput>;
    where?: Prisma.ChannelWhereInput;
};
export type ChannelUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.ChannelWhereInput;
    data: Prisma.XOR<Prisma.ChannelUpdateWithoutMembersInput, Prisma.ChannelUncheckedUpdateWithoutMembersInput>;
};
export type ChannelUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutChannelsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutChannelsNestedInput;
};
export type ChannelUncheckedUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelCreateManyWorkspaceInput = {
    id?: string;
    projectId?: string | null;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneWithoutChannelsNestedInput;
    members?: Prisma.ChannelMemberUpdateManyWithoutChannelNestedInput;
};
export type ChannelUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.ChannelMemberUncheckedUpdateManyWithoutChannelNestedInput;
};
export type ChannelUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelCreateManyProjectInput = {
    id?: string;
    workspaceId: string;
    name: string;
    description?: string | null;
    privacy?: $Enums.ChannelPrivacy;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ChannelUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutChannelsNestedInput;
    members?: Prisma.ChannelMemberUpdateManyWithoutChannelNestedInput;
};
export type ChannelUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.ChannelMemberUncheckedUpdateManyWithoutChannelNestedInput;
};
export type ChannelUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    privacy?: Prisma.EnumChannelPrivacyFieldUpdateOperationsInput | $Enums.ChannelPrivacy;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ChannelCountOutputType = {
    members: number;
};
export type ChannelCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | ChannelCountOutputTypeCountMembersArgs;
};
export type ChannelCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelCountOutputTypeSelect<ExtArgs> | null;
};
export type ChannelCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelMemberWhereInput;
};
export type ChannelSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    name?: boolean;
    description?: boolean;
    privacy?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Channel$projectArgs<ExtArgs>;
    members?: boolean | Prisma.Channel$membersArgs<ExtArgs>;
    _count?: boolean | Prisma.ChannelCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["channel"]>;
export type ChannelSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    name?: boolean;
    description?: boolean;
    privacy?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Channel$projectArgs<ExtArgs>;
}, ExtArgs["result"]["channel"]>;
export type ChannelSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    name?: boolean;
    description?: boolean;
    privacy?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Channel$projectArgs<ExtArgs>;
}, ExtArgs["result"]["channel"]>;
export type ChannelSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    name?: boolean;
    description?: boolean;
    privacy?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ChannelOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "projectId" | "name" | "description" | "privacy" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["channel"]>;
export type ChannelInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Channel$projectArgs<ExtArgs>;
    members?: boolean | Prisma.Channel$membersArgs<ExtArgs>;
    _count?: boolean | Prisma.ChannelCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ChannelIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Channel$projectArgs<ExtArgs>;
};
export type ChannelIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Channel$projectArgs<ExtArgs>;
};
export type $ChannelPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Channel";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        project: Prisma.$ProjectPayload<ExtArgs> | null;
        members: Prisma.$ChannelMemberPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        projectId: string | null;
        name: string;
        description: string | null;
        privacy: $Enums.ChannelPrivacy;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["channel"]>;
    composites: {};
};
export type ChannelGetPayload<S extends boolean | null | undefined | ChannelDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ChannelPayload, S>;
export type ChannelCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ChannelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChannelCountAggregateInputType | true;
};
export interface ChannelDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Channel'];
        meta: {
            name: 'Channel';
        };
    };
    findUnique<T extends ChannelFindUniqueArgs>(args: Prisma.SelectSubset<T, ChannelFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ChannelFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ChannelFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ChannelFindFirstArgs>(args?: Prisma.SelectSubset<T, ChannelFindFirstArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ChannelFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ChannelFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ChannelFindManyArgs>(args?: Prisma.SelectSubset<T, ChannelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ChannelCreateArgs>(args: Prisma.SelectSubset<T, ChannelCreateArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ChannelCreateManyArgs>(args?: Prisma.SelectSubset<T, ChannelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ChannelCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ChannelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ChannelDeleteArgs>(args: Prisma.SelectSubset<T, ChannelDeleteArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ChannelUpdateArgs>(args: Prisma.SelectSubset<T, ChannelUpdateArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ChannelDeleteManyArgs>(args?: Prisma.SelectSubset<T, ChannelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ChannelUpdateManyArgs>(args: Prisma.SelectSubset<T, ChannelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ChannelUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ChannelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ChannelUpsertArgs>(args: Prisma.SelectSubset<T, ChannelUpsertArgs<ExtArgs>>): Prisma.Prisma__ChannelClient<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ChannelCountArgs>(args?: Prisma.Subset<T, ChannelCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ChannelCountAggregateOutputType> : number>;
    aggregate<T extends ChannelAggregateArgs>(args: Prisma.Subset<T, ChannelAggregateArgs>): Prisma.PrismaPromise<GetChannelAggregateType<T>>;
    groupBy<T extends ChannelGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ChannelGroupByArgs['orderBy'];
    } : {
        orderBy?: ChannelGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ChannelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ChannelFieldRefs;
}
export interface Prisma__ChannelClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    project<T extends Prisma.Channel$projectArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Channel$projectArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Channel$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Channel$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ChannelFieldRefs {
    readonly id: Prisma.FieldRef<"Channel", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"Channel", 'String'>;
    readonly projectId: Prisma.FieldRef<"Channel", 'String'>;
    readonly name: Prisma.FieldRef<"Channel", 'String'>;
    readonly description: Prisma.FieldRef<"Channel", 'String'>;
    readonly privacy: Prisma.FieldRef<"Channel", 'ChannelPrivacy'>;
    readonly createdBy: Prisma.FieldRef<"Channel", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Channel", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Channel", 'DateTime'>;
}
export type ChannelFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    where: Prisma.ChannelWhereUniqueInput;
};
export type ChannelFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    where: Prisma.ChannelWhereUniqueInput;
};
export type ChannelFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    where?: Prisma.ChannelWhereInput;
    orderBy?: Prisma.ChannelOrderByWithRelationInput | Prisma.ChannelOrderByWithRelationInput[];
    cursor?: Prisma.ChannelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelScalarFieldEnum | Prisma.ChannelScalarFieldEnum[];
};
export type ChannelFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    where?: Prisma.ChannelWhereInput;
    orderBy?: Prisma.ChannelOrderByWithRelationInput | Prisma.ChannelOrderByWithRelationInput[];
    cursor?: Prisma.ChannelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelScalarFieldEnum | Prisma.ChannelScalarFieldEnum[];
};
export type ChannelFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    where?: Prisma.ChannelWhereInput;
    orderBy?: Prisma.ChannelOrderByWithRelationInput | Prisma.ChannelOrderByWithRelationInput[];
    cursor?: Prisma.ChannelWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChannelScalarFieldEnum | Prisma.ChannelScalarFieldEnum[];
};
export type ChannelCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelCreateInput, Prisma.ChannelUncheckedCreateInput>;
};
export type ChannelCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ChannelCreateManyInput | Prisma.ChannelCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ChannelCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    data: Prisma.ChannelCreateManyInput | Prisma.ChannelCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ChannelIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ChannelUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelUpdateInput, Prisma.ChannelUncheckedUpdateInput>;
    where: Prisma.ChannelWhereUniqueInput;
};
export type ChannelUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ChannelUpdateManyMutationInput, Prisma.ChannelUncheckedUpdateManyInput>;
    where?: Prisma.ChannelWhereInput;
    limit?: number;
};
export type ChannelUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ChannelUpdateManyMutationInput, Prisma.ChannelUncheckedUpdateManyInput>;
    where?: Prisma.ChannelWhereInput;
    limit?: number;
    include?: Prisma.ChannelIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ChannelUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    where: Prisma.ChannelWhereUniqueInput;
    create: Prisma.XOR<Prisma.ChannelCreateInput, Prisma.ChannelUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ChannelUpdateInput, Prisma.ChannelUncheckedUpdateInput>;
};
export type ChannelDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
    where: Prisma.ChannelWhereUniqueInput;
};
export type ChannelDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelWhereInput;
    limit?: number;
};
export type Channel$projectArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where?: Prisma.ProjectWhereInput;
};
export type Channel$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ChannelDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ChannelSelect<ExtArgs> | null;
    omit?: Prisma.ChannelOmit<ExtArgs> | null;
    include?: Prisma.ChannelInclude<ExtArgs> | null;
};
