import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TaskFavoriteModel = runtime.Types.Result.DefaultSelection<Prisma.$TaskFavoritePayload>;
export type AggregateTaskFavorite = {
    _count: TaskFavoriteCountAggregateOutputType | null;
    _min: TaskFavoriteMinAggregateOutputType | null;
    _max: TaskFavoriteMaxAggregateOutputType | null;
};
export type TaskFavoriteMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    workspaceId: string | null;
    taskId: string | null;
    createdAt: Date | null;
};
export type TaskFavoriteMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    workspaceId: string | null;
    taskId: string | null;
    createdAt: Date | null;
};
export type TaskFavoriteCountAggregateOutputType = {
    id: number;
    userId: number;
    workspaceId: number;
    taskId: number;
    createdAt: number;
    _all: number;
};
export type TaskFavoriteMinAggregateInputType = {
    id?: true;
    userId?: true;
    workspaceId?: true;
    taskId?: true;
    createdAt?: true;
};
export type TaskFavoriteMaxAggregateInputType = {
    id?: true;
    userId?: true;
    workspaceId?: true;
    taskId?: true;
    createdAt?: true;
};
export type TaskFavoriteCountAggregateInputType = {
    id?: true;
    userId?: true;
    workspaceId?: true;
    taskId?: true;
    createdAt?: true;
    _all?: true;
};
export type TaskFavoriteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskFavoriteWhereInput;
    orderBy?: Prisma.TaskFavoriteOrderByWithRelationInput | Prisma.TaskFavoriteOrderByWithRelationInput[];
    cursor?: Prisma.TaskFavoriteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaskFavoriteCountAggregateInputType;
    _min?: TaskFavoriteMinAggregateInputType;
    _max?: TaskFavoriteMaxAggregateInputType;
};
export type GetTaskFavoriteAggregateType<T extends TaskFavoriteAggregateArgs> = {
    [P in keyof T & keyof AggregateTaskFavorite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTaskFavorite[P]> : Prisma.GetScalarType<T[P], AggregateTaskFavorite[P]>;
};
export type TaskFavoriteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskFavoriteWhereInput;
    orderBy?: Prisma.TaskFavoriteOrderByWithAggregationInput | Prisma.TaskFavoriteOrderByWithAggregationInput[];
    by: Prisma.TaskFavoriteScalarFieldEnum[] | Prisma.TaskFavoriteScalarFieldEnum;
    having?: Prisma.TaskFavoriteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaskFavoriteCountAggregateInputType | true;
    _min?: TaskFavoriteMinAggregateInputType;
    _max?: TaskFavoriteMaxAggregateInputType;
};
export type TaskFavoriteGroupByOutputType = {
    id: string;
    userId: string;
    workspaceId: string;
    taskId: string;
    createdAt: Date;
    _count: TaskFavoriteCountAggregateOutputType | null;
    _min: TaskFavoriteMinAggregateOutputType | null;
    _max: TaskFavoriteMaxAggregateOutputType | null;
};
export type GetTaskFavoriteGroupByPayload<T extends TaskFavoriteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaskFavoriteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaskFavoriteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaskFavoriteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaskFavoriteGroupByOutputType[P]>;
}>>;
export type TaskFavoriteWhereInput = {
    AND?: Prisma.TaskFavoriteWhereInput | Prisma.TaskFavoriteWhereInput[];
    OR?: Prisma.TaskFavoriteWhereInput[];
    NOT?: Prisma.TaskFavoriteWhereInput | Prisma.TaskFavoriteWhereInput[];
    id?: Prisma.StringFilter<"TaskFavorite"> | string;
    userId?: Prisma.StringFilter<"TaskFavorite"> | string;
    workspaceId?: Prisma.StringFilter<"TaskFavorite"> | string;
    taskId?: Prisma.StringFilter<"TaskFavorite"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskFavorite"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
};
export type TaskFavoriteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    task?: Prisma.TaskOrderByWithRelationInput;
};
export type TaskFavoriteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_taskId?: Prisma.TaskFavoriteUserIdTaskIdCompoundUniqueInput;
    AND?: Prisma.TaskFavoriteWhereInput | Prisma.TaskFavoriteWhereInput[];
    OR?: Prisma.TaskFavoriteWhereInput[];
    NOT?: Prisma.TaskFavoriteWhereInput | Prisma.TaskFavoriteWhereInput[];
    userId?: Prisma.StringFilter<"TaskFavorite"> | string;
    workspaceId?: Prisma.StringFilter<"TaskFavorite"> | string;
    taskId?: Prisma.StringFilter<"TaskFavorite"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskFavorite"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
}, "id" | "userId_taskId">;
export type TaskFavoriteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.TaskFavoriteCountOrderByAggregateInput;
    _max?: Prisma.TaskFavoriteMaxOrderByAggregateInput;
    _min?: Prisma.TaskFavoriteMinOrderByAggregateInput;
};
export type TaskFavoriteScalarWhereWithAggregatesInput = {
    AND?: Prisma.TaskFavoriteScalarWhereWithAggregatesInput | Prisma.TaskFavoriteScalarWhereWithAggregatesInput[];
    OR?: Prisma.TaskFavoriteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TaskFavoriteScalarWhereWithAggregatesInput | Prisma.TaskFavoriteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TaskFavorite"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TaskFavorite"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"TaskFavorite"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"TaskFavorite"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TaskFavorite"> | Date | string;
};
export type TaskFavoriteCreateInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTaskFavoritesInput;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutTaskFavoritesInput;
    task: Prisma.TaskCreateNestedOneWithoutFavoritesInput;
};
export type TaskFavoriteUncheckedCreateInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    taskId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTaskFavoritesNestedInput;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutTaskFavoritesNestedInput;
    task?: Prisma.TaskUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type TaskFavoriteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteCreateManyInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    taskId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteListRelationFilter = {
    every?: Prisma.TaskFavoriteWhereInput;
    some?: Prisma.TaskFavoriteWhereInput;
    none?: Prisma.TaskFavoriteWhereInput;
};
export type TaskFavoriteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TaskFavoriteUserIdTaskIdCompoundUniqueInput = {
    userId: string;
    taskId: string;
};
export type TaskFavoriteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskFavoriteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskFavoriteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TaskFavoriteCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutUserInput, Prisma.TaskFavoriteUncheckedCreateWithoutUserInput> | Prisma.TaskFavoriteCreateWithoutUserInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutUserInput | Prisma.TaskFavoriteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskFavoriteCreateManyUserInputEnvelope;
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
};
export type TaskFavoriteUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutUserInput, Prisma.TaskFavoriteUncheckedCreateWithoutUserInput> | Prisma.TaskFavoriteCreateWithoutUserInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutUserInput | Prisma.TaskFavoriteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TaskFavoriteCreateManyUserInputEnvelope;
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
};
export type TaskFavoriteUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutUserInput, Prisma.TaskFavoriteUncheckedCreateWithoutUserInput> | Prisma.TaskFavoriteCreateWithoutUserInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutUserInput | Prisma.TaskFavoriteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskFavoriteCreateManyUserInputEnvelope;
    set?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    disconnect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    delete?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    update?: Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskFavoriteUpdateManyWithWhereWithoutUserInput | Prisma.TaskFavoriteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
};
export type TaskFavoriteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutUserInput, Prisma.TaskFavoriteUncheckedCreateWithoutUserInput> | Prisma.TaskFavoriteCreateWithoutUserInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutUserInput | Prisma.TaskFavoriteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutUserInput | Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TaskFavoriteCreateManyUserInputEnvelope;
    set?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    disconnect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    delete?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    update?: Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutUserInput | Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TaskFavoriteUpdateManyWithWhereWithoutUserInput | Prisma.TaskFavoriteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
};
export type TaskFavoriteCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.TaskFavoriteCreateWithoutWorkspaceInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.TaskFavoriteCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
};
export type TaskFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.TaskFavoriteCreateWithoutWorkspaceInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.TaskFavoriteCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
};
export type TaskFavoriteUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.TaskFavoriteCreateWithoutWorkspaceInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.TaskFavoriteCreateManyWorkspaceInputEnvelope;
    set?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    disconnect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    delete?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    update?: Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.TaskFavoriteUpdateManyWithWhereWithoutWorkspaceInput | Prisma.TaskFavoriteUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
};
export type TaskFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.TaskFavoriteCreateWithoutWorkspaceInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.TaskFavoriteCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.TaskFavoriteCreateManyWorkspaceInputEnvelope;
    set?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    disconnect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    delete?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    update?: Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.TaskFavoriteUpdateManyWithWhereWithoutWorkspaceInput | Prisma.TaskFavoriteUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
};
export type TaskFavoriteCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutTaskInput, Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput> | Prisma.TaskFavoriteCreateWithoutTaskInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput | Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskFavoriteCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
};
export type TaskFavoriteUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutTaskInput, Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput> | Prisma.TaskFavoriteCreateWithoutTaskInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput | Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TaskFavoriteCreateManyTaskInputEnvelope;
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
};
export type TaskFavoriteUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutTaskInput, Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput> | Prisma.TaskFavoriteCreateWithoutTaskInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput | Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskFavoriteCreateManyTaskInputEnvelope;
    set?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    disconnect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    delete?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    update?: Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskFavoriteUpdateManyWithWhereWithoutTaskInput | Prisma.TaskFavoriteUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
};
export type TaskFavoriteUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutTaskInput, Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput> | Prisma.TaskFavoriteCreateWithoutTaskInput[] | Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput | Prisma.TaskFavoriteCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutTaskInput | Prisma.TaskFavoriteUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TaskFavoriteCreateManyTaskInputEnvelope;
    set?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    disconnect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    delete?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    connect?: Prisma.TaskFavoriteWhereUniqueInput | Prisma.TaskFavoriteWhereUniqueInput[];
    update?: Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutTaskInput | Prisma.TaskFavoriteUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TaskFavoriteUpdateManyWithWhereWithoutTaskInput | Prisma.TaskFavoriteUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
};
export type TaskFavoriteCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutTaskFavoritesInput;
    task: Prisma.TaskCreateNestedOneWithoutFavoritesInput;
};
export type TaskFavoriteUncheckedCreateWithoutUserInput = {
    id?: string;
    workspaceId: string;
    taskId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteCreateOrConnectWithoutUserInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutUserInput, Prisma.TaskFavoriteUncheckedCreateWithoutUserInput>;
};
export type TaskFavoriteCreateManyUserInputEnvelope = {
    data: Prisma.TaskFavoriteCreateManyUserInput | Prisma.TaskFavoriteCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TaskFavoriteUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskFavoriteUpdateWithoutUserInput, Prisma.TaskFavoriteUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutUserInput, Prisma.TaskFavoriteUncheckedCreateWithoutUserInput>;
};
export type TaskFavoriteUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateWithoutUserInput, Prisma.TaskFavoriteUncheckedUpdateWithoutUserInput>;
};
export type TaskFavoriteUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TaskFavoriteScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateManyMutationInput, Prisma.TaskFavoriteUncheckedUpdateManyWithoutUserInput>;
};
export type TaskFavoriteScalarWhereInput = {
    AND?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
    OR?: Prisma.TaskFavoriteScalarWhereInput[];
    NOT?: Prisma.TaskFavoriteScalarWhereInput | Prisma.TaskFavoriteScalarWhereInput[];
    id?: Prisma.StringFilter<"TaskFavorite"> | string;
    userId?: Prisma.StringFilter<"TaskFavorite"> | string;
    workspaceId?: Prisma.StringFilter<"TaskFavorite"> | string;
    taskId?: Prisma.StringFilter<"TaskFavorite"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskFavorite"> | Date | string;
};
export type TaskFavoriteCreateWithoutWorkspaceInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTaskFavoritesInput;
    task: Prisma.TaskCreateNestedOneWithoutFavoritesInput;
};
export type TaskFavoriteUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    userId: string;
    taskId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput>;
};
export type TaskFavoriteCreateManyWorkspaceInputEnvelope = {
    data: Prisma.TaskFavoriteCreateManyWorkspaceInput | Prisma.TaskFavoriteCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type TaskFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskFavoriteUpdateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedCreateWithoutWorkspaceInput>;
};
export type TaskFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateWithoutWorkspaceInput, Prisma.TaskFavoriteUncheckedUpdateWithoutWorkspaceInput>;
};
export type TaskFavoriteUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.TaskFavoriteScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateManyMutationInput, Prisma.TaskFavoriteUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type TaskFavoriteCreateWithoutTaskInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTaskFavoritesInput;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutTaskFavoritesInput;
};
export type TaskFavoriteUncheckedCreateWithoutTaskInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteCreateOrConnectWithoutTaskInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutTaskInput, Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput>;
};
export type TaskFavoriteCreateManyTaskInputEnvelope = {
    data: Prisma.TaskFavoriteCreateManyTaskInput | Prisma.TaskFavoriteCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type TaskFavoriteUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskFavoriteUpdateWithoutTaskInput, Prisma.TaskFavoriteUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.TaskFavoriteCreateWithoutTaskInput, Prisma.TaskFavoriteUncheckedCreateWithoutTaskInput>;
};
export type TaskFavoriteUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TaskFavoriteWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateWithoutTaskInput, Prisma.TaskFavoriteUncheckedUpdateWithoutTaskInput>;
};
export type TaskFavoriteUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.TaskFavoriteScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateManyMutationInput, Prisma.TaskFavoriteUncheckedUpdateManyWithoutTaskInput>;
};
export type TaskFavoriteCreateManyUserInput = {
    id?: string;
    workspaceId: string;
    taskId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutTaskFavoritesNestedInput;
    task?: Prisma.TaskUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type TaskFavoriteUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteCreateManyWorkspaceInput = {
    id?: string;
    userId: string;
    taskId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTaskFavoritesNestedInput;
    task?: Prisma.TaskUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type TaskFavoriteUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteCreateManyTaskInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    createdAt?: Date | string;
};
export type TaskFavoriteUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTaskFavoritesNestedInput;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutTaskFavoritesNestedInput;
};
export type TaskFavoriteUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskFavoriteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    taskId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskFavorite"]>;
export type TaskFavoriteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    taskId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskFavorite"]>;
export type TaskFavoriteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    taskId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskFavorite"]>;
export type TaskFavoriteSelectScalar = {
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    taskId?: boolean;
    createdAt?: boolean;
};
export type TaskFavoriteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "workspaceId" | "taskId" | "createdAt", ExtArgs["result"]["taskFavorite"]>;
export type TaskFavoriteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
};
export type TaskFavoriteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
};
export type TaskFavoriteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
};
export type $TaskFavoritePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TaskFavorite";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        task: Prisma.$TaskPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        workspaceId: string;
        taskId: string;
        createdAt: Date;
    }, ExtArgs["result"]["taskFavorite"]>;
    composites: {};
};
export type TaskFavoriteGetPayload<S extends boolean | null | undefined | TaskFavoriteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload, S>;
export type TaskFavoriteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TaskFavoriteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaskFavoriteCountAggregateInputType | true;
};
export interface TaskFavoriteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TaskFavorite'];
        meta: {
            name: 'TaskFavorite';
        };
    };
    findUnique<T extends TaskFavoriteFindUniqueArgs>(args: Prisma.SelectSubset<T, TaskFavoriteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TaskFavoriteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TaskFavoriteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TaskFavoriteFindFirstArgs>(args?: Prisma.SelectSubset<T, TaskFavoriteFindFirstArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TaskFavoriteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TaskFavoriteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TaskFavoriteFindManyArgs>(args?: Prisma.SelectSubset<T, TaskFavoriteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TaskFavoriteCreateArgs>(args: Prisma.SelectSubset<T, TaskFavoriteCreateArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TaskFavoriteCreateManyArgs>(args?: Prisma.SelectSubset<T, TaskFavoriteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TaskFavoriteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TaskFavoriteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TaskFavoriteDeleteArgs>(args: Prisma.SelectSubset<T, TaskFavoriteDeleteArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TaskFavoriteUpdateArgs>(args: Prisma.SelectSubset<T, TaskFavoriteUpdateArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TaskFavoriteDeleteManyArgs>(args?: Prisma.SelectSubset<T, TaskFavoriteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TaskFavoriteUpdateManyArgs>(args: Prisma.SelectSubset<T, TaskFavoriteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TaskFavoriteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TaskFavoriteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TaskFavoriteUpsertArgs>(args: Prisma.SelectSubset<T, TaskFavoriteUpsertArgs<ExtArgs>>): Prisma.Prisma__TaskFavoriteClient<runtime.Types.Result.GetResult<Prisma.$TaskFavoritePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TaskFavoriteCountArgs>(args?: Prisma.Subset<T, TaskFavoriteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaskFavoriteCountAggregateOutputType> : number>;
    aggregate<T extends TaskFavoriteAggregateArgs>(args: Prisma.Subset<T, TaskFavoriteAggregateArgs>): Prisma.PrismaPromise<GetTaskFavoriteAggregateType<T>>;
    groupBy<T extends TaskFavoriteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TaskFavoriteGroupByArgs['orderBy'];
    } : {
        orderBy?: TaskFavoriteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TaskFavoriteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskFavoriteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TaskFavoriteFieldRefs;
}
export interface Prisma__TaskFavoriteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TaskFavoriteFieldRefs {
    readonly id: Prisma.FieldRef<"TaskFavorite", 'String'>;
    readonly userId: Prisma.FieldRef<"TaskFavorite", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"TaskFavorite", 'String'>;
    readonly taskId: Prisma.FieldRef<"TaskFavorite", 'String'>;
    readonly createdAt: Prisma.FieldRef<"TaskFavorite", 'DateTime'>;
}
export type TaskFavoriteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
    where: Prisma.TaskFavoriteWhereUniqueInput;
};
export type TaskFavoriteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
    where: Prisma.TaskFavoriteWhereUniqueInput;
};
export type TaskFavoriteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TaskFavoriteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TaskFavoriteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TaskFavoriteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskFavoriteCreateInput, Prisma.TaskFavoriteUncheckedCreateInput>;
};
export type TaskFavoriteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TaskFavoriteCreateManyInput | Prisma.TaskFavoriteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TaskFavoriteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    data: Prisma.TaskFavoriteCreateManyInput | Prisma.TaskFavoriteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TaskFavoriteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TaskFavoriteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateInput, Prisma.TaskFavoriteUncheckedUpdateInput>;
    where: Prisma.TaskFavoriteWhereUniqueInput;
};
export type TaskFavoriteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateManyMutationInput, Prisma.TaskFavoriteUncheckedUpdateManyInput>;
    where?: Prisma.TaskFavoriteWhereInput;
    limit?: number;
};
export type TaskFavoriteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskFavoriteUpdateManyMutationInput, Prisma.TaskFavoriteUncheckedUpdateManyInput>;
    where?: Prisma.TaskFavoriteWhereInput;
    limit?: number;
    include?: Prisma.TaskFavoriteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TaskFavoriteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
    where: Prisma.TaskFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskFavoriteCreateInput, Prisma.TaskFavoriteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TaskFavoriteUpdateInput, Prisma.TaskFavoriteUncheckedUpdateInput>;
};
export type TaskFavoriteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
    where: Prisma.TaskFavoriteWhereUniqueInput;
};
export type TaskFavoriteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskFavoriteWhereInput;
    limit?: number;
};
export type TaskFavoriteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.TaskFavoriteOmit<ExtArgs> | null;
    include?: Prisma.TaskFavoriteInclude<ExtArgs> | null;
};
