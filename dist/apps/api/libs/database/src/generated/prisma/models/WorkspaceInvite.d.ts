import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WorkspaceInviteModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkspaceInvitePayload>;
export type AggregateWorkspaceInvite = {
    _count: WorkspaceInviteCountAggregateOutputType | null;
    _min: WorkspaceInviteMinAggregateOutputType | null;
    _max: WorkspaceInviteMaxAggregateOutputType | null;
};
export type WorkspaceInviteMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    email: string | null;
    role: $Enums.Role | null;
    inviteToken: string | null;
    invitedBy: string | null;
    status: $Enums.InviteStatus | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    createdAt: Date | null;
};
export type WorkspaceInviteMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    email: string | null;
    role: $Enums.Role | null;
    inviteToken: string | null;
    invitedBy: string | null;
    status: $Enums.InviteStatus | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    createdAt: Date | null;
};
export type WorkspaceInviteCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    email: number;
    role: number;
    inviteToken: number;
    invitedBy: number;
    status: number;
    expiresAt: number;
    acceptedAt: number;
    createdAt: number;
    _all: number;
};
export type WorkspaceInviteMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    email?: true;
    role?: true;
    inviteToken?: true;
    invitedBy?: true;
    status?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdAt?: true;
};
export type WorkspaceInviteMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    email?: true;
    role?: true;
    inviteToken?: true;
    invitedBy?: true;
    status?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdAt?: true;
};
export type WorkspaceInviteCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    email?: true;
    role?: true;
    inviteToken?: true;
    invitedBy?: true;
    status?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type WorkspaceInviteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceInviteWhereInput;
    orderBy?: Prisma.WorkspaceInviteOrderByWithRelationInput | Prisma.WorkspaceInviteOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceInviteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkspaceInviteCountAggregateInputType;
    _min?: WorkspaceInviteMinAggregateInputType;
    _max?: WorkspaceInviteMaxAggregateInputType;
};
export type GetWorkspaceInviteAggregateType<T extends WorkspaceInviteAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkspaceInvite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkspaceInvite[P]> : Prisma.GetScalarType<T[P], AggregateWorkspaceInvite[P]>;
};
export type WorkspaceInviteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceInviteWhereInput;
    orderBy?: Prisma.WorkspaceInviteOrderByWithAggregationInput | Prisma.WorkspaceInviteOrderByWithAggregationInput[];
    by: Prisma.WorkspaceInviteScalarFieldEnum[] | Prisma.WorkspaceInviteScalarFieldEnum;
    having?: Prisma.WorkspaceInviteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkspaceInviteCountAggregateInputType | true;
    _min?: WorkspaceInviteMinAggregateInputType;
    _max?: WorkspaceInviteMaxAggregateInputType;
};
export type WorkspaceInviteGroupByOutputType = {
    id: string;
    workspaceId: string;
    email: string;
    role: $Enums.Role;
    inviteToken: string;
    invitedBy: string;
    status: $Enums.InviteStatus;
    expiresAt: Date;
    acceptedAt: Date | null;
    createdAt: Date;
    _count: WorkspaceInviteCountAggregateOutputType | null;
    _min: WorkspaceInviteMinAggregateOutputType | null;
    _max: WorkspaceInviteMaxAggregateOutputType | null;
};
export type GetWorkspaceInviteGroupByPayload<T extends WorkspaceInviteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkspaceInviteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkspaceInviteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkspaceInviteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkspaceInviteGroupByOutputType[P]>;
}>>;
export type WorkspaceInviteWhereInput = {
    AND?: Prisma.WorkspaceInviteWhereInput | Prisma.WorkspaceInviteWhereInput[];
    OR?: Prisma.WorkspaceInviteWhereInput[];
    NOT?: Prisma.WorkspaceInviteWhereInput | Prisma.WorkspaceInviteWhereInput[];
    id?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    workspaceId?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    email?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    role?: Prisma.EnumRoleFilter<"WorkspaceInvite"> | $Enums.Role;
    inviteToken?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    invitedBy?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    status?: Prisma.EnumInviteStatusFilter<"WorkspaceInvite"> | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFilter<"WorkspaceInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"WorkspaceInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceInvite"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    sender?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type WorkspaceInviteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    inviteToken?: Prisma.SortOrder;
    invitedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    sender?: Prisma.UserOrderByWithRelationInput;
};
export type WorkspaceInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    inviteToken?: string;
    AND?: Prisma.WorkspaceInviteWhereInput | Prisma.WorkspaceInviteWhereInput[];
    OR?: Prisma.WorkspaceInviteWhereInput[];
    NOT?: Prisma.WorkspaceInviteWhereInput | Prisma.WorkspaceInviteWhereInput[];
    workspaceId?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    email?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    role?: Prisma.EnumRoleFilter<"WorkspaceInvite"> | $Enums.Role;
    invitedBy?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    status?: Prisma.EnumInviteStatusFilter<"WorkspaceInvite"> | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFilter<"WorkspaceInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"WorkspaceInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceInvite"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    sender?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "inviteToken">;
export type WorkspaceInviteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    inviteToken?: Prisma.SortOrder;
    invitedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.WorkspaceInviteCountOrderByAggregateInput;
    _max?: Prisma.WorkspaceInviteMaxOrderByAggregateInput;
    _min?: Prisma.WorkspaceInviteMinOrderByAggregateInput;
};
export type WorkspaceInviteScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkspaceInviteScalarWhereWithAggregatesInput | Prisma.WorkspaceInviteScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkspaceInviteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkspaceInviteScalarWhereWithAggregatesInput | Prisma.WorkspaceInviteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WorkspaceInvite"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"WorkspaceInvite"> | string;
    email?: Prisma.StringWithAggregatesFilter<"WorkspaceInvite"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"WorkspaceInvite"> | $Enums.Role;
    inviteToken?: Prisma.StringWithAggregatesFilter<"WorkspaceInvite"> | string;
    invitedBy?: Prisma.StringWithAggregatesFilter<"WorkspaceInvite"> | string;
    status?: Prisma.EnumInviteStatusWithAggregatesFilter<"WorkspaceInvite"> | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"WorkspaceInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"WorkspaceInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WorkspaceInvite"> | Date | string;
};
export type WorkspaceInviteCreateInput = {
    id?: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutInvitesInput;
    sender: Prisma.UserCreateNestedOneWithoutWorkspaceInvitesSentInput;
};
export type WorkspaceInviteUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    invitedBy: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type WorkspaceInviteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutInvitesNestedInput;
    sender?: Prisma.UserUpdateOneRequiredWithoutWorkspaceInvitesSentNestedInput;
};
export type WorkspaceInviteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    invitedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceInviteCreateManyInput = {
    id?: string;
    workspaceId: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    invitedBy: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type WorkspaceInviteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceInviteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    invitedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceInviteListRelationFilter = {
    every?: Prisma.WorkspaceInviteWhereInput;
    some?: Prisma.WorkspaceInviteWhereInput;
    none?: Prisma.WorkspaceInviteWhereInput;
};
export type WorkspaceInviteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WorkspaceInviteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    inviteToken?: Prisma.SortOrder;
    invitedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceInviteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    inviteToken?: Prisma.SortOrder;
    invitedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceInviteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    inviteToken?: Prisma.SortOrder;
    invitedBy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceInviteCreateNestedManyWithoutSenderInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput> | Prisma.WorkspaceInviteCreateWithoutSenderInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput | Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput[];
    createMany?: Prisma.WorkspaceInviteCreateManySenderInputEnvelope;
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
};
export type WorkspaceInviteUncheckedCreateNestedManyWithoutSenderInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput> | Prisma.WorkspaceInviteCreateWithoutSenderInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput | Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput[];
    createMany?: Prisma.WorkspaceInviteCreateManySenderInputEnvelope;
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
};
export type WorkspaceInviteUpdateManyWithoutSenderNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput> | Prisma.WorkspaceInviteCreateWithoutSenderInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput | Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput[];
    upsert?: Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutSenderInput | Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: Prisma.WorkspaceInviteCreateManySenderInputEnvelope;
    set?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    delete?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    update?: Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutSenderInput | Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?: Prisma.WorkspaceInviteUpdateManyWithWhereWithoutSenderInput | Prisma.WorkspaceInviteUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: Prisma.WorkspaceInviteScalarWhereInput | Prisma.WorkspaceInviteScalarWhereInput[];
};
export type WorkspaceInviteUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput> | Prisma.WorkspaceInviteCreateWithoutSenderInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput | Prisma.WorkspaceInviteCreateOrConnectWithoutSenderInput[];
    upsert?: Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutSenderInput | Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: Prisma.WorkspaceInviteCreateManySenderInputEnvelope;
    set?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    delete?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    update?: Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutSenderInput | Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?: Prisma.WorkspaceInviteUpdateManyWithWhereWithoutSenderInput | Prisma.WorkspaceInviteUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: Prisma.WorkspaceInviteScalarWhereInput | Prisma.WorkspaceInviteScalarWhereInput[];
};
export type WorkspaceInviteCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceInviteCreateWithoutWorkspaceInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceInviteCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
};
export type WorkspaceInviteUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceInviteCreateWithoutWorkspaceInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceInviteCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
};
export type WorkspaceInviteUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceInviteCreateWithoutWorkspaceInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceInviteCreateManyWorkspaceInputEnvelope;
    set?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    delete?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    update?: Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.WorkspaceInviteUpdateManyWithWhereWithoutWorkspaceInput | Prisma.WorkspaceInviteUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.WorkspaceInviteScalarWhereInput | Prisma.WorkspaceInviteScalarWhereInput[];
};
export type WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceInviteCreateWithoutWorkspaceInput[] | Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceInviteCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceInviteUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceInviteCreateManyWorkspaceInputEnvelope;
    set?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    delete?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    connect?: Prisma.WorkspaceInviteWhereUniqueInput | Prisma.WorkspaceInviteWhereUniqueInput[];
    update?: Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceInviteUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.WorkspaceInviteUpdateManyWithWhereWithoutWorkspaceInput | Prisma.WorkspaceInviteUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.WorkspaceInviteScalarWhereInput | Prisma.WorkspaceInviteScalarWhereInput[];
};
export type EnumInviteStatusFieldUpdateOperationsInput = {
    set?: $Enums.InviteStatus;
};
export type WorkspaceInviteCreateWithoutSenderInput = {
    id?: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutInvitesInput;
};
export type WorkspaceInviteUncheckedCreateWithoutSenderInput = {
    id?: string;
    workspaceId: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type WorkspaceInviteCreateOrConnectWithoutSenderInput = {
    where: Prisma.WorkspaceInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput>;
};
export type WorkspaceInviteCreateManySenderInputEnvelope = {
    data: Prisma.WorkspaceInviteCreateManySenderInput | Prisma.WorkspaceInviteCreateManySenderInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceInviteUpsertWithWhereUniqueWithoutSenderInput = {
    where: Prisma.WorkspaceInviteWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceInviteUpdateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedUpdateWithoutSenderInput>;
    create: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedCreateWithoutSenderInput>;
};
export type WorkspaceInviteUpdateWithWhereUniqueWithoutSenderInput = {
    where: Prisma.WorkspaceInviteWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceInviteUpdateWithoutSenderInput, Prisma.WorkspaceInviteUncheckedUpdateWithoutSenderInput>;
};
export type WorkspaceInviteUpdateManyWithWhereWithoutSenderInput = {
    where: Prisma.WorkspaceInviteScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceInviteUpdateManyMutationInput, Prisma.WorkspaceInviteUncheckedUpdateManyWithoutSenderInput>;
};
export type WorkspaceInviteScalarWhereInput = {
    AND?: Prisma.WorkspaceInviteScalarWhereInput | Prisma.WorkspaceInviteScalarWhereInput[];
    OR?: Prisma.WorkspaceInviteScalarWhereInput[];
    NOT?: Prisma.WorkspaceInviteScalarWhereInput | Prisma.WorkspaceInviteScalarWhereInput[];
    id?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    workspaceId?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    email?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    role?: Prisma.EnumRoleFilter<"WorkspaceInvite"> | $Enums.Role;
    inviteToken?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    invitedBy?: Prisma.StringFilter<"WorkspaceInvite"> | string;
    status?: Prisma.EnumInviteStatusFilter<"WorkspaceInvite"> | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFilter<"WorkspaceInvite"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"WorkspaceInvite"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceInvite"> | Date | string;
};
export type WorkspaceInviteCreateWithoutWorkspaceInput = {
    id?: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
    sender: Prisma.UserCreateNestedOneWithoutWorkspaceInvitesSentInput;
};
export type WorkspaceInviteUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    invitedBy: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type WorkspaceInviteCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.WorkspaceInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput>;
};
export type WorkspaceInviteCreateManyWorkspaceInputEnvelope = {
    data: Prisma.WorkspaceInviteCreateManyWorkspaceInput | Prisma.WorkspaceInviteCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceInviteUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.WorkspaceInviteWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceInviteUpdateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.WorkspaceInviteCreateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedCreateWithoutWorkspaceInput>;
};
export type WorkspaceInviteUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.WorkspaceInviteWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceInviteUpdateWithoutWorkspaceInput, Prisma.WorkspaceInviteUncheckedUpdateWithoutWorkspaceInput>;
};
export type WorkspaceInviteUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.WorkspaceInviteScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceInviteUpdateManyMutationInput, Prisma.WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type WorkspaceInviteCreateManySenderInput = {
    id?: string;
    workspaceId: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type WorkspaceInviteUpdateWithoutSenderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutInvitesNestedInput;
};
export type WorkspaceInviteUncheckedUpdateWithoutSenderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceInviteUncheckedUpdateManyWithoutSenderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceInviteCreateManyWorkspaceInput = {
    id?: string;
    email: string;
    role?: $Enums.Role;
    inviteToken: string;
    invitedBy: string;
    status?: $Enums.InviteStatus;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type WorkspaceInviteUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sender?: Prisma.UserUpdateOneRequiredWithoutWorkspaceInvitesSentNestedInput;
};
export type WorkspaceInviteUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    invitedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceInviteUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    inviteToken?: Prisma.StringFieldUpdateOperationsInput | string;
    invitedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceInviteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    email?: boolean;
    role?: boolean;
    inviteToken?: boolean;
    invitedBy?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceInvite"]>;
export type WorkspaceInviteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    email?: boolean;
    role?: boolean;
    inviteToken?: boolean;
    invitedBy?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceInvite"]>;
export type WorkspaceInviteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    email?: boolean;
    role?: boolean;
    inviteToken?: boolean;
    invitedBy?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceInvite"]>;
export type WorkspaceInviteSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    email?: boolean;
    role?: boolean;
    inviteToken?: boolean;
    invitedBy?: boolean;
    status?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdAt?: boolean;
};
export type WorkspaceInviteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "email" | "role" | "inviteToken" | "invitedBy" | "status" | "expiresAt" | "acceptedAt" | "createdAt", ExtArgs["result"]["workspaceInvite"]>;
export type WorkspaceInviteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceInviteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceInviteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    sender?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $WorkspaceInvitePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WorkspaceInvite";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        sender: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        email: string;
        role: $Enums.Role;
        inviteToken: string;
        invitedBy: string;
        status: $Enums.InviteStatus;
        expiresAt: Date;
        acceptedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["workspaceInvite"]>;
    composites: {};
};
export type WorkspaceInviteGetPayload<S extends boolean | null | undefined | WorkspaceInviteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload, S>;
export type WorkspaceInviteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkspaceInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkspaceInviteCountAggregateInputType | true;
};
export interface WorkspaceInviteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceInvite'];
        meta: {
            name: 'WorkspaceInvite';
        };
    };
    findUnique<T extends WorkspaceInviteFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkspaceInviteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkspaceInviteFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkspaceInviteFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkspaceInviteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkspaceInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkspaceInviteFindManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkspaceInviteCreateArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteCreateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkspaceInviteCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkspaceInviteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkspaceInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkspaceInviteDeleteArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkspaceInviteUpdateArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkspaceInviteDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkspaceInviteUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkspaceInviteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkspaceInviteUpsertArgs>(args: Prisma.SelectSubset<T, WorkspaceInviteUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkspaceInviteClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkspaceInviteCountArgs>(args?: Prisma.Subset<T, WorkspaceInviteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkspaceInviteCountAggregateOutputType> : number>;
    aggregate<T extends WorkspaceInviteAggregateArgs>(args: Prisma.Subset<T, WorkspaceInviteAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceInviteAggregateType<T>>;
    groupBy<T extends WorkspaceInviteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkspaceInviteGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkspaceInviteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkspaceInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkspaceInviteFieldRefs;
}
export interface Prisma__WorkspaceInviteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    sender<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkspaceInviteFieldRefs {
    readonly id: Prisma.FieldRef<"WorkspaceInvite", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"WorkspaceInvite", 'String'>;
    readonly email: Prisma.FieldRef<"WorkspaceInvite", 'String'>;
    readonly role: Prisma.FieldRef<"WorkspaceInvite", 'Role'>;
    readonly inviteToken: Prisma.FieldRef<"WorkspaceInvite", 'String'>;
    readonly invitedBy: Prisma.FieldRef<"WorkspaceInvite", 'String'>;
    readonly status: Prisma.FieldRef<"WorkspaceInvite", 'InviteStatus'>;
    readonly expiresAt: Prisma.FieldRef<"WorkspaceInvite", 'DateTime'>;
    readonly acceptedAt: Prisma.FieldRef<"WorkspaceInvite", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"WorkspaceInvite", 'DateTime'>;
}
export type WorkspaceInviteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    where: Prisma.WorkspaceInviteWhereUniqueInput;
};
export type WorkspaceInviteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    where: Prisma.WorkspaceInviteWhereUniqueInput;
};
export type WorkspaceInviteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WorkspaceInviteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WorkspaceInviteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WorkspaceInviteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceInviteCreateInput, Prisma.WorkspaceInviteUncheckedCreateInput>;
};
export type WorkspaceInviteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkspaceInviteCreateManyInput | Prisma.WorkspaceInviteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceInviteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    data: Prisma.WorkspaceInviteCreateManyInput | Prisma.WorkspaceInviteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WorkspaceInviteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceInviteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceInviteUpdateInput, Prisma.WorkspaceInviteUncheckedUpdateInput>;
    where: Prisma.WorkspaceInviteWhereUniqueInput;
};
export type WorkspaceInviteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkspaceInviteUpdateManyMutationInput, Prisma.WorkspaceInviteUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceInviteWhereInput;
    limit?: number;
};
export type WorkspaceInviteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceInviteUpdateManyMutationInput, Prisma.WorkspaceInviteUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceInviteWhereInput;
    limit?: number;
    include?: Prisma.WorkspaceInviteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceInviteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    where: Prisma.WorkspaceInviteWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceInviteCreateInput, Prisma.WorkspaceInviteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkspaceInviteUpdateInput, Prisma.WorkspaceInviteUncheckedUpdateInput>;
};
export type WorkspaceInviteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    where: Prisma.WorkspaceInviteWhereUniqueInput;
};
export type WorkspaceInviteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceInviteWhereInput;
    limit?: number;
};
export type WorkspaceInviteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
};
