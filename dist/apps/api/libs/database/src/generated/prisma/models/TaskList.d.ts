import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TaskListModel = runtime.Types.Result.DefaultSelection<Prisma.$TaskListPayload>;
export type AggregateTaskList = {
    _count: TaskListCountAggregateOutputType | null;
    _avg: TaskListAvgAggregateOutputType | null;
    _sum: TaskListSumAggregateOutputType | null;
    _min: TaskListMinAggregateOutputType | null;
    _max: TaskListMaxAggregateOutputType | null;
};
export type TaskListAvgAggregateOutputType = {
    position: number | null;
};
export type TaskListSumAggregateOutputType = {
    position: number | null;
};
export type TaskListMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    name: string | null;
    position: number | null;
    isArchived: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TaskListMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    name: string | null;
    position: number | null;
    isArchived: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TaskListCountAggregateOutputType = {
    id: number;
    projectId: number;
    name: number;
    position: number;
    isArchived: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type TaskListAvgAggregateInputType = {
    position?: true;
};
export type TaskListSumAggregateInputType = {
    position?: true;
};
export type TaskListMinAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    position?: true;
    isArchived?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TaskListMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    position?: true;
    isArchived?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TaskListCountAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    position?: true;
    isArchived?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type TaskListAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskListWhereInput;
    orderBy?: Prisma.TaskListOrderByWithRelationInput | Prisma.TaskListOrderByWithRelationInput[];
    cursor?: Prisma.TaskListWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaskListCountAggregateInputType;
    _avg?: TaskListAvgAggregateInputType;
    _sum?: TaskListSumAggregateInputType;
    _min?: TaskListMinAggregateInputType;
    _max?: TaskListMaxAggregateInputType;
};
export type GetTaskListAggregateType<T extends TaskListAggregateArgs> = {
    [P in keyof T & keyof AggregateTaskList]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTaskList[P]> : Prisma.GetScalarType<T[P], AggregateTaskList[P]>;
};
export type TaskListGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskListWhereInput;
    orderBy?: Prisma.TaskListOrderByWithAggregationInput | Prisma.TaskListOrderByWithAggregationInput[];
    by: Prisma.TaskListScalarFieldEnum[] | Prisma.TaskListScalarFieldEnum;
    having?: Prisma.TaskListScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaskListCountAggregateInputType | true;
    _avg?: TaskListAvgAggregateInputType;
    _sum?: TaskListSumAggregateInputType;
    _min?: TaskListMinAggregateInputType;
    _max?: TaskListMaxAggregateInputType;
};
export type TaskListGroupByOutputType = {
    id: string;
    projectId: string;
    name: string;
    position: number;
    isArchived: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: TaskListCountAggregateOutputType | null;
    _avg: TaskListAvgAggregateOutputType | null;
    _sum: TaskListSumAggregateOutputType | null;
    _min: TaskListMinAggregateOutputType | null;
    _max: TaskListMaxAggregateOutputType | null;
};
export type GetTaskListGroupByPayload<T extends TaskListGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaskListGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaskListGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaskListGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaskListGroupByOutputType[P]>;
}>>;
export type TaskListWhereInput = {
    AND?: Prisma.TaskListWhereInput | Prisma.TaskListWhereInput[];
    OR?: Prisma.TaskListWhereInput[];
    NOT?: Prisma.TaskListWhereInput | Prisma.TaskListWhereInput[];
    id?: Prisma.StringFilter<"TaskList"> | string;
    projectId?: Prisma.StringFilter<"TaskList"> | string;
    name?: Prisma.StringFilter<"TaskList"> | string;
    position?: Prisma.IntFilter<"TaskList"> | number;
    isArchived?: Prisma.BoolFilter<"TaskList"> | boolean;
    createdBy?: Prisma.StringFilter<"TaskList"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskList"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TaskList"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"TaskList"> | Date | string | null;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    creator?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    tasks?: Prisma.TaskListRelationFilter;
};
export type TaskListOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    creator?: Prisma.UserOrderByWithRelationInput;
    tasks?: Prisma.TaskOrderByRelationAggregateInput;
};
export type TaskListWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TaskListWhereInput | Prisma.TaskListWhereInput[];
    OR?: Prisma.TaskListWhereInput[];
    NOT?: Prisma.TaskListWhereInput | Prisma.TaskListWhereInput[];
    projectId?: Prisma.StringFilter<"TaskList"> | string;
    name?: Prisma.StringFilter<"TaskList"> | string;
    position?: Prisma.IntFilter<"TaskList"> | number;
    isArchived?: Prisma.BoolFilter<"TaskList"> | boolean;
    createdBy?: Prisma.StringFilter<"TaskList"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskList"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TaskList"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"TaskList"> | Date | string | null;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    creator?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    tasks?: Prisma.TaskListRelationFilter;
}, "id">;
export type TaskListOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TaskListCountOrderByAggregateInput;
    _avg?: Prisma.TaskListAvgOrderByAggregateInput;
    _max?: Prisma.TaskListMaxOrderByAggregateInput;
    _min?: Prisma.TaskListMinOrderByAggregateInput;
    _sum?: Prisma.TaskListSumOrderByAggregateInput;
};
export type TaskListScalarWhereWithAggregatesInput = {
    AND?: Prisma.TaskListScalarWhereWithAggregatesInput | Prisma.TaskListScalarWhereWithAggregatesInput[];
    OR?: Prisma.TaskListScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TaskListScalarWhereWithAggregatesInput | Prisma.TaskListScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TaskList"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"TaskList"> | string;
    name?: Prisma.StringWithAggregatesFilter<"TaskList"> | string;
    position?: Prisma.IntWithAggregatesFilter<"TaskList"> | number;
    isArchived?: Prisma.BoolWithAggregatesFilter<"TaskList"> | boolean;
    createdBy?: Prisma.StringWithAggregatesFilter<"TaskList"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TaskList"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"TaskList"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"TaskList"> | Date | string | null;
};
export type TaskListCreateInput = {
    id?: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    project: Prisma.ProjectCreateNestedOneWithoutTaskListsInput;
    creator: Prisma.UserCreateNestedOneWithoutTaskListsCreatedInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutListInput;
};
export type TaskListUncheckedCreateInput = {
    id?: string;
    projectId: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutListInput;
};
export type TaskListUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneRequiredWithoutTaskListsNestedInput;
    creator?: Prisma.UserUpdateOneRequiredWithoutTaskListsCreatedNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutListNestedInput;
};
export type TaskListUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutListNestedInput;
};
export type TaskListCreateManyInput = {
    id?: string;
    projectId: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TaskListUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TaskListUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TaskListListRelationFilter = {
    every?: Prisma.TaskListWhereInput;
    some?: Prisma.TaskListWhereInput;
    none?: Prisma.TaskListWhereInput;
};
export type TaskListOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TaskListCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TaskListAvgOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type TaskListMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TaskListMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TaskListSumOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type TaskListScalarRelationFilter = {
    is?: Prisma.TaskListWhereInput;
    isNot?: Prisma.TaskListWhereInput;
};
export type TaskListCreateNestedManyWithoutCreatorInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutCreatorInput, Prisma.TaskListUncheckedCreateWithoutCreatorInput> | Prisma.TaskListCreateWithoutCreatorInput[] | Prisma.TaskListUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutCreatorInput | Prisma.TaskListCreateOrConnectWithoutCreatorInput[];
    createMany?: Prisma.TaskListCreateManyCreatorInputEnvelope;
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
};
export type TaskListUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutCreatorInput, Prisma.TaskListUncheckedCreateWithoutCreatorInput> | Prisma.TaskListCreateWithoutCreatorInput[] | Prisma.TaskListUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutCreatorInput | Prisma.TaskListCreateOrConnectWithoutCreatorInput[];
    createMany?: Prisma.TaskListCreateManyCreatorInputEnvelope;
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
};
export type TaskListUpdateManyWithoutCreatorNestedInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutCreatorInput, Prisma.TaskListUncheckedCreateWithoutCreatorInput> | Prisma.TaskListCreateWithoutCreatorInput[] | Prisma.TaskListUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutCreatorInput | Prisma.TaskListCreateOrConnectWithoutCreatorInput[];
    upsert?: Prisma.TaskListUpsertWithWhereUniqueWithoutCreatorInput | Prisma.TaskListUpsertWithWhereUniqueWithoutCreatorInput[];
    createMany?: Prisma.TaskListCreateManyCreatorInputEnvelope;
    set?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    disconnect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    delete?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    update?: Prisma.TaskListUpdateWithWhereUniqueWithoutCreatorInput | Prisma.TaskListUpdateWithWhereUniqueWithoutCreatorInput[];
    updateMany?: Prisma.TaskListUpdateManyWithWhereWithoutCreatorInput | Prisma.TaskListUpdateManyWithWhereWithoutCreatorInput[];
    deleteMany?: Prisma.TaskListScalarWhereInput | Prisma.TaskListScalarWhereInput[];
};
export type TaskListUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutCreatorInput, Prisma.TaskListUncheckedCreateWithoutCreatorInput> | Prisma.TaskListCreateWithoutCreatorInput[] | Prisma.TaskListUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutCreatorInput | Prisma.TaskListCreateOrConnectWithoutCreatorInput[];
    upsert?: Prisma.TaskListUpsertWithWhereUniqueWithoutCreatorInput | Prisma.TaskListUpsertWithWhereUniqueWithoutCreatorInput[];
    createMany?: Prisma.TaskListCreateManyCreatorInputEnvelope;
    set?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    disconnect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    delete?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    update?: Prisma.TaskListUpdateWithWhereUniqueWithoutCreatorInput | Prisma.TaskListUpdateWithWhereUniqueWithoutCreatorInput[];
    updateMany?: Prisma.TaskListUpdateManyWithWhereWithoutCreatorInput | Prisma.TaskListUpdateManyWithWhereWithoutCreatorInput[];
    deleteMany?: Prisma.TaskListScalarWhereInput | Prisma.TaskListScalarWhereInput[];
};
export type TaskListCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutProjectInput, Prisma.TaskListUncheckedCreateWithoutProjectInput> | Prisma.TaskListCreateWithoutProjectInput[] | Prisma.TaskListUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutProjectInput | Prisma.TaskListCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.TaskListCreateManyProjectInputEnvelope;
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
};
export type TaskListUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutProjectInput, Prisma.TaskListUncheckedCreateWithoutProjectInput> | Prisma.TaskListCreateWithoutProjectInput[] | Prisma.TaskListUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutProjectInput | Prisma.TaskListCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.TaskListCreateManyProjectInputEnvelope;
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
};
export type TaskListUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutProjectInput, Prisma.TaskListUncheckedCreateWithoutProjectInput> | Prisma.TaskListCreateWithoutProjectInput[] | Prisma.TaskListUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutProjectInput | Prisma.TaskListCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.TaskListUpsertWithWhereUniqueWithoutProjectInput | Prisma.TaskListUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.TaskListCreateManyProjectInputEnvelope;
    set?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    disconnect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    delete?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    update?: Prisma.TaskListUpdateWithWhereUniqueWithoutProjectInput | Prisma.TaskListUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.TaskListUpdateManyWithWhereWithoutProjectInput | Prisma.TaskListUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.TaskListScalarWhereInput | Prisma.TaskListScalarWhereInput[];
};
export type TaskListUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutProjectInput, Prisma.TaskListUncheckedCreateWithoutProjectInput> | Prisma.TaskListCreateWithoutProjectInput[] | Prisma.TaskListUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutProjectInput | Prisma.TaskListCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.TaskListUpsertWithWhereUniqueWithoutProjectInput | Prisma.TaskListUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.TaskListCreateManyProjectInputEnvelope;
    set?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    disconnect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    delete?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    connect?: Prisma.TaskListWhereUniqueInput | Prisma.TaskListWhereUniqueInput[];
    update?: Prisma.TaskListUpdateWithWhereUniqueWithoutProjectInput | Prisma.TaskListUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.TaskListUpdateManyWithWhereWithoutProjectInput | Prisma.TaskListUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.TaskListScalarWhereInput | Prisma.TaskListScalarWhereInput[];
};
export type TaskListCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutTasksInput, Prisma.TaskListUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutTasksInput;
    connect?: Prisma.TaskListWhereUniqueInput;
};
export type TaskListUpdateOneRequiredWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.TaskListCreateWithoutTasksInput, Prisma.TaskListUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.TaskListCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.TaskListUpsertWithoutTasksInput;
    connect?: Prisma.TaskListWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TaskListUpdateToOneWithWhereWithoutTasksInput, Prisma.TaskListUpdateWithoutTasksInput>, Prisma.TaskListUncheckedUpdateWithoutTasksInput>;
};
export type TaskListCreateWithoutCreatorInput = {
    id?: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    project: Prisma.ProjectCreateNestedOneWithoutTaskListsInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutListInput;
};
export type TaskListUncheckedCreateWithoutCreatorInput = {
    id?: string;
    projectId: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutListInput;
};
export type TaskListCreateOrConnectWithoutCreatorInput = {
    where: Prisma.TaskListWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskListCreateWithoutCreatorInput, Prisma.TaskListUncheckedCreateWithoutCreatorInput>;
};
export type TaskListCreateManyCreatorInputEnvelope = {
    data: Prisma.TaskListCreateManyCreatorInput | Prisma.TaskListCreateManyCreatorInput[];
    skipDuplicates?: boolean;
};
export type TaskListUpsertWithWhereUniqueWithoutCreatorInput = {
    where: Prisma.TaskListWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskListUpdateWithoutCreatorInput, Prisma.TaskListUncheckedUpdateWithoutCreatorInput>;
    create: Prisma.XOR<Prisma.TaskListCreateWithoutCreatorInput, Prisma.TaskListUncheckedCreateWithoutCreatorInput>;
};
export type TaskListUpdateWithWhereUniqueWithoutCreatorInput = {
    where: Prisma.TaskListWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskListUpdateWithoutCreatorInput, Prisma.TaskListUncheckedUpdateWithoutCreatorInput>;
};
export type TaskListUpdateManyWithWhereWithoutCreatorInput = {
    where: Prisma.TaskListScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskListUpdateManyMutationInput, Prisma.TaskListUncheckedUpdateManyWithoutCreatorInput>;
};
export type TaskListScalarWhereInput = {
    AND?: Prisma.TaskListScalarWhereInput | Prisma.TaskListScalarWhereInput[];
    OR?: Prisma.TaskListScalarWhereInput[];
    NOT?: Prisma.TaskListScalarWhereInput | Prisma.TaskListScalarWhereInput[];
    id?: Prisma.StringFilter<"TaskList"> | string;
    projectId?: Prisma.StringFilter<"TaskList"> | string;
    name?: Prisma.StringFilter<"TaskList"> | string;
    position?: Prisma.IntFilter<"TaskList"> | number;
    isArchived?: Prisma.BoolFilter<"TaskList"> | boolean;
    createdBy?: Prisma.StringFilter<"TaskList"> | string;
    createdAt?: Prisma.DateTimeFilter<"TaskList"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TaskList"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"TaskList"> | Date | string | null;
};
export type TaskListCreateWithoutProjectInput = {
    id?: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    creator: Prisma.UserCreateNestedOneWithoutTaskListsCreatedInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutListInput;
};
export type TaskListUncheckedCreateWithoutProjectInput = {
    id?: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutListInput;
};
export type TaskListCreateOrConnectWithoutProjectInput = {
    where: Prisma.TaskListWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskListCreateWithoutProjectInput, Prisma.TaskListUncheckedCreateWithoutProjectInput>;
};
export type TaskListCreateManyProjectInputEnvelope = {
    data: Prisma.TaskListCreateManyProjectInput | Prisma.TaskListCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type TaskListUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.TaskListWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskListUpdateWithoutProjectInput, Prisma.TaskListUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.TaskListCreateWithoutProjectInput, Prisma.TaskListUncheckedCreateWithoutProjectInput>;
};
export type TaskListUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.TaskListWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskListUpdateWithoutProjectInput, Prisma.TaskListUncheckedUpdateWithoutProjectInput>;
};
export type TaskListUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.TaskListScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskListUpdateManyMutationInput, Prisma.TaskListUncheckedUpdateManyWithoutProjectInput>;
};
export type TaskListCreateWithoutTasksInput = {
    id?: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    project: Prisma.ProjectCreateNestedOneWithoutTaskListsInput;
    creator: Prisma.UserCreateNestedOneWithoutTaskListsCreatedInput;
};
export type TaskListUncheckedCreateWithoutTasksInput = {
    id?: string;
    projectId: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TaskListCreateOrConnectWithoutTasksInput = {
    where: Prisma.TaskListWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskListCreateWithoutTasksInput, Prisma.TaskListUncheckedCreateWithoutTasksInput>;
};
export type TaskListUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.TaskListUpdateWithoutTasksInput, Prisma.TaskListUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.TaskListCreateWithoutTasksInput, Prisma.TaskListUncheckedCreateWithoutTasksInput>;
    where?: Prisma.TaskListWhereInput;
};
export type TaskListUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.TaskListWhereInput;
    data: Prisma.XOR<Prisma.TaskListUpdateWithoutTasksInput, Prisma.TaskListUncheckedUpdateWithoutTasksInput>;
};
export type TaskListUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneRequiredWithoutTaskListsNestedInput;
    creator?: Prisma.UserUpdateOneRequiredWithoutTaskListsCreatedNestedInput;
};
export type TaskListUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TaskListCreateManyCreatorInput = {
    id?: string;
    projectId: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TaskListUpdateWithoutCreatorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneRequiredWithoutTaskListsNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutListNestedInput;
};
export type TaskListUncheckedUpdateWithoutCreatorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutListNestedInput;
};
export type TaskListUncheckedUpdateManyWithoutCreatorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TaskListCreateManyProjectInput = {
    id?: string;
    name: string;
    position?: number;
    isArchived?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TaskListUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    creator?: Prisma.UserUpdateOneRequiredWithoutTaskListsCreatedNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutListNestedInput;
};
export type TaskListUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutListNestedInput;
};
export type TaskListUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TaskListCountOutputType = {
    tasks: number;
};
export type TaskListCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tasks?: boolean | TaskListCountOutputTypeCountTasksArgs;
};
export type TaskListCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListCountOutputTypeSelect<ExtArgs> | null;
};
export type TaskListCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
};
export type TaskListSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    position?: boolean;
    isArchived?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    tasks?: boolean | Prisma.TaskList$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.TaskListCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskList"]>;
export type TaskListSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    position?: boolean;
    isArchived?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskList"]>;
export type TaskListSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    position?: boolean;
    isArchived?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taskList"]>;
export type TaskListSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    position?: boolean;
    isArchived?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type TaskListOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "name" | "position" | "isArchived" | "createdBy" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["taskList"]>;
export type TaskListInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    tasks?: boolean | Prisma.TaskList$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.TaskListCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TaskListIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TaskListIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    creator?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TaskListPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TaskList";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        creator: Prisma.$UserPayload<ExtArgs>;
        tasks: Prisma.$TaskPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        name: string;
        position: number;
        isArchived: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["taskList"]>;
    composites: {};
};
export type TaskListGetPayload<S extends boolean | null | undefined | TaskListDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TaskListPayload, S>;
export type TaskListCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TaskListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaskListCountAggregateInputType | true;
};
export interface TaskListDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TaskList'];
        meta: {
            name: 'TaskList';
        };
    };
    findUnique<T extends TaskListFindUniqueArgs>(args: Prisma.SelectSubset<T, TaskListFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TaskListFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TaskListFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TaskListFindFirstArgs>(args?: Prisma.SelectSubset<T, TaskListFindFirstArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TaskListFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TaskListFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TaskListFindManyArgs>(args?: Prisma.SelectSubset<T, TaskListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TaskListCreateArgs>(args: Prisma.SelectSubset<T, TaskListCreateArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TaskListCreateManyArgs>(args?: Prisma.SelectSubset<T, TaskListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TaskListCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TaskListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TaskListDeleteArgs>(args: Prisma.SelectSubset<T, TaskListDeleteArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TaskListUpdateArgs>(args: Prisma.SelectSubset<T, TaskListUpdateArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TaskListDeleteManyArgs>(args?: Prisma.SelectSubset<T, TaskListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TaskListUpdateManyArgs>(args: Prisma.SelectSubset<T, TaskListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TaskListUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TaskListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TaskListUpsertArgs>(args: Prisma.SelectSubset<T, TaskListUpsertArgs<ExtArgs>>): Prisma.Prisma__TaskListClient<runtime.Types.Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TaskListCountArgs>(args?: Prisma.Subset<T, TaskListCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaskListCountAggregateOutputType> : number>;
    aggregate<T extends TaskListAggregateArgs>(args: Prisma.Subset<T, TaskListAggregateArgs>): Prisma.PrismaPromise<GetTaskListAggregateType<T>>;
    groupBy<T extends TaskListGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TaskListGroupByArgs['orderBy'];
    } : {
        orderBy?: TaskListGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TaskListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TaskListFieldRefs;
}
export interface Prisma__TaskListClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    creator<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    tasks<T extends Prisma.TaskList$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskList$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TaskListFieldRefs {
    readonly id: Prisma.FieldRef<"TaskList", 'String'>;
    readonly projectId: Prisma.FieldRef<"TaskList", 'String'>;
    readonly name: Prisma.FieldRef<"TaskList", 'String'>;
    readonly position: Prisma.FieldRef<"TaskList", 'Int'>;
    readonly isArchived: Prisma.FieldRef<"TaskList", 'Boolean'>;
    readonly createdBy: Prisma.FieldRef<"TaskList", 'String'>;
    readonly createdAt: Prisma.FieldRef<"TaskList", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"TaskList", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"TaskList", 'DateTime'>;
}
export type TaskListFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    where: Prisma.TaskListWhereUniqueInput;
};
export type TaskListFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    where: Prisma.TaskListWhereUniqueInput;
};
export type TaskListFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    where?: Prisma.TaskListWhereInput;
    orderBy?: Prisma.TaskListOrderByWithRelationInput | Prisma.TaskListOrderByWithRelationInput[];
    cursor?: Prisma.TaskListWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskListScalarFieldEnum | Prisma.TaskListScalarFieldEnum[];
};
export type TaskListFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    where?: Prisma.TaskListWhereInput;
    orderBy?: Prisma.TaskListOrderByWithRelationInput | Prisma.TaskListOrderByWithRelationInput[];
    cursor?: Prisma.TaskListWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskListScalarFieldEnum | Prisma.TaskListScalarFieldEnum[];
};
export type TaskListFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    where?: Prisma.TaskListWhereInput;
    orderBy?: Prisma.TaskListOrderByWithRelationInput | Prisma.TaskListOrderByWithRelationInput[];
    cursor?: Prisma.TaskListWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskListScalarFieldEnum | Prisma.TaskListScalarFieldEnum[];
};
export type TaskListCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskListCreateInput, Prisma.TaskListUncheckedCreateInput>;
};
export type TaskListCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TaskListCreateManyInput | Prisma.TaskListCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TaskListCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    data: Prisma.TaskListCreateManyInput | Prisma.TaskListCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TaskListIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TaskListUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskListUpdateInput, Prisma.TaskListUncheckedUpdateInput>;
    where: Prisma.TaskListWhereUniqueInput;
};
export type TaskListUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TaskListUpdateManyMutationInput, Prisma.TaskListUncheckedUpdateManyInput>;
    where?: Prisma.TaskListWhereInput;
    limit?: number;
};
export type TaskListUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskListUpdateManyMutationInput, Prisma.TaskListUncheckedUpdateManyInput>;
    where?: Prisma.TaskListWhereInput;
    limit?: number;
    include?: Prisma.TaskListIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TaskListUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    where: Prisma.TaskListWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskListCreateInput, Prisma.TaskListUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TaskListUpdateInput, Prisma.TaskListUncheckedUpdateInput>;
};
export type TaskListDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
    where: Prisma.TaskListWhereUniqueInput;
};
export type TaskListDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskListWhereInput;
    limit?: number;
};
export type TaskList$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskScalarFieldEnum | Prisma.TaskScalarFieldEnum[];
};
export type TaskListDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskListSelect<ExtArgs> | null;
    omit?: Prisma.TaskListOmit<ExtArgs> | null;
    include?: Prisma.TaskListInclude<ExtArgs> | null;
};
