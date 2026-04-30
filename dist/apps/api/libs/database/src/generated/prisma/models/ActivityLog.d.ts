import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ActivityLogModel = runtime.Types.Result.DefaultSelection<Prisma.$ActivityLogPayload>;
export type AggregateActivityLog = {
    _count: ActivityLogCountAggregateOutputType | null;
    _min: ActivityLogMinAggregateOutputType | null;
    _max: ActivityLogMaxAggregateOutputType | null;
};
export type ActivityLogMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    entityType: string | null;
    entityId: string | null;
    action: string | null;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    performedBy: string | null;
    createdAt: Date | null;
};
export type ActivityLogMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    entityType: string | null;
    entityId: string | null;
    action: string | null;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    performedBy: string | null;
    createdAt: Date | null;
};
export type ActivityLogCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    entityType: number;
    entityId: number;
    action: number;
    fieldName: number;
    oldValue: number;
    newValue: number;
    metadata: number;
    performedBy: number;
    createdAt: number;
    _all: number;
};
export type ActivityLogMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    entityType?: true;
    entityId?: true;
    action?: true;
    fieldName?: true;
    oldValue?: true;
    newValue?: true;
    performedBy?: true;
    createdAt?: true;
};
export type ActivityLogMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    entityType?: true;
    entityId?: true;
    action?: true;
    fieldName?: true;
    oldValue?: true;
    newValue?: true;
    performedBy?: true;
    createdAt?: true;
};
export type ActivityLogCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    entityType?: true;
    entityId?: true;
    action?: true;
    fieldName?: true;
    oldValue?: true;
    newValue?: true;
    metadata?: true;
    performedBy?: true;
    createdAt?: true;
    _all?: true;
};
export type ActivityLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithRelationInput | Prisma.ActivityLogOrderByWithRelationInput[];
    cursor?: Prisma.ActivityLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ActivityLogCountAggregateInputType;
    _min?: ActivityLogMinAggregateInputType;
    _max?: ActivityLogMaxAggregateInputType;
};
export type GetActivityLogAggregateType<T extends ActivityLogAggregateArgs> = {
    [P in keyof T & keyof AggregateActivityLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateActivityLog[P]> : Prisma.GetScalarType<T[P], AggregateActivityLog[P]>;
};
export type ActivityLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithAggregationInput | Prisma.ActivityLogOrderByWithAggregationInput[];
    by: Prisma.ActivityLogScalarFieldEnum[] | Prisma.ActivityLogScalarFieldEnum;
    having?: Prisma.ActivityLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ActivityLogCountAggregateInputType | true;
    _min?: ActivityLogMinAggregateInputType;
    _max?: ActivityLogMaxAggregateInputType;
};
export type ActivityLogGroupByOutputType = {
    id: string;
    workspaceId: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    metadata: runtime.JsonValue;
    performedBy: string;
    createdAt: Date;
    _count: ActivityLogCountAggregateOutputType | null;
    _min: ActivityLogMinAggregateOutputType | null;
    _max: ActivityLogMaxAggregateOutputType | null;
};
export type GetActivityLogGroupByPayload<T extends ActivityLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ActivityLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ActivityLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ActivityLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ActivityLogGroupByOutputType[P]>;
}>>;
export type ActivityLogWhereInput = {
    AND?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    OR?: Prisma.ActivityLogWhereInput[];
    NOT?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    id?: Prisma.StringFilter<"ActivityLog"> | string;
    workspaceId?: Prisma.StringFilter<"ActivityLog"> | string;
    entityType?: Prisma.StringFilter<"ActivityLog"> | string;
    entityId?: Prisma.StringFilter<"ActivityLog"> | string;
    action?: Prisma.StringFilter<"ActivityLog"> | string;
    fieldName?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    oldValue?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    newValue?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    metadata?: Prisma.JsonFilter<"ActivityLog">;
    performedBy?: Prisma.StringFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"ActivityLog"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    performer?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ActivityLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    fieldName?: Prisma.SortOrderInput | Prisma.SortOrder;
    oldValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    newValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    performer?: Prisma.UserOrderByWithRelationInput;
};
export type ActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    OR?: Prisma.ActivityLogWhereInput[];
    NOT?: Prisma.ActivityLogWhereInput | Prisma.ActivityLogWhereInput[];
    workspaceId?: Prisma.StringFilter<"ActivityLog"> | string;
    entityType?: Prisma.StringFilter<"ActivityLog"> | string;
    entityId?: Prisma.StringFilter<"ActivityLog"> | string;
    action?: Prisma.StringFilter<"ActivityLog"> | string;
    fieldName?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    oldValue?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    newValue?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    metadata?: Prisma.JsonFilter<"ActivityLog">;
    performedBy?: Prisma.StringFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"ActivityLog"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    performer?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type ActivityLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    fieldName?: Prisma.SortOrderInput | Prisma.SortOrder;
    oldValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    newValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ActivityLogCountOrderByAggregateInput;
    _max?: Prisma.ActivityLogMaxOrderByAggregateInput;
    _min?: Prisma.ActivityLogMinOrderByAggregateInput;
};
export type ActivityLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.ActivityLogScalarWhereWithAggregatesInput | Prisma.ActivityLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.ActivityLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ActivityLogScalarWhereWithAggregatesInput | Prisma.ActivityLogScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ActivityLog"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"ActivityLog"> | string;
    entityType?: Prisma.StringWithAggregatesFilter<"ActivityLog"> | string;
    entityId?: Prisma.StringWithAggregatesFilter<"ActivityLog"> | string;
    action?: Prisma.StringWithAggregatesFilter<"ActivityLog"> | string;
    fieldName?: Prisma.StringNullableWithAggregatesFilter<"ActivityLog"> | string | null;
    oldValue?: Prisma.StringNullableWithAggregatesFilter<"ActivityLog"> | string | null;
    newValue?: Prisma.StringNullableWithAggregatesFilter<"ActivityLog"> | string | null;
    metadata?: Prisma.JsonWithAggregatesFilter<"ActivityLog">;
    performedBy?: Prisma.StringWithAggregatesFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ActivityLog"> | Date | string;
};
export type ActivityLogCreateInput = {
    id?: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutActivityLogsInput;
    performer: Prisma.UserCreateNestedOneWithoutActivityLogsInput;
};
export type ActivityLogUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy: string;
    createdAt?: Date | string;
};
export type ActivityLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutActivityLogsNestedInput;
    performer?: Prisma.UserUpdateOneRequiredWithoutActivityLogsNestedInput;
};
export type ActivityLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogCreateManyInput = {
    id?: string;
    workspaceId: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy: string;
    createdAt?: Date | string;
};
export type ActivityLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogListRelationFilter = {
    every?: Prisma.ActivityLogWhereInput;
    some?: Prisma.ActivityLogWhereInput;
    none?: Prisma.ActivityLogWhereInput;
};
export type ActivityLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ActivityLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    fieldName?: Prisma.SortOrder;
    oldValue?: Prisma.SortOrder;
    newValue?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ActivityLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    fieldName?: Prisma.SortOrder;
    oldValue?: Prisma.SortOrder;
    newValue?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ActivityLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    entityType?: Prisma.SortOrder;
    entityId?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    fieldName?: Prisma.SortOrder;
    oldValue?: Prisma.SortOrder;
    newValue?: Prisma.SortOrder;
    performedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ActivityLogCreateNestedManyWithoutPerformerInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutPerformerInput, Prisma.ActivityLogUncheckedCreateWithoutPerformerInput> | Prisma.ActivityLogCreateWithoutPerformerInput[] | Prisma.ActivityLogUncheckedCreateWithoutPerformerInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutPerformerInput | Prisma.ActivityLogCreateOrConnectWithoutPerformerInput[];
    createMany?: Prisma.ActivityLogCreateManyPerformerInputEnvelope;
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
};
export type ActivityLogUncheckedCreateNestedManyWithoutPerformerInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutPerformerInput, Prisma.ActivityLogUncheckedCreateWithoutPerformerInput> | Prisma.ActivityLogCreateWithoutPerformerInput[] | Prisma.ActivityLogUncheckedCreateWithoutPerformerInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutPerformerInput | Prisma.ActivityLogCreateOrConnectWithoutPerformerInput[];
    createMany?: Prisma.ActivityLogCreateManyPerformerInputEnvelope;
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
};
export type ActivityLogUpdateManyWithoutPerformerNestedInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutPerformerInput, Prisma.ActivityLogUncheckedCreateWithoutPerformerInput> | Prisma.ActivityLogCreateWithoutPerformerInput[] | Prisma.ActivityLogUncheckedCreateWithoutPerformerInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutPerformerInput | Prisma.ActivityLogCreateOrConnectWithoutPerformerInput[];
    upsert?: Prisma.ActivityLogUpsertWithWhereUniqueWithoutPerformerInput | Prisma.ActivityLogUpsertWithWhereUniqueWithoutPerformerInput[];
    createMany?: Prisma.ActivityLogCreateManyPerformerInputEnvelope;
    set?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    disconnect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    delete?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    update?: Prisma.ActivityLogUpdateWithWhereUniqueWithoutPerformerInput | Prisma.ActivityLogUpdateWithWhereUniqueWithoutPerformerInput[];
    updateMany?: Prisma.ActivityLogUpdateManyWithWhereWithoutPerformerInput | Prisma.ActivityLogUpdateManyWithWhereWithoutPerformerInput[];
    deleteMany?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
};
export type ActivityLogUncheckedUpdateManyWithoutPerformerNestedInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutPerformerInput, Prisma.ActivityLogUncheckedCreateWithoutPerformerInput> | Prisma.ActivityLogCreateWithoutPerformerInput[] | Prisma.ActivityLogUncheckedCreateWithoutPerformerInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutPerformerInput | Prisma.ActivityLogCreateOrConnectWithoutPerformerInput[];
    upsert?: Prisma.ActivityLogUpsertWithWhereUniqueWithoutPerformerInput | Prisma.ActivityLogUpsertWithWhereUniqueWithoutPerformerInput[];
    createMany?: Prisma.ActivityLogCreateManyPerformerInputEnvelope;
    set?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    disconnect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    delete?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    update?: Prisma.ActivityLogUpdateWithWhereUniqueWithoutPerformerInput | Prisma.ActivityLogUpdateWithWhereUniqueWithoutPerformerInput[];
    updateMany?: Prisma.ActivityLogUpdateManyWithWhereWithoutPerformerInput | Prisma.ActivityLogUpdateManyWithWhereWithoutPerformerInput[];
    deleteMany?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
};
export type ActivityLogCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput> | Prisma.ActivityLogCreateWithoutWorkspaceInput[] | Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput | Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.ActivityLogCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
};
export type ActivityLogUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput> | Prisma.ActivityLogCreateWithoutWorkspaceInput[] | Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput | Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.ActivityLogCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
};
export type ActivityLogUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput> | Prisma.ActivityLogCreateWithoutWorkspaceInput[] | Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput | Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.ActivityLogUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.ActivityLogUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.ActivityLogCreateManyWorkspaceInputEnvelope;
    set?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    disconnect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    delete?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    update?: Prisma.ActivityLogUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.ActivityLogUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.ActivityLogUpdateManyWithWhereWithoutWorkspaceInput | Prisma.ActivityLogUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
};
export type ActivityLogUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.ActivityLogCreateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput> | Prisma.ActivityLogCreateWithoutWorkspaceInput[] | Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput | Prisma.ActivityLogCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.ActivityLogUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.ActivityLogUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.ActivityLogCreateManyWorkspaceInputEnvelope;
    set?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    disconnect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    delete?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    connect?: Prisma.ActivityLogWhereUniqueInput | Prisma.ActivityLogWhereUniqueInput[];
    update?: Prisma.ActivityLogUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.ActivityLogUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.ActivityLogUpdateManyWithWhereWithoutWorkspaceInput | Prisma.ActivityLogUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
};
export type ActivityLogCreateWithoutPerformerInput = {
    id?: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutActivityLogsInput;
};
export type ActivityLogUncheckedCreateWithoutPerformerInput = {
    id?: string;
    workspaceId: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ActivityLogCreateOrConnectWithoutPerformerInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.ActivityLogCreateWithoutPerformerInput, Prisma.ActivityLogUncheckedCreateWithoutPerformerInput>;
};
export type ActivityLogCreateManyPerformerInputEnvelope = {
    data: Prisma.ActivityLogCreateManyPerformerInput | Prisma.ActivityLogCreateManyPerformerInput[];
    skipDuplicates?: boolean;
};
export type ActivityLogUpsertWithWhereUniqueWithoutPerformerInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.ActivityLogUpdateWithoutPerformerInput, Prisma.ActivityLogUncheckedUpdateWithoutPerformerInput>;
    create: Prisma.XOR<Prisma.ActivityLogCreateWithoutPerformerInput, Prisma.ActivityLogUncheckedCreateWithoutPerformerInput>;
};
export type ActivityLogUpdateWithWhereUniqueWithoutPerformerInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.ActivityLogUpdateWithoutPerformerInput, Prisma.ActivityLogUncheckedUpdateWithoutPerformerInput>;
};
export type ActivityLogUpdateManyWithWhereWithoutPerformerInput = {
    where: Prisma.ActivityLogScalarWhereInput;
    data: Prisma.XOR<Prisma.ActivityLogUpdateManyMutationInput, Prisma.ActivityLogUncheckedUpdateManyWithoutPerformerInput>;
};
export type ActivityLogScalarWhereInput = {
    AND?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
    OR?: Prisma.ActivityLogScalarWhereInput[];
    NOT?: Prisma.ActivityLogScalarWhereInput | Prisma.ActivityLogScalarWhereInput[];
    id?: Prisma.StringFilter<"ActivityLog"> | string;
    workspaceId?: Prisma.StringFilter<"ActivityLog"> | string;
    entityType?: Prisma.StringFilter<"ActivityLog"> | string;
    entityId?: Prisma.StringFilter<"ActivityLog"> | string;
    action?: Prisma.StringFilter<"ActivityLog"> | string;
    fieldName?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    oldValue?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    newValue?: Prisma.StringNullableFilter<"ActivityLog"> | string | null;
    metadata?: Prisma.JsonFilter<"ActivityLog">;
    performedBy?: Prisma.StringFilter<"ActivityLog"> | string;
    createdAt?: Prisma.DateTimeFilter<"ActivityLog"> | Date | string;
};
export type ActivityLogCreateWithoutWorkspaceInput = {
    id?: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    performer: Prisma.UserCreateNestedOneWithoutActivityLogsInput;
};
export type ActivityLogUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy: string;
    createdAt?: Date | string;
};
export type ActivityLogCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.ActivityLogCreateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput>;
};
export type ActivityLogCreateManyWorkspaceInputEnvelope = {
    data: Prisma.ActivityLogCreateManyWorkspaceInput | Prisma.ActivityLogCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type ActivityLogUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.ActivityLogUpdateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.ActivityLogCreateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedCreateWithoutWorkspaceInput>;
};
export type ActivityLogUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.ActivityLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.ActivityLogUpdateWithoutWorkspaceInput, Prisma.ActivityLogUncheckedUpdateWithoutWorkspaceInput>;
};
export type ActivityLogUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.ActivityLogScalarWhereInput;
    data: Prisma.XOR<Prisma.ActivityLogUpdateManyMutationInput, Prisma.ActivityLogUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type ActivityLogCreateManyPerformerInput = {
    id?: string;
    workspaceId: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type ActivityLogUpdateWithoutPerformerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutActivityLogsNestedInput;
};
export type ActivityLogUncheckedUpdateWithoutPerformerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogUncheckedUpdateManyWithoutPerformerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogCreateManyWorkspaceInput = {
    id?: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy: string;
    createdAt?: Date | string;
};
export type ActivityLogUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    performer?: Prisma.UserUpdateOneRequiredWithoutActivityLogsNestedInput;
};
export type ActivityLogUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entityType?: Prisma.StringFieldUpdateOperationsInput | string;
    entityId?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    fieldName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    oldValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    newValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    performedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ActivityLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    entityType?: boolean;
    entityId?: boolean;
    action?: boolean;
    fieldName?: boolean;
    oldValue?: boolean;
    newValue?: boolean;
    metadata?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    performer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["activityLog"]>;
export type ActivityLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    entityType?: boolean;
    entityId?: boolean;
    action?: boolean;
    fieldName?: boolean;
    oldValue?: boolean;
    newValue?: boolean;
    metadata?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    performer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["activityLog"]>;
export type ActivityLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    entityType?: boolean;
    entityId?: boolean;
    action?: boolean;
    fieldName?: boolean;
    oldValue?: boolean;
    newValue?: boolean;
    metadata?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    performer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["activityLog"]>;
export type ActivityLogSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    entityType?: boolean;
    entityId?: boolean;
    action?: boolean;
    fieldName?: boolean;
    oldValue?: boolean;
    newValue?: boolean;
    metadata?: boolean;
    performedBy?: boolean;
    createdAt?: boolean;
};
export type ActivityLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "entityType" | "entityId" | "action" | "fieldName" | "oldValue" | "newValue" | "metadata" | "performedBy" | "createdAt", ExtArgs["result"]["activityLog"]>;
export type ActivityLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    performer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ActivityLogIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    performer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ActivityLogIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    performer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ActivityLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ActivityLog";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        performer: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        entityType: string;
        entityId: string;
        action: string;
        fieldName: string | null;
        oldValue: string | null;
        newValue: string | null;
        metadata: runtime.JsonValue;
        performedBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["activityLog"]>;
    composites: {};
};
export type ActivityLogGetPayload<S extends boolean | null | undefined | ActivityLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload, S>;
export type ActivityLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ActivityLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ActivityLogCountAggregateInputType | true;
};
export interface ActivityLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ActivityLog'];
        meta: {
            name: 'ActivityLog';
        };
    };
    findUnique<T extends ActivityLogFindUniqueArgs>(args: Prisma.SelectSubset<T, ActivityLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ActivityLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ActivityLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ActivityLogFindFirstArgs>(args?: Prisma.SelectSubset<T, ActivityLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ActivityLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ActivityLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ActivityLogFindManyArgs>(args?: Prisma.SelectSubset<T, ActivityLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ActivityLogCreateArgs>(args: Prisma.SelectSubset<T, ActivityLogCreateArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ActivityLogCreateManyArgs>(args?: Prisma.SelectSubset<T, ActivityLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ActivityLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ActivityLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ActivityLogDeleteArgs>(args: Prisma.SelectSubset<T, ActivityLogDeleteArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ActivityLogUpdateArgs>(args: Prisma.SelectSubset<T, ActivityLogUpdateArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ActivityLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, ActivityLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ActivityLogUpdateManyArgs>(args: Prisma.SelectSubset<T, ActivityLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ActivityLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ActivityLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ActivityLogUpsertArgs>(args: Prisma.SelectSubset<T, ActivityLogUpsertArgs<ExtArgs>>): Prisma.Prisma__ActivityLogClient<runtime.Types.Result.GetResult<Prisma.$ActivityLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ActivityLogCountArgs>(args?: Prisma.Subset<T, ActivityLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ActivityLogCountAggregateOutputType> : number>;
    aggregate<T extends ActivityLogAggregateArgs>(args: Prisma.Subset<T, ActivityLogAggregateArgs>): Prisma.PrismaPromise<GetActivityLogAggregateType<T>>;
    groupBy<T extends ActivityLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ActivityLogGroupByArgs['orderBy'];
    } : {
        orderBy?: ActivityLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ActivityLogFieldRefs;
}
export interface Prisma__ActivityLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    performer<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ActivityLogFieldRefs {
    readonly id: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly entityType: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly entityId: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly action: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly fieldName: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly oldValue: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly newValue: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly metadata: Prisma.FieldRef<"ActivityLog", 'Json'>;
    readonly performedBy: Prisma.FieldRef<"ActivityLog", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ActivityLog", 'DateTime'>;
}
export type ActivityLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ActivityLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ActivityLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ActivityLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityLogCreateInput, Prisma.ActivityLogUncheckedCreateInput>;
};
export type ActivityLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ActivityLogCreateManyInput | Prisma.ActivityLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ActivityLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    data: Prisma.ActivityLogCreateManyInput | Prisma.ActivityLogCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ActivityLogIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ActivityLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityLogUpdateInput, Prisma.ActivityLogUncheckedUpdateInput>;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ActivityLogUpdateManyMutationInput, Prisma.ActivityLogUncheckedUpdateManyInput>;
    where?: Prisma.ActivityLogWhereInput;
    limit?: number;
};
export type ActivityLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ActivityLogUpdateManyMutationInput, Prisma.ActivityLogUncheckedUpdateManyInput>;
    where?: Prisma.ActivityLogWhereInput;
    limit?: number;
    include?: Prisma.ActivityLogIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ActivityLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.ActivityLogCreateInput, Prisma.ActivityLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ActivityLogUpdateInput, Prisma.ActivityLogUncheckedUpdateInput>;
};
export type ActivityLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
    where: Prisma.ActivityLogWhereUniqueInput;
};
export type ActivityLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ActivityLogWhereInput;
    limit?: number;
};
export type ActivityLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ActivityLogSelect<ExtArgs> | null;
    omit?: Prisma.ActivityLogOmit<ExtArgs> | null;
    include?: Prisma.ActivityLogInclude<ExtArgs> | null;
};
