import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
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
    tags?: Prisma.TagListRelationFilter;
    activityLogs?: Prisma.ActivityLogListRelationFilter;
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
    tags?: Prisma.TagOrderByRelationAggregateInput;
    activityLogs?: Prisma.ActivityLogOrderByRelationAggregateInput;
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
    tags?: Prisma.TagListRelationFilter;
    activityLogs?: Prisma.ActivityLogListRelationFilter;
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
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
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
    activityLogs?: Prisma.ActivityLogCreateNestedManyWithoutWorkspaceInput;
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
    activityLogs?: Prisma.ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput;
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
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
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
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUncheckedCreateNestedManyWithoutWorkspaceInput;
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
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUpdateManyWithoutWorkspaceNestedInput;
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
    tags?: Prisma.TagUncheckedUpdateManyWithoutWorkspaceNestedInput;
    activityLogs?: Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput;
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
    tags: number;
    activityLogs: number;
};
export type WorkspaceCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | WorkspaceCountOutputTypeCountMembersArgs;
    invites?: boolean | WorkspaceCountOutputTypeCountInvitesArgs;
    projects?: boolean | WorkspaceCountOutputTypeCountProjectsArgs;
    tags?: boolean | WorkspaceCountOutputTypeCountTagsArgs;
    activityLogs?: boolean | WorkspaceCountOutputTypeCountActivityLogsArgs;
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
export type WorkspaceCountOutputTypeCountTagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
};
export type WorkspaceCountOutputTypeCountActivityLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
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
    tags?: boolean | Prisma.Workspace$tagsArgs<ExtArgs>;
    activityLogs?: boolean | Prisma.Workspace$activityLogsArgs<ExtArgs>;
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
    tags?: boolean | Prisma.Workspace$tagsArgs<ExtArgs>;
    activityLogs?: boolean | Prisma.Workspace$activityLogsArgs<ExtArgs>;
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
        tags: Prisma.$TagPayload<ExtArgs>[];
        activityLogs: Prisma.$ActivityLogPayload<ExtArgs>[];
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
    tags<T extends Prisma.Workspace$tagsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    activityLogs<T extends Prisma.Workspace$activityLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
export type WorkspaceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
};
