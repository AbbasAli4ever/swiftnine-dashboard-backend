import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type StatusModel = runtime.Types.Result.DefaultSelection<Prisma.$StatusPayload>;
export type AggregateStatus = {
    _count: StatusCountAggregateOutputType | null;
    _avg: StatusAvgAggregateOutputType | null;
    _sum: StatusSumAggregateOutputType | null;
    _min: StatusMinAggregateOutputType | null;
    _max: StatusMaxAggregateOutputType | null;
};
export type StatusAvgAggregateOutputType = {
    position: number | null;
};
export type StatusSumAggregateOutputType = {
    position: number | null;
};
export type StatusMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    name: string | null;
    color: string | null;
    position: number | null;
    isDefault: boolean | null;
    isClosed: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type StatusMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    name: string | null;
    color: string | null;
    position: number | null;
    isDefault: boolean | null;
    isClosed: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type StatusCountAggregateOutputType = {
    id: number;
    projectId: number;
    name: number;
    color: number;
    position: number;
    isDefault: number;
    isClosed: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type StatusAvgAggregateInputType = {
    position?: true;
};
export type StatusSumAggregateInputType = {
    position?: true;
};
export type StatusMinAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    color?: true;
    position?: true;
    isDefault?: true;
    isClosed?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type StatusMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    color?: true;
    position?: true;
    isDefault?: true;
    isClosed?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type StatusCountAggregateInputType = {
    id?: true;
    projectId?: true;
    name?: true;
    color?: true;
    position?: true;
    isDefault?: true;
    isClosed?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type StatusAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusWhereInput;
    orderBy?: Prisma.StatusOrderByWithRelationInput | Prisma.StatusOrderByWithRelationInput[];
    cursor?: Prisma.StatusWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StatusCountAggregateInputType;
    _avg?: StatusAvgAggregateInputType;
    _sum?: StatusSumAggregateInputType;
    _min?: StatusMinAggregateInputType;
    _max?: StatusMaxAggregateInputType;
};
export type GetStatusAggregateType<T extends StatusAggregateArgs> = {
    [P in keyof T & keyof AggregateStatus]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStatus[P]> : Prisma.GetScalarType<T[P], AggregateStatus[P]>;
};
export type StatusGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusWhereInput;
    orderBy?: Prisma.StatusOrderByWithAggregationInput | Prisma.StatusOrderByWithAggregationInput[];
    by: Prisma.StatusScalarFieldEnum[] | Prisma.StatusScalarFieldEnum;
    having?: Prisma.StatusScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StatusCountAggregateInputType | true;
    _avg?: StatusAvgAggregateInputType;
    _sum?: StatusSumAggregateInputType;
    _min?: StatusMinAggregateInputType;
    _max?: StatusMaxAggregateInputType;
};
export type StatusGroupByOutputType = {
    id: string;
    projectId: string;
    name: string;
    color: string;
    position: number;
    isDefault: boolean;
    isClosed: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: StatusCountAggregateOutputType | null;
    _avg: StatusAvgAggregateOutputType | null;
    _sum: StatusSumAggregateOutputType | null;
    _min: StatusMinAggregateOutputType | null;
    _max: StatusMaxAggregateOutputType | null;
};
export type GetStatusGroupByPayload<T extends StatusGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StatusGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StatusGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StatusGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StatusGroupByOutputType[P]>;
}>>;
export type StatusWhereInput = {
    AND?: Prisma.StatusWhereInput | Prisma.StatusWhereInput[];
    OR?: Prisma.StatusWhereInput[];
    NOT?: Prisma.StatusWhereInput | Prisma.StatusWhereInput[];
    id?: Prisma.StringFilter<"Status"> | string;
    projectId?: Prisma.StringFilter<"Status"> | string;
    name?: Prisma.StringFilter<"Status"> | string;
    color?: Prisma.StringFilter<"Status"> | string;
    position?: Prisma.IntFilter<"Status"> | number;
    isDefault?: Prisma.BoolFilter<"Status"> | boolean;
    isClosed?: Prisma.BoolFilter<"Status"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Status"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Status"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Status"> | Date | string | null;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    tasks?: Prisma.TaskListRelationFilter;
};
export type StatusOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    isClosed?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    tasks?: Prisma.TaskOrderByRelationAggregateInput;
};
export type StatusWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    projectId_name?: Prisma.StatusProjectIdNameCompoundUniqueInput;
    AND?: Prisma.StatusWhereInput | Prisma.StatusWhereInput[];
    OR?: Prisma.StatusWhereInput[];
    NOT?: Prisma.StatusWhereInput | Prisma.StatusWhereInput[];
    projectId?: Prisma.StringFilter<"Status"> | string;
    name?: Prisma.StringFilter<"Status"> | string;
    color?: Prisma.StringFilter<"Status"> | string;
    position?: Prisma.IntFilter<"Status"> | number;
    isDefault?: Prisma.BoolFilter<"Status"> | boolean;
    isClosed?: Prisma.BoolFilter<"Status"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Status"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Status"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Status"> | Date | string | null;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    tasks?: Prisma.TaskListRelationFilter;
}, "id" | "projectId_name">;
export type StatusOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    isClosed?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.StatusCountOrderByAggregateInput;
    _avg?: Prisma.StatusAvgOrderByAggregateInput;
    _max?: Prisma.StatusMaxOrderByAggregateInput;
    _min?: Prisma.StatusMinOrderByAggregateInput;
    _sum?: Prisma.StatusSumOrderByAggregateInput;
};
export type StatusScalarWhereWithAggregatesInput = {
    AND?: Prisma.StatusScalarWhereWithAggregatesInput | Prisma.StatusScalarWhereWithAggregatesInput[];
    OR?: Prisma.StatusScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StatusScalarWhereWithAggregatesInput | Prisma.StatusScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Status"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"Status"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Status"> | string;
    color?: Prisma.StringWithAggregatesFilter<"Status"> | string;
    position?: Prisma.IntWithAggregatesFilter<"Status"> | number;
    isDefault?: Prisma.BoolWithAggregatesFilter<"Status"> | boolean;
    isClosed?: Prisma.BoolWithAggregatesFilter<"Status"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Status"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Status"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Status"> | Date | string | null;
};
export type StatusCreateInput = {
    id?: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    project: Prisma.ProjectCreateNestedOneWithoutStatusesInput;
    tasks?: Prisma.TaskCreateNestedManyWithoutStatusInput;
};
export type StatusUncheckedCreateInput = {
    id?: string;
    projectId: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutStatusInput;
};
export type StatusUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneRequiredWithoutStatusesNestedInput;
    tasks?: Prisma.TaskUpdateManyWithoutStatusNestedInput;
};
export type StatusUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutStatusNestedInput;
};
export type StatusCreateManyInput = {
    id?: string;
    projectId: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type StatusUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StatusUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StatusListRelationFilter = {
    every?: Prisma.StatusWhereInput;
    some?: Prisma.StatusWhereInput;
    none?: Prisma.StatusWhereInput;
};
export type StatusOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StatusProjectIdNameCompoundUniqueInput = {
    projectId: string;
    name: string;
};
export type StatusCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    isClosed?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type StatusAvgOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type StatusMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    isClosed?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type StatusMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isDefault?: Prisma.SortOrder;
    isClosed?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type StatusSumOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type StatusScalarRelationFilter = {
    is?: Prisma.StatusWhereInput;
    isNot?: Prisma.StatusWhereInput;
};
export type StatusCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.StatusCreateWithoutProjectInput, Prisma.StatusUncheckedCreateWithoutProjectInput> | Prisma.StatusCreateWithoutProjectInput[] | Prisma.StatusUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.StatusCreateOrConnectWithoutProjectInput | Prisma.StatusCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.StatusCreateManyProjectInputEnvelope;
    connect?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
};
export type StatusUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.StatusCreateWithoutProjectInput, Prisma.StatusUncheckedCreateWithoutProjectInput> | Prisma.StatusCreateWithoutProjectInput[] | Prisma.StatusUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.StatusCreateOrConnectWithoutProjectInput | Prisma.StatusCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.StatusCreateManyProjectInputEnvelope;
    connect?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
};
export type StatusUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.StatusCreateWithoutProjectInput, Prisma.StatusUncheckedCreateWithoutProjectInput> | Prisma.StatusCreateWithoutProjectInput[] | Prisma.StatusUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.StatusCreateOrConnectWithoutProjectInput | Prisma.StatusCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.StatusUpsertWithWhereUniqueWithoutProjectInput | Prisma.StatusUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.StatusCreateManyProjectInputEnvelope;
    set?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    disconnect?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    delete?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    connect?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    update?: Prisma.StatusUpdateWithWhereUniqueWithoutProjectInput | Prisma.StatusUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.StatusUpdateManyWithWhereWithoutProjectInput | Prisma.StatusUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.StatusScalarWhereInput | Prisma.StatusScalarWhereInput[];
};
export type StatusUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.StatusCreateWithoutProjectInput, Prisma.StatusUncheckedCreateWithoutProjectInput> | Prisma.StatusCreateWithoutProjectInput[] | Prisma.StatusUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.StatusCreateOrConnectWithoutProjectInput | Prisma.StatusCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.StatusUpsertWithWhereUniqueWithoutProjectInput | Prisma.StatusUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.StatusCreateManyProjectInputEnvelope;
    set?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    disconnect?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    delete?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    connect?: Prisma.StatusWhereUniqueInput | Prisma.StatusWhereUniqueInput[];
    update?: Prisma.StatusUpdateWithWhereUniqueWithoutProjectInput | Prisma.StatusUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.StatusUpdateManyWithWhereWithoutProjectInput | Prisma.StatusUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.StatusScalarWhereInput | Prisma.StatusScalarWhereInput[];
};
export type StatusCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.StatusCreateWithoutTasksInput, Prisma.StatusUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.StatusCreateOrConnectWithoutTasksInput;
    connect?: Prisma.StatusWhereUniqueInput;
};
export type StatusUpdateOneRequiredWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.StatusCreateWithoutTasksInput, Prisma.StatusUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.StatusCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.StatusUpsertWithoutTasksInput;
    connect?: Prisma.StatusWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StatusUpdateToOneWithWhereWithoutTasksInput, Prisma.StatusUpdateWithoutTasksInput>, Prisma.StatusUncheckedUpdateWithoutTasksInput>;
};
export type StatusCreateWithoutProjectInput = {
    id?: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tasks?: Prisma.TaskCreateNestedManyWithoutStatusInput;
};
export type StatusUncheckedCreateWithoutProjectInput = {
    id?: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutStatusInput;
};
export type StatusCreateOrConnectWithoutProjectInput = {
    where: Prisma.StatusWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusCreateWithoutProjectInput, Prisma.StatusUncheckedCreateWithoutProjectInput>;
};
export type StatusCreateManyProjectInputEnvelope = {
    data: Prisma.StatusCreateManyProjectInput | Prisma.StatusCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type StatusUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.StatusWhereUniqueInput;
    update: Prisma.XOR<Prisma.StatusUpdateWithoutProjectInput, Prisma.StatusUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.StatusCreateWithoutProjectInput, Prisma.StatusUncheckedCreateWithoutProjectInput>;
};
export type StatusUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.StatusWhereUniqueInput;
    data: Prisma.XOR<Prisma.StatusUpdateWithoutProjectInput, Prisma.StatusUncheckedUpdateWithoutProjectInput>;
};
export type StatusUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.StatusScalarWhereInput;
    data: Prisma.XOR<Prisma.StatusUpdateManyMutationInput, Prisma.StatusUncheckedUpdateManyWithoutProjectInput>;
};
export type StatusScalarWhereInput = {
    AND?: Prisma.StatusScalarWhereInput | Prisma.StatusScalarWhereInput[];
    OR?: Prisma.StatusScalarWhereInput[];
    NOT?: Prisma.StatusScalarWhereInput | Prisma.StatusScalarWhereInput[];
    id?: Prisma.StringFilter<"Status"> | string;
    projectId?: Prisma.StringFilter<"Status"> | string;
    name?: Prisma.StringFilter<"Status"> | string;
    color?: Prisma.StringFilter<"Status"> | string;
    position?: Prisma.IntFilter<"Status"> | number;
    isDefault?: Prisma.BoolFilter<"Status"> | boolean;
    isClosed?: Prisma.BoolFilter<"Status"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Status"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Status"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Status"> | Date | string | null;
};
export type StatusCreateWithoutTasksInput = {
    id?: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    project: Prisma.ProjectCreateNestedOneWithoutStatusesInput;
};
export type StatusUncheckedCreateWithoutTasksInput = {
    id?: string;
    projectId: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type StatusCreateOrConnectWithoutTasksInput = {
    where: Prisma.StatusWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusCreateWithoutTasksInput, Prisma.StatusUncheckedCreateWithoutTasksInput>;
};
export type StatusUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.StatusUpdateWithoutTasksInput, Prisma.StatusUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.StatusCreateWithoutTasksInput, Prisma.StatusUncheckedCreateWithoutTasksInput>;
    where?: Prisma.StatusWhereInput;
};
export type StatusUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.StatusWhereInput;
    data: Prisma.XOR<Prisma.StatusUpdateWithoutTasksInput, Prisma.StatusUncheckedUpdateWithoutTasksInput>;
};
export type StatusUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneRequiredWithoutStatusesNestedInput;
};
export type StatusUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StatusCreateManyProjectInput = {
    id?: string;
    name: string;
    color?: string;
    position?: number;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type StatusUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.TaskUpdateManyWithoutStatusNestedInput;
};
export type StatusUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.TaskUncheckedUpdateManyWithoutStatusNestedInput;
};
export type StatusUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    isDefault?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isClosed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StatusCountOutputType = {
    tasks: number;
};
export type StatusCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tasks?: boolean | StatusCountOutputTypeCountTasksArgs;
};
export type StatusCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusCountOutputTypeSelect<ExtArgs> | null;
};
export type StatusCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
};
export type StatusSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    color?: boolean;
    position?: boolean;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    tasks?: boolean | Prisma.Status$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.StatusCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["status"]>;
export type StatusSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    color?: boolean;
    position?: boolean;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["status"]>;
export type StatusSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    color?: boolean;
    position?: boolean;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["status"]>;
export type StatusSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    name?: boolean;
    color?: boolean;
    position?: boolean;
    isDefault?: boolean;
    isClosed?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type StatusOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "name" | "color" | "position" | "isDefault" | "isClosed" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["status"]>;
export type StatusInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    tasks?: boolean | Prisma.Status$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.StatusCountOutputTypeDefaultArgs<ExtArgs>;
};
export type StatusIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type StatusIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type $StatusPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Status";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        tasks: Prisma.$TaskPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        name: string;
        color: string;
        position: number;
        isDefault: boolean;
        isClosed: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["status"]>;
    composites: {};
};
export type StatusGetPayload<S extends boolean | null | undefined | StatusDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StatusPayload, S>;
export type StatusCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StatusFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StatusCountAggregateInputType | true;
};
export interface StatusDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Status'];
        meta: {
            name: 'Status';
        };
    };
    findUnique<T extends StatusFindUniqueArgs>(args: Prisma.SelectSubset<T, StatusFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StatusFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StatusFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StatusFindFirstArgs>(args?: Prisma.SelectSubset<T, StatusFindFirstArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StatusFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StatusFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StatusFindManyArgs>(args?: Prisma.SelectSubset<T, StatusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StatusCreateArgs>(args: Prisma.SelectSubset<T, StatusCreateArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StatusCreateManyArgs>(args?: Prisma.SelectSubset<T, StatusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StatusCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StatusCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StatusDeleteArgs>(args: Prisma.SelectSubset<T, StatusDeleteArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StatusUpdateArgs>(args: Prisma.SelectSubset<T, StatusUpdateArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StatusDeleteManyArgs>(args?: Prisma.SelectSubset<T, StatusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StatusUpdateManyArgs>(args: Prisma.SelectSubset<T, StatusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StatusUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StatusUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StatusUpsertArgs>(args: Prisma.SelectSubset<T, StatusUpsertArgs<ExtArgs>>): Prisma.Prisma__StatusClient<runtime.Types.Result.GetResult<Prisma.$StatusPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StatusCountArgs>(args?: Prisma.Subset<T, StatusCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StatusCountAggregateOutputType> : number>;
    aggregate<T extends StatusAggregateArgs>(args: Prisma.Subset<T, StatusAggregateArgs>): Prisma.PrismaPromise<GetStatusAggregateType<T>>;
    groupBy<T extends StatusGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StatusGroupByArgs['orderBy'];
    } : {
        orderBy?: StatusGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StatusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStatusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StatusFieldRefs;
}
export interface Prisma__StatusClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    tasks<T extends Prisma.Status$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Status$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StatusFieldRefs {
    readonly id: Prisma.FieldRef<"Status", 'String'>;
    readonly projectId: Prisma.FieldRef<"Status", 'String'>;
    readonly name: Prisma.FieldRef<"Status", 'String'>;
    readonly color: Prisma.FieldRef<"Status", 'String'>;
    readonly position: Prisma.FieldRef<"Status", 'Int'>;
    readonly isDefault: Prisma.FieldRef<"Status", 'Boolean'>;
    readonly isClosed: Prisma.FieldRef<"Status", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Status", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Status", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Status", 'DateTime'>;
}
export type StatusFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    where: Prisma.StatusWhereUniqueInput;
};
export type StatusFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    where: Prisma.StatusWhereUniqueInput;
};
export type StatusFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    where?: Prisma.StatusWhereInput;
    orderBy?: Prisma.StatusOrderByWithRelationInput | Prisma.StatusOrderByWithRelationInput[];
    cursor?: Prisma.StatusWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StatusScalarFieldEnum | Prisma.StatusScalarFieldEnum[];
};
export type StatusFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    where?: Prisma.StatusWhereInput;
    orderBy?: Prisma.StatusOrderByWithRelationInput | Prisma.StatusOrderByWithRelationInput[];
    cursor?: Prisma.StatusWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StatusScalarFieldEnum | Prisma.StatusScalarFieldEnum[];
};
export type StatusFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    where?: Prisma.StatusWhereInput;
    orderBy?: Prisma.StatusOrderByWithRelationInput | Prisma.StatusOrderByWithRelationInput[];
    cursor?: Prisma.StatusWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StatusScalarFieldEnum | Prisma.StatusScalarFieldEnum[];
};
export type StatusCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusCreateInput, Prisma.StatusUncheckedCreateInput>;
};
export type StatusCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StatusCreateManyInput | Prisma.StatusCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StatusCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    data: Prisma.StatusCreateManyInput | Prisma.StatusCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StatusIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StatusUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusUpdateInput, Prisma.StatusUncheckedUpdateInput>;
    where: Prisma.StatusWhereUniqueInput;
};
export type StatusUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StatusUpdateManyMutationInput, Prisma.StatusUncheckedUpdateManyInput>;
    where?: Prisma.StatusWhereInput;
    limit?: number;
};
export type StatusUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StatusUpdateManyMutationInput, Prisma.StatusUncheckedUpdateManyInput>;
    where?: Prisma.StatusWhereInput;
    limit?: number;
    include?: Prisma.StatusIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StatusUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    where: Prisma.StatusWhereUniqueInput;
    create: Prisma.XOR<Prisma.StatusCreateInput, Prisma.StatusUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StatusUpdateInput, Prisma.StatusUncheckedUpdateInput>;
};
export type StatusDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
    where: Prisma.StatusWhereUniqueInput;
};
export type StatusDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StatusWhereInput;
    limit?: number;
};
export type Status$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StatusDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StatusSelect<ExtArgs> | null;
    omit?: Prisma.StatusOmit<ExtArgs> | null;
    include?: Prisma.StatusInclude<ExtArgs> | null;
};
