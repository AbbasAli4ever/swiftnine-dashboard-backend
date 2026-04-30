import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type WorkspaceModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkspacePayload>;
export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null;
    _min: WorkspaceMinAggregateOutputType | null;
    _max: WorkspaceMaxAggregateOutputType | null;
};
export type WorkspaceMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    logoUrl: string | null;
    workspaceUse: $Enums.WorkspaceUse | null;
    managementType: $Enums.WorkspaceManagementType | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type WorkspaceMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    logoUrl: string | null;
    workspaceUse: $Enums.WorkspaceUse | null;
    managementType: $Enums.WorkspaceManagementType | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type WorkspaceCountAggregateOutputType = {
    id: number;
    name: number;
    logoUrl: number;
    workspaceUse: number;
    managementType: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type WorkspaceMinAggregateInputType = {
    id?: true;
    name?: true;
    logoUrl?: true;
    workspaceUse?: true;
    managementType?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type WorkspaceMaxAggregateInputType = {
    id?: true;
    name?: true;
    logoUrl?: true;
    workspaceUse?: true;
    managementType?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type WorkspaceCountAggregateInputType = {
    id?: true;
    name?: true;
    logoUrl?: true;
    workspaceUse?: true;
    managementType?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type WorkspaceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkspaceCountAggregateInputType;
    _min?: WorkspaceMinAggregateInputType;
    _max?: WorkspaceMaxAggregateInputType;
};
export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkspace[P]> : Prisma.GetScalarType<T[P], AggregateWorkspace[P]>;
};
export type WorkspaceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithAggregationInput | Prisma.WorkspaceOrderByWithAggregationInput[];
    by: Prisma.WorkspaceScalarFieldEnum[] | Prisma.WorkspaceScalarFieldEnum;
    having?: Prisma.WorkspaceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkspaceCountAggregateInputType | true;
    _min?: WorkspaceMinAggregateInputType;
    _max?: WorkspaceMaxAggregateInputType;
};
export type WorkspaceGroupByOutputType = {
    id: string;
    name: string;
    logoUrl: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: WorkspaceCountAggregateOutputType | null;
    _min: WorkspaceMinAggregateOutputType | null;
    _max: WorkspaceMaxAggregateOutputType | null;
};
export type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkspaceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkspaceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkspaceGroupByOutputType[P]>;
}>>;
export type WorkspaceWhereInput = {
    AND?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    OR?: Prisma.WorkspaceWhereInput[];
    NOT?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    id?: Prisma.StringFilter<"Workspace"> | string;
    name?: Prisma.StringFilter<"Workspace"> | string;
    logoUrl?: Prisma.StringNullableFilter<"Workspace"> | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFilter<"Workspace"> | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFilter<"Workspace"> | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Workspace"> | Date | string | null;
    creator?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.WorkspaceMemberListRelationFilter;
    invites?: Prisma.WorkspaceInviteListRelationFilter;
    projects?: Prisma.ProjectListRelationFilter;
    channels?: Prisma.ChannelListRelationFilter;
    tags?: Prisma.TagListRelationFilter;
    activityLogs?: Prisma.ActivityLogListRelationFilter;
    docs?: Prisma.DocListRelationFilter;
    projectFavorites?: Prisma.ProjectFavoriteListRelationFilter;
    taskFavorites?: Prisma.TaskFavoriteListRelationFilter;
};
export type WorkspaceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    workspaceUse?: Prisma.SortOrder;
    managementType?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    creator?: Prisma.UserOrderByWithRelationInput;
    members?: Prisma.WorkspaceMemberOrderByRelationAggregateInput;
    invites?: Prisma.WorkspaceInviteOrderByRelationAggregateInput;
    projects?: Prisma.ProjectOrderByRelationAggregateInput;
    channels?: Prisma.ChannelOrderByRelationAggregateInput;
    tags?: Prisma.TagOrderByRelationAggregateInput;
    activityLogs?: Prisma.ActivityLogOrderByRelationAggregateInput;
    docs?: Prisma.DocOrderByRelationAggregateInput;
    projectFavorites?: Prisma.ProjectFavoriteOrderByRelationAggregateInput;
    taskFavorites?: Prisma.TaskFavoriteOrderByRelationAggregateInput;
};
export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    OR?: Prisma.WorkspaceWhereInput[];
    NOT?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    name?: Prisma.StringFilter<"Workspace"> | string;
    logoUrl?: Prisma.StringNullableFilter<"Workspace"> | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFilter<"Workspace"> | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFilter<"Workspace"> | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Workspace"> | Date | string | null;
    creator?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.WorkspaceMemberListRelationFilter;
    invites?: Prisma.WorkspaceInviteListRelationFilter;
    projects?: Prisma.ProjectListRelationFilter;
    channels?: Prisma.ChannelListRelationFilter;
    tags?: Prisma.TagListRelationFilter;
    activityLogs?: Prisma.ActivityLogListRelationFilter;
    docs?: Prisma.DocListRelationFilter;
    projectFavorites?: Prisma.ProjectFavoriteListRelationFilter;
    taskFavorites?: Prisma.TaskFavoriteListRelationFilter;
}, "id">;
export type WorkspaceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    workspaceUse?: Prisma.SortOrder;
    managementType?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.WorkspaceCountOrderByAggregateInput;
    _max?: Prisma.WorkspaceMaxOrderByAggregateInput;
    _min?: Prisma.WorkspaceMinOrderByAggregateInput;
};
export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkspaceScalarWhereWithAggregatesInput | Prisma.WorkspaceScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkspaceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkspaceScalarWhereWithAggregatesInput | Prisma.WorkspaceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Workspace"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Workspace"> | string;
    logoUrl?: Prisma.StringNullableWithAggregatesFilter<"Workspace"> | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseWithAggregatesFilter<"Workspace"> | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeWithAggregatesFilter<"Workspace"> | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringWithAggregatesFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Workspace"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Workspace"> | Date | string | null;
};
export type WorkspaceCreateInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateManyInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type WorkspaceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WorkspaceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WorkspaceListRelationFilter = {
    every?: Prisma.WorkspaceWhereInput;
    some?: Prisma.WorkspaceWhereInput;
    none?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WorkspaceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    workspaceUse?: Prisma.SortOrder;
    managementType?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type WorkspaceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    workspaceUse?: Prisma.SortOrder;
    managementType?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type WorkspaceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    logoUrl?: Prisma.SortOrder;
    workspaceUse?: Prisma.SortOrder;
    managementType?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type WorkspaceScalarRelationFilter = {
    is?: Prisma.WorkspaceWhereInput;
    isNot?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceCreateNestedManyWithoutCreatorInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatorInput, Prisma.WorkspaceUncheckedCreateWithoutCreatorInput> | Prisma.WorkspaceCreateWithoutCreatorInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatorInput | Prisma.WorkspaceCreateOrConnectWithoutCreatorInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatorInputEnvelope;
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
};
export type WorkspaceUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatorInput, Prisma.WorkspaceUncheckedCreateWithoutCreatorInput> | Prisma.WorkspaceCreateWithoutCreatorInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatorInput | Prisma.WorkspaceCreateOrConnectWithoutCreatorInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatorInputEnvelope;
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
};
export type WorkspaceUpdateManyWithoutCreatorNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatorInput, Prisma.WorkspaceUncheckedCreateWithoutCreatorInput> | Prisma.WorkspaceCreateWithoutCreatorInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatorInput | Prisma.WorkspaceCreateOrConnectWithoutCreatorInput[];
    upsert?: Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatorInput | Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatorInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatorInputEnvelope;
    set?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    delete?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    update?: Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatorInput | Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatorInput[];
    updateMany?: Prisma.WorkspaceUpdateManyWithWhereWithoutCreatorInput | Prisma.WorkspaceUpdateManyWithWhereWithoutCreatorInput[];
    deleteMany?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
};
export type WorkspaceUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatorInput, Prisma.WorkspaceUncheckedCreateWithoutCreatorInput> | Prisma.WorkspaceCreateWithoutCreatorInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatorInput | Prisma.WorkspaceCreateOrConnectWithoutCreatorInput[];
    upsert?: Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatorInput | Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatorInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatorInputEnvelope;
    set?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    delete?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    update?: Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatorInput | Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatorInput[];
    updateMany?: Prisma.WorkspaceUpdateManyWithWhereWithoutCreatorInput | Prisma.WorkspaceUpdateManyWithWhereWithoutCreatorInput[];
    deleteMany?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
};
export type EnumWorkspaceUseFieldUpdateOperationsInput = {
    set?: $Enums.WorkspaceUse;
};
export type EnumWorkspaceManagementTypeFieldUpdateOperationsInput = {
    set?: $Enums.WorkspaceManagementType;
};
export type WorkspaceCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutMembersInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.WorkspaceUpsertWithoutMembersInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutMembersInput, Prisma.WorkspaceUpdateWithoutMembersInput>, Prisma.WorkspaceUncheckedUpdateWithoutMembersInput>;
};
export type WorkspaceCreateNestedOneWithoutInvitesInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutInvitesInput, Prisma.WorkspaceUncheckedCreateWithoutInvitesInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutInvitesInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutInvitesNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutInvitesInput, Prisma.WorkspaceUncheckedCreateWithoutInvitesInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutInvitesInput;
    upsert?: Prisma.WorkspaceUpsertWithoutInvitesInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutInvitesInput, Prisma.WorkspaceUpdateWithoutInvitesInput>, Prisma.WorkspaceUncheckedUpdateWithoutInvitesInput>;
};
export type WorkspaceCreateNestedOneWithoutProjectsInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectsInput, Prisma.WorkspaceUncheckedCreateWithoutProjectsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutProjectsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectsInput, Prisma.WorkspaceUncheckedCreateWithoutProjectsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutProjectsInput;
    upsert?: Prisma.WorkspaceUpsertWithoutProjectsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutProjectsInput, Prisma.WorkspaceUpdateWithoutProjectsInput>, Prisma.WorkspaceUncheckedUpdateWithoutProjectsInput>;
};
export type WorkspaceCreateNestedOneWithoutTagsInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutTagsInput, Prisma.WorkspaceUncheckedCreateWithoutTagsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutTagsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutTagsNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutTagsInput, Prisma.WorkspaceUncheckedCreateWithoutTagsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutTagsInput;
    upsert?: Prisma.WorkspaceUpsertWithoutTagsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutTagsInput, Prisma.WorkspaceUpdateWithoutTagsInput>, Prisma.WorkspaceUncheckedUpdateWithoutTagsInput>;
};
export type WorkspaceCreateNestedOneWithoutProjectFavoritesInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutProjectFavoritesInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutProjectFavoritesInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutProjectFavoritesNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutProjectFavoritesInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutProjectFavoritesInput;
    upsert?: Prisma.WorkspaceUpsertWithoutProjectFavoritesInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutProjectFavoritesInput, Prisma.WorkspaceUpdateWithoutProjectFavoritesInput>, Prisma.WorkspaceUncheckedUpdateWithoutProjectFavoritesInput>;
};
export type WorkspaceCreateNestedOneWithoutTaskFavoritesInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutTaskFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutTaskFavoritesInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutTaskFavoritesInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutTaskFavoritesNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutTaskFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutTaskFavoritesInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutTaskFavoritesInput;
    upsert?: Prisma.WorkspaceUpsertWithoutTaskFavoritesInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutTaskFavoritesInput, Prisma.WorkspaceUpdateWithoutTaskFavoritesInput>, Prisma.WorkspaceUncheckedUpdateWithoutTaskFavoritesInput>;
};
export type WorkspaceCreateNestedOneWithoutActivityLogsInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutActivityLogsInput, Prisma.WorkspaceUncheckedCreateWithoutActivityLogsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutActivityLogsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutActivityLogsNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutActivityLogsInput, Prisma.WorkspaceUncheckedCreateWithoutActivityLogsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutActivityLogsInput;
    upsert?: Prisma.WorkspaceUpsertWithoutActivityLogsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutActivityLogsInput, Prisma.WorkspaceUpdateWithoutActivityLogsInput>, Prisma.WorkspaceUncheckedUpdateWithoutActivityLogsInput>;
};
export type WorkspaceCreateNestedOneWithoutChannelsInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutChannelsInput, Prisma.WorkspaceUncheckedCreateWithoutChannelsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutChannelsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutChannelsNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutChannelsInput, Prisma.WorkspaceUncheckedCreateWithoutChannelsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutChannelsInput;
    upsert?: Prisma.WorkspaceUpsertWithoutChannelsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutChannelsInput, Prisma.WorkspaceUpdateWithoutChannelsInput>, Prisma.WorkspaceUncheckedUpdateWithoutChannelsInput>;
};
export type WorkspaceCreateNestedOneWithoutDocsInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutDocsInput, Prisma.WorkspaceUncheckedCreateWithoutDocsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutDocsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutDocsNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutDocsInput, Prisma.WorkspaceUncheckedCreateWithoutDocsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutDocsInput;
    upsert?: Prisma.WorkspaceUpsertWithoutDocsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutDocsInput, Prisma.WorkspaceUpdateWithoutDocsInput>, Prisma.WorkspaceUncheckedUpdateWithoutDocsInput>;
};
export type WorkspaceCreateWithoutCreatorInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutCreatorInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutCreatorInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatorInput, Prisma.WorkspaceUncheckedCreateWithoutCreatorInput>;
};
export type WorkspaceCreateManyCreatorInputEnvelope = {
    data: Prisma.WorkspaceCreateManyCreatorInput | Prisma.WorkspaceCreateManyCreatorInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceUpsertWithWhereUniqueWithoutCreatorInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutCreatorInput, Prisma.WorkspaceUncheckedUpdateWithoutCreatorInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatorInput, Prisma.WorkspaceUncheckedCreateWithoutCreatorInput>;
};
export type WorkspaceUpdateWithWhereUniqueWithoutCreatorInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutCreatorInput, Prisma.WorkspaceUncheckedUpdateWithoutCreatorInput>;
};
export type WorkspaceUpdateManyWithWhereWithoutCreatorInput = {
    where: Prisma.WorkspaceScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateManyMutationInput, Prisma.WorkspaceUncheckedUpdateManyWithoutCreatorInput>;
};
export type WorkspaceScalarWhereInput = {
    AND?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
    OR?: Prisma.WorkspaceScalarWhereInput[];
    NOT?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
    id?: Prisma.StringFilter<"Workspace"> | string;
    name?: Prisma.StringFilter<"Workspace"> | string;
    logoUrl?: Prisma.StringNullableFilter<"Workspace"> | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFilter<"Workspace"> | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFilter<"Workspace"> | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Workspace"> | Date | string | null;
};
export type WorkspaceCreateWithoutMembersInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutMembersInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutMembersInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
};
export type WorkspaceUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutMembersInput, Prisma.WorkspaceUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutMembersInput, Prisma.WorkspaceUncheckedUpdateWithoutMembersInput>;
};
export type WorkspaceUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutInvitesInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutInvitesInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutInvitesInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutInvitesInput, Prisma.WorkspaceUncheckedCreateWithoutInvitesInput>;
};
export type WorkspaceUpsertWithoutInvitesInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutInvitesInput, Prisma.WorkspaceUncheckedUpdateWithoutInvitesInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutInvitesInput, Prisma.WorkspaceUncheckedCreateWithoutInvitesInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutInvitesInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutInvitesInput, Prisma.WorkspaceUncheckedUpdateWithoutInvitesInput>;
};
export type WorkspaceUpdateWithoutInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutInvitesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutProjectsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutProjectsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutProjectsInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectsInput, Prisma.WorkspaceUncheckedCreateWithoutProjectsInput>;
};
export type WorkspaceUpsertWithoutProjectsInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutProjectsInput, Prisma.WorkspaceUncheckedUpdateWithoutProjectsInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectsInput, Prisma.WorkspaceUncheckedCreateWithoutProjectsInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutProjectsInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutProjectsInput, Prisma.WorkspaceUncheckedUpdateWithoutProjectsInput>;
};
export type WorkspaceUpdateWithoutProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutProjectsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutTagsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutTagsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutTagsInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutTagsInput, Prisma.WorkspaceUncheckedCreateWithoutTagsInput>;
};
export type WorkspaceUpsertWithoutTagsInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutTagsInput, Prisma.WorkspaceUncheckedUpdateWithoutTagsInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutTagsInput, Prisma.WorkspaceUncheckedCreateWithoutTagsInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutTagsInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutTagsInput, Prisma.WorkspaceUncheckedUpdateWithoutTagsInput>;
};
export type WorkspaceUpdateWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutProjectFavoritesInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutProjectFavoritesInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutProjectFavoritesInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutProjectFavoritesInput>;
};
export type WorkspaceUpsertWithoutProjectFavoritesInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutProjectFavoritesInput, Prisma.WorkspaceUncheckedUpdateWithoutProjectFavoritesInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutProjectFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutProjectFavoritesInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutProjectFavoritesInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutProjectFavoritesInput, Prisma.WorkspaceUncheckedUpdateWithoutProjectFavoritesInput>;
};
export type WorkspaceUpdateWithoutProjectFavoritesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutProjectFavoritesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutTaskFavoritesInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutTaskFavoritesInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutTaskFavoritesInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutTaskFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutTaskFavoritesInput>;
};
export type WorkspaceUpsertWithoutTaskFavoritesInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutTaskFavoritesInput, Prisma.WorkspaceUncheckedUpdateWithoutTaskFavoritesInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutTaskFavoritesInput, Prisma.WorkspaceUncheckedCreateWithoutTaskFavoritesInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutTaskFavoritesInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutTaskFavoritesInput, Prisma.WorkspaceUncheckedUpdateWithoutTaskFavoritesInput>;
};
export type WorkspaceUpdateWithoutTaskFavoritesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutTaskFavoritesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutActivityLogsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutActivityLogsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutActivityLogsInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutActivityLogsInput, Prisma.WorkspaceUncheckedCreateWithoutActivityLogsInput>;
};
export type WorkspaceUpsertWithoutActivityLogsInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutActivityLogsInput, Prisma.WorkspaceUncheckedUpdateWithoutActivityLogsInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutActivityLogsInput, Prisma.WorkspaceUncheckedCreateWithoutActivityLogsInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutActivityLogsInput, Prisma.WorkspaceUncheckedUpdateWithoutActivityLogsInput>;
};
export type WorkspaceUpdateWithoutActivityLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutActivityLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutChannelsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutChannelsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    docs?: Prisma.DocUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutChannelsInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutChannelsInput, Prisma.WorkspaceUncheckedCreateWithoutChannelsInput>;
};
export type WorkspaceUpsertWithoutChannelsInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutChannelsInput, Prisma.WorkspaceUncheckedUpdateWithoutChannelsInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutChannelsInput, Prisma.WorkspaceUncheckedCreateWithoutChannelsInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutChannelsInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutChannelsInput, Prisma.WorkspaceUncheckedUpdateWithoutChannelsInput>;
};
export type WorkspaceUpdateWithoutChannelsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutChannelsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutDocsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutWorkspacesCreatedInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutDocsInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    invites?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput;
    projects?: Prisma.ProjectUncheckedCreateNestedManyWithoutWorkspaceInput;
    channels?: Prisma.ChannelUncheckedCreateNestedManyWithoutWorkspaceInput;
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutDocsInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutDocsInput, Prisma.WorkspaceUncheckedCreateWithoutDocsInput>;
};
export type WorkspaceUpsertWithoutDocsInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutDocsInput, Prisma.WorkspaceUncheckedUpdateWithoutDocsInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutDocsInput, Prisma.WorkspaceUncheckedCreateWithoutDocsInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutDocsInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutDocsInput, Prisma.WorkspaceUncheckedUpdateWithoutDocsInput>;
};
export type WorkspaceUpdateWithoutDocsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutWorkspacesCreatedNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutDocsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateManyCreatorInput = {
    id?: string;
    name: string;
    logoUrl?: string | null;
    workspaceUse: $Enums.WorkspaceUse;
    managementType: $Enums.WorkspaceManagementType;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type WorkspaceUpdateWithoutCreatorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutCreatorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    invites?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projects?: Prisma.ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput;
    channels?: Prisma.ChannelUncheckedUpdateManyWithoutWorkspaceNestedInput;
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
    docs?: Prisma.DocUncheckedUpdateManyWithoutWorkspaceNestedInput;
    projectFavorites?: Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
    taskFavorites?: Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateManyWithoutCreatorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    logoUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    workspaceUse?: Prisma.EnumWorkspaceUseFieldUpdateOperationsInput | $Enums.WorkspaceUse;
    managementType?: Prisma.EnumWorkspaceManagementTypeFieldUpdateOperationsInput | $Enums.WorkspaceManagementType;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type WorkspaceCountOutputType = {
    members: number;
    invites: number;
    projects: number;
    channels: number;
    tags: number;
    activityLogs: number;
    docs: number;
    projectFavorites: number;
    taskFavorites: number;
};
export type WorkspaceCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | WorkspaceCountOutputTypeCountMembersArgs;
    invites?: boolean | WorkspaceCountOutputTypeCountInvitesArgs;
    projects?: boolean | WorkspaceCountOutputTypeCountProjectsArgs;
    channels?: boolean | WorkspaceCountOutputTypeCountChannelsArgs;
    tags?: boolean | WorkspaceCountOutputTypeCountTagsArgs;
    activityLogs?: boolean | WorkspaceCountOutputTypeCountActivityLogsArgs;
    docs?: boolean | WorkspaceCountOutputTypeCountDocsArgs;
    projectFavorites?: boolean | WorkspaceCountOutputTypeCountProjectFavoritesArgs;
    taskFavorites?: boolean | WorkspaceCountOutputTypeCountTaskFavoritesArgs;
};
export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceCountOutputTypeSelect<ExtArgs> | null;
};
export type WorkspaceCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceMemberWhereInput;
};
export type WorkspaceCountOutputTypeCountInvitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceInviteWhereInput;
};
export type WorkspaceCountOutputTypeCountProjectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectWhereInput;
};
export type WorkspaceCountOutputTypeCountChannelsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChannelWhereInput;
};
export type WorkspaceCountOutputTypeCountTagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
};
export type WorkspaceCountOutputTypeCountActivityLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
};
export type WorkspaceCountOutputTypeCountDocsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocWhereInput;
};
export type WorkspaceCountOutputTypeCountProjectFavoritesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectFavoriteWhereInput;
};
export type WorkspaceCountOutputTypeCountTaskFavoritesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskFavoriteWhereInput;
};
export type WorkspaceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    logoUrl?: boolean;
    workspaceUse?: boolean;
    managementType?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Workspace$membersArgs<ExtArgs>;
    invites?: boolean | Prisma.Workspace$invitesArgs<ExtArgs>;
    projects?: boolean | Prisma.Workspace$projectsArgs<ExtArgs>;
    channels?: boolean | Prisma.Workspace$channelsArgs<ExtArgs>;
    tags?: boolean | Prisma.Workspace$tagsArgs<ExtArgs>;
    activityLogs?: boolean | Prisma.Workspace$activityLogsArgs<ExtArgs>;
    docs?: boolean | Prisma.Workspace$docsArgs<ExtArgs>;
    projectFavorites?: boolean | Prisma.Workspace$projectFavoritesArgs<ExtArgs>;
    taskFavorites?: boolean | Prisma.Workspace$taskFavoritesArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkspaceCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspace"]>;
export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    logoUrl?: boolean;
    workspaceUse?: boolean;
    managementType?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspace"]>;
export type WorkspaceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    logoUrl?: boolean;
    workspaceUse?: boolean;
    managementType?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspace"]>;
export type WorkspaceSelectScalar = {
    id?: boolean;
    name?: boolean;
    logoUrl?: boolean;
    workspaceUse?: boolean;
    managementType?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type WorkspaceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "logoUrl" | "workspaceUse" | "managementType" | "createdBy" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["workspace"]>;
export type WorkspaceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Workspace$membersArgs<ExtArgs>;
    invites?: boolean | Prisma.Workspace$invitesArgs<ExtArgs>;
    projects?: boolean | Prisma.Workspace$projectsArgs<ExtArgs>;
    channels?: boolean | Prisma.Workspace$channelsArgs<ExtArgs>;
    tags?: boolean | Prisma.Workspace$tagsArgs<ExtArgs>;
    activityLogs?: boolean | Prisma.Workspace$activityLogsArgs<ExtArgs>;
    docs?: boolean | Prisma.Workspace$docsArgs<ExtArgs>;
    projectFavorites?: boolean | Prisma.Workspace$projectFavoritesArgs<ExtArgs>;
    taskFavorites?: boolean | Prisma.Workspace$taskFavoritesArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkspaceCountOutputTypeDefaultArgs<ExtArgs>;
};
export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $WorkspacePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Workspace";
    objects: {
        creator: Prisma.$UserPayload<ExtArgs>;
        members: Prisma.$WorkspaceMemberPayload<ExtArgs>[];
        invites: Prisma.$WorkspaceInvitePayload<ExtArgs>[];
        projects: Prisma.$ProjectPayload<ExtArgs>[];
        channels: Prisma.$ChannelPayload<ExtArgs>[];
        tags: Prisma.$TagPayload<ExtArgs>[];
        activityLogs: Prisma.$ActivityLogPayload<ExtArgs>[];
        docs: Prisma.$DocPayload<ExtArgs>[];
        projectFavorites: Prisma.$ProjectFavoritePayload<ExtArgs>[];
        taskFavorites: Prisma.$TaskFavoritePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        logoUrl: string | null;
        workspaceUse: $Enums.WorkspaceUse;
        managementType: $Enums.WorkspaceManagementType;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["workspace"]>;
    composites: {};
};
export type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkspacePayload, S>;
export type WorkspaceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkspaceCountAggregateInputType | true;
};
export interface WorkspaceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Workspace'];
        meta: {
            name: 'Workspace';
        };
    };
    findUnique<T extends WorkspaceFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkspaceFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkspaceFindManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkspaceCreateArgs>(args: Prisma.SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkspaceCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkspaceDeleteArgs>(args: Prisma.SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkspaceUpdateArgs>(args: Prisma.SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkspaceUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkspaceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkspaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkspaceUpsertArgs>(args: Prisma.SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkspaceCountArgs>(args?: Prisma.Subset<T, WorkspaceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkspaceCountAggregateOutputType> : number>;
    aggregate<T extends WorkspaceAggregateArgs>(args: Prisma.Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>;
    groupBy<T extends WorkspaceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkspaceGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkspaceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkspaceFieldRefs;
}
export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    creator<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Workspace$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    invites<T extends Prisma.Workspace$invitesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$invitesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    projects<T extends Prisma.Workspace$projectsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    channels<T extends Prisma.Workspace$channelsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$channelsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChannelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tags<T extends Prisma.Workspace$tagsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    activityLogs<T extends Prisma.Workspace$activityLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    docs<T extends Prisma.Workspace$docsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$docsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    projectFavorites<T extends Prisma.Workspace$projectFavoritesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$projectFavoritesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    taskFavorites<T extends Prisma.Workspace$taskFavoritesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$taskFavoritesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkspaceFieldRefs {
    readonly id: Prisma.FieldRef<"Workspace", 'String'>;
    readonly name: Prisma.FieldRef<"Workspace", 'String'>;
    readonly logoUrl: Prisma.FieldRef<"Workspace", 'String'>;
    readonly workspaceUse: Prisma.FieldRef<"Workspace", 'WorkspaceUse'>;
    readonly managementType: Prisma.FieldRef<"Workspace", 'WorkspaceManagementType'>;
    readonly createdBy: Prisma.FieldRef<"Workspace", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Workspace", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Workspace", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Workspace", 'DateTime'>;
}
export type WorkspaceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceScalarFieldEnum | Prisma.WorkspaceScalarFieldEnum[];
};
export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceScalarFieldEnum | Prisma.WorkspaceScalarFieldEnum[];
};
export type WorkspaceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceScalarFieldEnum | Prisma.WorkspaceScalarFieldEnum[];
};
export type WorkspaceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceCreateInput, Prisma.WorkspaceUncheckedCreateInput>;
};
export type WorkspaceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkspaceCreateManyInput | Prisma.WorkspaceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    data: Prisma.WorkspaceCreateManyInput | Prisma.WorkspaceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WorkspaceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceUpdateInput, Prisma.WorkspaceUncheckedUpdateInput>;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkspaceUpdateManyMutationInput, Prisma.WorkspaceUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceWhereInput;
    limit?: number;
};
export type WorkspaceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceUpdateManyMutationInput, Prisma.WorkspaceUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceWhereInput;
    limit?: number;
    include?: Prisma.WorkspaceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateInput, Prisma.WorkspaceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkspaceUpdateInput, Prisma.WorkspaceUncheckedUpdateInput>;
};
export type WorkspaceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceWhereInput;
    limit?: number;
};
export type Workspace$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceMemberWhereInput;
    orderBy?: Prisma.WorkspaceMemberOrderByWithRelationInput | Prisma.WorkspaceMemberOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceMemberScalarFieldEnum | Prisma.WorkspaceMemberScalarFieldEnum[];
};
export type Workspace$invitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceInviteWhereInput;
    orderBy?: Prisma.WorkspaceInviteOrderByWithRelationInput | Prisma.WorkspaceInviteOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceInviteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceInviteScalarFieldEnum | Prisma.WorkspaceInviteScalarFieldEnum[];
};
export type Workspace$projectsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput | Prisma.ProjectOrderByWithRelationInput[];
    cursor?: Prisma.ProjectWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectScalarFieldEnum | Prisma.ProjectScalarFieldEnum[];
};
export type Workspace$channelsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Workspace$tagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type Workspace$activityLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithRelationInput | Prisma.ActivityLogOrderByWithRelationInput[];
    cursor?: Prisma.ActivityLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ActivityLogScalarFieldEnum | Prisma.ActivityLogScalarFieldEnum[];
};
export type Workspace$docsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where?: Prisma.DocWhereInput;
    orderBy?: Prisma.DocOrderByWithRelationInput | Prisma.DocOrderByWithRelationInput[];
    cursor?: Prisma.DocWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocScalarFieldEnum | Prisma.DocScalarFieldEnum[];
};
export type Workspace$projectFavoritesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
    where?: Prisma.ProjectFavoriteWhereInput;
    orderBy?: Prisma.ProjectFavoriteOrderByWithRelationInput | Prisma.ProjectFavoriteOrderByWithRelationInput[];
    cursor?: Prisma.ProjectFavoriteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectFavoriteScalarFieldEnum | Prisma.ProjectFavoriteScalarFieldEnum[];
};
export type Workspace$taskFavoritesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
    where?: Prisma.TaskFavoriteWhereInput;
    orderBy?: Prisma.TaskFavoriteOrderByWithRelationInput | Prisma.TaskFavoriteOrderByWithRelationInput[];
    cursor?: Prisma.TaskFavoriteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskFavoriteScalarFieldEnum | Prisma.TaskFavoriteScalarFieldEnum[];
};
export type WorkspaceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
};
