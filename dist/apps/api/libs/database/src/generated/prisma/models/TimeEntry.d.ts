import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TimeEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$TimeEntryPayload>;
export type AggregateTimeEntry = {
    _count: TimeEntryCountAggregateOutputType | null;
    _avg: TimeEntryAvgAggregateOutputType | null;
    _sum: TimeEntrySumAggregateOutputType | null;
    _min: TimeEntryMinAggregateOutputType | null;
    _max: TimeEntryMaxAggregateOutputType | null;
};
export type TimeEntryAvgAggregateOutputType = {
    duration: number | null;
};
export type TimeEntrySumAggregateOutputType = {
    duration: number | null;
};
export type TimeEntryMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    description: string | null;
    startTime: Date | null;
    endTime: Date | null;
    duration: number | null;
    isManual: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TimeEntryMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    description: string | null;
    startTime: Date | null;
    endTime: Date | null;
    duration: number | null;
    isManual: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TimeEntryCountAggregateOutputType = {
    id: number;
    taskId: number;
    userId: number;
    description: number;
    startTime: number;
    endTime: number;
    duration: number;
    isManual: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type TimeEntryAvgAggregateInputType = {
    duration?: true;
};
export type TimeEntrySumAggregateInputType = {
    duration?: true;
};
export type TimeEntryMinAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    description?: true;
    startTime?: true;
    endTime?: true;
    duration?: true;
    isManual?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TimeEntryMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    description?: true;
    startTime?: true;
    endTime?: true;
    duration?: true;
    isManual?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TimeEntryCountAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    description?: true;
    startTime?: true;
    endTime?: true;
    duration?: true;
    isManual?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type TimeEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TimeEntryWhereInput;
    orderBy?: Prisma.TimeEntryOrderByWithRelationInput | Prisma.TimeEntryOrderByWithRelationInput[];
    cursor?: Prisma.TimeEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TimeEntryCountAggregateInputType;
    _avg?: TimeEntryAvgAggregateInputType;
    _sum?: TimeEntrySumAggregateInputType;
    _min?: TimeEntryMinAggregateInputType;
    _max?: TimeEntryMaxAggregateInputType;
};
export type GetTimeEntryAggregateType<T extends TimeEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateTimeEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTimeEntry[P]> : Prisma.GetScalarType<T[P], AggregateTimeEntry[P]>;
};
export type TimeEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TimeEntryWhereInput;
    orderBy?: Prisma.TimeEntryOrderByWithAggregationInput | Prisma.TimeEntryOrderByWithAggregationInput[];
    by: Prisma.TimeEntryScalarFieldEnum[] | Prisma.TimeEntryScalarFieldEnum;
    having?: Prisma.TimeEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TimeEntryCountAggregateInputType | true;
    _avg?: TimeEntryAvgAggregateInputType;
    _sum?: TimeEntrySumAggregateInputType;
    _min?: TimeEntryMinAggregateInputType;
    _max?: TimeEntryMaxAggregateInputType;
};
export type TimeEntryGroupByOutputType = {
    id: string;
    taskId: string;
    userId: string;
    description: string | null;
    startTime: Date;
    endTime: Date | null;
    duration: number | null;
    isManual: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: TimeEntryCountAggregateOutputType | null;
    _avg: TimeEntryAvgAggregateOutputType | null;
    _sum: TimeEntrySumAggregateOutputType | null;
    _min: TimeEntryMinAggregateOutputType | null;
    _max: TimeEntryMaxAggregateOutputType | null;
};
export type GetTimeEntryGroupByPayload<T extends TimeEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TimeEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TimeEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TimeEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TimeEntryGroupByOutputType[P]>;
}>>;
export type TimeEntryWhereInput = {
    AND?: Prisma.TimeEntryWhereInput | Prisma.TimeEntryWhereInput[];
    OR?: Prisma.TimeEntryWhereInput[];
    NOT?: Prisma.TimeEntryWhereInput | Prisma.TimeEntryWhereInput[];
    id?: Prisma.StringFilter<"TimeEntry"> | string;
    taskId?: Prisma.StringFilter<"TimeEntry"> | string;
    userId?: Prisma.StringFilter<"TimeEntry"> | string;
    description?: Prisma.StringNullableFilter<"TimeEntry"> | string | null;
    startTime?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    endTime?: Prisma.DateTimeNullableFilter<"TimeEntry"> | Date | string | null;
    duration?: Prisma.IntNullableFilter<"TimeEntry"> | number | null;
    isManual?: Prisma.BoolFilter<"TimeEntry"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"TimeEntry"> | Date | string | null;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TimeEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TimeEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TimeEntryWhereInput | Prisma.TimeEntryWhereInput[];
    OR?: Prisma.TimeEntryWhereInput[];
    NOT?: Prisma.TimeEntryWhereInput | Prisma.TimeEntryWhereInput[];
    taskId?: Prisma.StringFilter<"TimeEntry"> | string;
    userId?: Prisma.StringFilter<"TimeEntry"> | string;
    description?: Prisma.StringNullableFilter<"TimeEntry"> | string | null;
    startTime?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    endTime?: Prisma.DateTimeNullableFilter<"TimeEntry"> | Date | string | null;
    duration?: Prisma.IntNullableFilter<"TimeEntry"> | number | null;
    isManual?: Prisma.BoolFilter<"TimeEntry"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"TimeEntry"> | Date | string | null;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type TimeEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    duration?: Prisma.SortOrderInput | Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TimeEntryCountOrderByAggregateInput;
    _avg?: Prisma.TimeEntryAvgOrderByAggregateInput;
    _max?: Prisma.TimeEntryMaxOrderByAggregateInput;
    _min?: Prisma.TimeEntryMinOrderByAggregateInput;
    _sum?: Prisma.TimeEntrySumOrderByAggregateInput;
};
export type TimeEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.TimeEntryScalarWhereWithAggregatesInput | Prisma.TimeEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.TimeEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TimeEntryScalarWhereWithAggregatesInput | Prisma.TimeEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"TimeEntry"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"TimeEntry"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"TimeEntry"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"TimeEntry"> | string | null;
    startTime?: Prisma.DateTimeWithAggregatesFilter<"TimeEntry"> | Date | string;
    endTime?: Prisma.DateTimeNullableWithAggregatesFilter<"TimeEntry"> | Date | string | null;
    duration?: Prisma.IntNullableWithAggregatesFilter<"TimeEntry"> | number | null;
    isManual?: Prisma.BoolWithAggregatesFilter<"TimeEntry"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"TimeEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"TimeEntry"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"TimeEntry"> | Date | string | null;
};
export type TimeEntryCreateInput = {
    id?: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutTimeEntriesInput;
    user: Prisma.UserCreateNestedOneWithoutTimeEntriesInput;
};
export type TimeEntryUncheckedCreateInput = {
    id?: string;
    taskId: string;
    userId: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TimeEntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutTimeEntriesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutTimeEntriesNestedInput;
};
export type TimeEntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TimeEntryCreateManyInput = {
    id?: string;
    taskId: string;
    userId: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TimeEntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TimeEntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TimeEntryListRelationFilter = {
    every?: Prisma.TimeEntryWhereInput;
    some?: Prisma.TimeEntryWhereInput;
    none?: Prisma.TimeEntryWhereInput;
};
export type TimeEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TimeEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TimeEntryAvgOrderByAggregateInput = {
    duration?: Prisma.SortOrder;
};
export type TimeEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TimeEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    startTime?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    isManual?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TimeEntrySumOrderByAggregateInput = {
    duration?: Prisma.SortOrder;
};
export type TimeEntryCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutUserInput, Prisma.TimeEntryUncheckedCreateWithoutUserInput> | Prisma.TimeEntryCreateWithoutUserInput[] | Prisma.TimeEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutUserInput | Prisma.TimeEntryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TimeEntryCreateManyUserInputEnvelope;
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
};
export type TimeEntryUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutUserInput, Prisma.TimeEntryUncheckedCreateWithoutUserInput> | Prisma.TimeEntryCreateWithoutUserInput[] | Prisma.TimeEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutUserInput | Prisma.TimeEntryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.TimeEntryCreateManyUserInputEnvelope;
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
};
export type TimeEntryUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutUserInput, Prisma.TimeEntryUncheckedCreateWithoutUserInput> | Prisma.TimeEntryCreateWithoutUserInput[] | Prisma.TimeEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutUserInput | Prisma.TimeEntryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TimeEntryUpsertWithWhereUniqueWithoutUserInput | Prisma.TimeEntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TimeEntryCreateManyUserInputEnvelope;
    set?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    disconnect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    delete?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    update?: Prisma.TimeEntryUpdateWithWhereUniqueWithoutUserInput | Prisma.TimeEntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TimeEntryUpdateManyWithWhereWithoutUserInput | Prisma.TimeEntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TimeEntryScalarWhereInput | Prisma.TimeEntryScalarWhereInput[];
};
export type TimeEntryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutUserInput, Prisma.TimeEntryUncheckedCreateWithoutUserInput> | Prisma.TimeEntryCreateWithoutUserInput[] | Prisma.TimeEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutUserInput | Prisma.TimeEntryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.TimeEntryUpsertWithWhereUniqueWithoutUserInput | Prisma.TimeEntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.TimeEntryCreateManyUserInputEnvelope;
    set?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    disconnect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    delete?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    update?: Prisma.TimeEntryUpdateWithWhereUniqueWithoutUserInput | Prisma.TimeEntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.TimeEntryUpdateManyWithWhereWithoutUserInput | Prisma.TimeEntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.TimeEntryScalarWhereInput | Prisma.TimeEntryScalarWhereInput[];
};
export type TimeEntryCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutTaskInput, Prisma.TimeEntryUncheckedCreateWithoutTaskInput> | Prisma.TimeEntryCreateWithoutTaskInput[] | Prisma.TimeEntryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutTaskInput | Prisma.TimeEntryCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TimeEntryCreateManyTaskInputEnvelope;
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
};
export type TimeEntryUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutTaskInput, Prisma.TimeEntryUncheckedCreateWithoutTaskInput> | Prisma.TimeEntryCreateWithoutTaskInput[] | Prisma.TimeEntryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutTaskInput | Prisma.TimeEntryCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.TimeEntryCreateManyTaskInputEnvelope;
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
};
export type TimeEntryUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutTaskInput, Prisma.TimeEntryUncheckedCreateWithoutTaskInput> | Prisma.TimeEntryCreateWithoutTaskInput[] | Prisma.TimeEntryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutTaskInput | Prisma.TimeEntryCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TimeEntryUpsertWithWhereUniqueWithoutTaskInput | Prisma.TimeEntryUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TimeEntryCreateManyTaskInputEnvelope;
    set?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    disconnect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    delete?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    update?: Prisma.TimeEntryUpdateWithWhereUniqueWithoutTaskInput | Prisma.TimeEntryUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TimeEntryUpdateManyWithWhereWithoutTaskInput | Prisma.TimeEntryUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TimeEntryScalarWhereInput | Prisma.TimeEntryScalarWhereInput[];
};
export type TimeEntryUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.TimeEntryCreateWithoutTaskInput, Prisma.TimeEntryUncheckedCreateWithoutTaskInput> | Prisma.TimeEntryCreateWithoutTaskInput[] | Prisma.TimeEntryUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.TimeEntryCreateOrConnectWithoutTaskInput | Prisma.TimeEntryCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.TimeEntryUpsertWithWhereUniqueWithoutTaskInput | Prisma.TimeEntryUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.TimeEntryCreateManyTaskInputEnvelope;
    set?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    disconnect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    delete?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    connect?: Prisma.TimeEntryWhereUniqueInput | Prisma.TimeEntryWhereUniqueInput[];
    update?: Prisma.TimeEntryUpdateWithWhereUniqueWithoutTaskInput | Prisma.TimeEntryUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.TimeEntryUpdateManyWithWhereWithoutTaskInput | Prisma.TimeEntryUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.TimeEntryScalarWhereInput | Prisma.TimeEntryScalarWhereInput[];
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type TimeEntryCreateWithoutUserInput = {
    id?: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutTimeEntriesInput;
};
export type TimeEntryUncheckedCreateWithoutUserInput = {
    id?: string;
    taskId: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TimeEntryCreateOrConnectWithoutUserInput = {
    where: Prisma.TimeEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.TimeEntryCreateWithoutUserInput, Prisma.TimeEntryUncheckedCreateWithoutUserInput>;
};
export type TimeEntryCreateManyUserInputEnvelope = {
    data: Prisma.TimeEntryCreateManyUserInput | Prisma.TimeEntryCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type TimeEntryUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.TimeEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.TimeEntryUpdateWithoutUserInput, Prisma.TimeEntryUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TimeEntryCreateWithoutUserInput, Prisma.TimeEntryUncheckedCreateWithoutUserInput>;
};
export type TimeEntryUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.TimeEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.TimeEntryUpdateWithoutUserInput, Prisma.TimeEntryUncheckedUpdateWithoutUserInput>;
};
export type TimeEntryUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.TimeEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.TimeEntryUpdateManyMutationInput, Prisma.TimeEntryUncheckedUpdateManyWithoutUserInput>;
};
export type TimeEntryScalarWhereInput = {
    AND?: Prisma.TimeEntryScalarWhereInput | Prisma.TimeEntryScalarWhereInput[];
    OR?: Prisma.TimeEntryScalarWhereInput[];
    NOT?: Prisma.TimeEntryScalarWhereInput | Prisma.TimeEntryScalarWhereInput[];
    id?: Prisma.StringFilter<"TimeEntry"> | string;
    taskId?: Prisma.StringFilter<"TimeEntry"> | string;
    userId?: Prisma.StringFilter<"TimeEntry"> | string;
    description?: Prisma.StringNullableFilter<"TimeEntry"> | string | null;
    startTime?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    endTime?: Prisma.DateTimeNullableFilter<"TimeEntry"> | Date | string | null;
    duration?: Prisma.IntNullableFilter<"TimeEntry"> | number | null;
    isManual?: Prisma.BoolFilter<"TimeEntry"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"TimeEntry"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"TimeEntry"> | Date | string | null;
};
export type TimeEntryCreateWithoutTaskInput = {
    id?: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutTimeEntriesInput;
};
export type TimeEntryUncheckedCreateWithoutTaskInput = {
    id?: string;
    userId: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TimeEntryCreateOrConnectWithoutTaskInput = {
    where: Prisma.TimeEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.TimeEntryCreateWithoutTaskInput, Prisma.TimeEntryUncheckedCreateWithoutTaskInput>;
};
export type TimeEntryCreateManyTaskInputEnvelope = {
    data: Prisma.TimeEntryCreateManyTaskInput | Prisma.TimeEntryCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type TimeEntryUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TimeEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.TimeEntryUpdateWithoutTaskInput, Prisma.TimeEntryUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.TimeEntryCreateWithoutTaskInput, Prisma.TimeEntryUncheckedCreateWithoutTaskInput>;
};
export type TimeEntryUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.TimeEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.TimeEntryUpdateWithoutTaskInput, Prisma.TimeEntryUncheckedUpdateWithoutTaskInput>;
};
export type TimeEntryUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.TimeEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.TimeEntryUpdateManyMutationInput, Prisma.TimeEntryUncheckedUpdateManyWithoutTaskInput>;
};
export type TimeEntryCreateManyUserInput = {
    id?: string;
    taskId: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TimeEntryUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutTimeEntriesNestedInput;
};
export type TimeEntryUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TimeEntryUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TimeEntryCreateManyTaskInput = {
    id?: string;
    userId: string;
    description?: string | null;
    startTime: Date | string;
    endTime?: Date | string | null;
    duration?: number | null;
    isManual?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TimeEntryUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutTimeEntriesNestedInput;
};
export type TimeEntryUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TimeEntryUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    duration?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isManual?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TimeEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    description?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    duration?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["timeEntry"]>;
export type TimeEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    description?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    duration?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["timeEntry"]>;
export type TimeEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    description?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    duration?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["timeEntry"]>;
export type TimeEntrySelectScalar = {
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    description?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    duration?: boolean;
    isManual?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type TimeEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "userId" | "description" | "startTime" | "endTime" | "duration" | "isManual" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["timeEntry"]>;
export type TimeEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TimeEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TimeEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TimeEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TimeEntry";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        userId: string;
        description: string | null;
        startTime: Date;
        endTime: Date | null;
        duration: number | null;
        isManual: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["timeEntry"]>;
    composites: {};
};
export type TimeEntryGetPayload<S extends boolean | null | undefined | TimeEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload, S>;
export type TimeEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TimeEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TimeEntryCountAggregateInputType | true;
};
export interface TimeEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TimeEntry'];
        meta: {
            name: 'TimeEntry';
        };
    };
    findUnique<T extends TimeEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, TimeEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TimeEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TimeEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TimeEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, TimeEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TimeEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TimeEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TimeEntryFindManyArgs>(args?: Prisma.SelectSubset<T, TimeEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TimeEntryCreateArgs>(args: Prisma.SelectSubset<T, TimeEntryCreateArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TimeEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, TimeEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TimeEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TimeEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TimeEntryDeleteArgs>(args: Prisma.SelectSubset<T, TimeEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TimeEntryUpdateArgs>(args: Prisma.SelectSubset<T, TimeEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TimeEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, TimeEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TimeEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, TimeEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TimeEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TimeEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TimeEntryUpsertArgs>(args: Prisma.SelectSubset<T, TimeEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__TimeEntryClient<runtime.Types.Result.GetResult<Prisma.$TimeEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TimeEntryCountArgs>(args?: Prisma.Subset<T, TimeEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TimeEntryCountAggregateOutputType> : number>;
    aggregate<T extends TimeEntryAggregateArgs>(args: Prisma.Subset<T, TimeEntryAggregateArgs>): Prisma.PrismaPromise<GetTimeEntryAggregateType<T>>;
    groupBy<T extends TimeEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TimeEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: TimeEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TimeEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTimeEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TimeEntryFieldRefs;
}
export interface Prisma__TimeEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TimeEntryFieldRefs {
    readonly id: Prisma.FieldRef<"TimeEntry", 'String'>;
    readonly taskId: Prisma.FieldRef<"TimeEntry", 'String'>;
    readonly userId: Prisma.FieldRef<"TimeEntry", 'String'>;
    readonly description: Prisma.FieldRef<"TimeEntry", 'String'>;
    readonly startTime: Prisma.FieldRef<"TimeEntry", 'DateTime'>;
    readonly endTime: Prisma.FieldRef<"TimeEntry", 'DateTime'>;
    readonly duration: Prisma.FieldRef<"TimeEntry", 'Int'>;
    readonly isManual: Prisma.FieldRef<"TimeEntry", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"TimeEntry", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"TimeEntry", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"TimeEntry", 'DateTime'>;
}
export type TimeEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    where: Prisma.TimeEntryWhereUniqueInput;
};
export type TimeEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    where: Prisma.TimeEntryWhereUniqueInput;
};
export type TimeEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    where?: Prisma.TimeEntryWhereInput;
    orderBy?: Prisma.TimeEntryOrderByWithRelationInput | Prisma.TimeEntryOrderByWithRelationInput[];
    cursor?: Prisma.TimeEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TimeEntryScalarFieldEnum | Prisma.TimeEntryScalarFieldEnum[];
};
export type TimeEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    where?: Prisma.TimeEntryWhereInput;
    orderBy?: Prisma.TimeEntryOrderByWithRelationInput | Prisma.TimeEntryOrderByWithRelationInput[];
    cursor?: Prisma.TimeEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TimeEntryScalarFieldEnum | Prisma.TimeEntryScalarFieldEnum[];
};
export type TimeEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    where?: Prisma.TimeEntryWhereInput;
    orderBy?: Prisma.TimeEntryOrderByWithRelationInput | Prisma.TimeEntryOrderByWithRelationInput[];
    cursor?: Prisma.TimeEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TimeEntryScalarFieldEnum | Prisma.TimeEntryScalarFieldEnum[];
};
export type TimeEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TimeEntryCreateInput, Prisma.TimeEntryUncheckedCreateInput>;
};
export type TimeEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TimeEntryCreateManyInput | Prisma.TimeEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TimeEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    data: Prisma.TimeEntryCreateManyInput | Prisma.TimeEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TimeEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TimeEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TimeEntryUpdateInput, Prisma.TimeEntryUncheckedUpdateInput>;
    where: Prisma.TimeEntryWhereUniqueInput;
};
export type TimeEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TimeEntryUpdateManyMutationInput, Prisma.TimeEntryUncheckedUpdateManyInput>;
    where?: Prisma.TimeEntryWhereInput;
    limit?: number;
};
export type TimeEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TimeEntryUpdateManyMutationInput, Prisma.TimeEntryUncheckedUpdateManyInput>;
    where?: Prisma.TimeEntryWhereInput;
    limit?: number;
    include?: Prisma.TimeEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TimeEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    where: Prisma.TimeEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.TimeEntryCreateInput, Prisma.TimeEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TimeEntryUpdateInput, Prisma.TimeEntryUncheckedUpdateInput>;
};
export type TimeEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
    where: Prisma.TimeEntryWhereUniqueInput;
};
export type TimeEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TimeEntryWhereInput;
    limit?: number;
};
export type TimeEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TimeEntrySelect<ExtArgs> | null;
    omit?: Prisma.TimeEntryOmit<ExtArgs> | null;
    include?: Prisma.TimeEntryInclude<ExtArgs> | null;
};
