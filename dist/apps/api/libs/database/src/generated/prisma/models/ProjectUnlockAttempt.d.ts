import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ProjectUnlockAttemptModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectUnlockAttemptPayload>;
export type AggregateProjectUnlockAttempt = {
    _count: ProjectUnlockAttemptCountAggregateOutputType | null;
    _avg: ProjectUnlockAttemptAvgAggregateOutputType | null;
    _sum: ProjectUnlockAttemptSumAggregateOutputType | null;
    _min: ProjectUnlockAttemptMinAggregateOutputType | null;
    _max: ProjectUnlockAttemptMaxAggregateOutputType | null;
};
export type ProjectUnlockAttemptAvgAggregateOutputType = {
    failedCount: number | null;
};
export type ProjectUnlockAttemptSumAggregateOutputType = {
    failedCount: number | null;
};
export type ProjectUnlockAttemptMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    failedCount: number | null;
    lockedUntil: Date | null;
    lastFailAt: Date | null;
};
export type ProjectUnlockAttemptMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    failedCount: number | null;
    lockedUntil: Date | null;
    lastFailAt: Date | null;
};
export type ProjectUnlockAttemptCountAggregateOutputType = {
    id: number;
    projectId: number;
    userId: number;
    failedCount: number;
    lockedUntil: number;
    lastFailAt: number;
    _all: number;
};
export type ProjectUnlockAttemptAvgAggregateInputType = {
    failedCount?: true;
};
export type ProjectUnlockAttemptSumAggregateInputType = {
    failedCount?: true;
};
export type ProjectUnlockAttemptMinAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    failedCount?: true;
    lockedUntil?: true;
    lastFailAt?: true;
};
export type ProjectUnlockAttemptMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    failedCount?: true;
    lockedUntil?: true;
    lastFailAt?: true;
};
export type ProjectUnlockAttemptCountAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    failedCount?: true;
    lockedUntil?: true;
    lastFailAt?: true;
    _all?: true;
};
export type ProjectUnlockAttemptAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    orderBy?: Prisma.ProjectUnlockAttemptOrderByWithRelationInput | Prisma.ProjectUnlockAttemptOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProjectUnlockAttemptCountAggregateInputType;
    _avg?: ProjectUnlockAttemptAvgAggregateInputType;
    _sum?: ProjectUnlockAttemptSumAggregateInputType;
    _min?: ProjectUnlockAttemptMinAggregateInputType;
    _max?: ProjectUnlockAttemptMaxAggregateInputType;
};
export type GetProjectUnlockAttemptAggregateType<T extends ProjectUnlockAttemptAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectUnlockAttempt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProjectUnlockAttempt[P]> : Prisma.GetScalarType<T[P], AggregateProjectUnlockAttempt[P]>;
};
export type ProjectUnlockAttemptGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    orderBy?: Prisma.ProjectUnlockAttemptOrderByWithAggregationInput | Prisma.ProjectUnlockAttemptOrderByWithAggregationInput[];
    by: Prisma.ProjectUnlockAttemptScalarFieldEnum[] | Prisma.ProjectUnlockAttemptScalarFieldEnum;
    having?: Prisma.ProjectUnlockAttemptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectUnlockAttemptCountAggregateInputType | true;
    _avg?: ProjectUnlockAttemptAvgAggregateInputType;
    _sum?: ProjectUnlockAttemptSumAggregateInputType;
    _min?: ProjectUnlockAttemptMinAggregateInputType;
    _max?: ProjectUnlockAttemptMaxAggregateInputType;
};
export type ProjectUnlockAttemptGroupByOutputType = {
    id: string;
    projectId: string;
    userId: string;
    failedCount: number;
    lockedUntil: Date | null;
    lastFailAt: Date | null;
    _count: ProjectUnlockAttemptCountAggregateOutputType | null;
    _avg: ProjectUnlockAttemptAvgAggregateOutputType | null;
    _sum: ProjectUnlockAttemptSumAggregateOutputType | null;
    _min: ProjectUnlockAttemptMinAggregateOutputType | null;
    _max: ProjectUnlockAttemptMaxAggregateOutputType | null;
};
export type GetProjectUnlockAttemptGroupByPayload<T extends ProjectUnlockAttemptGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectUnlockAttemptGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectUnlockAttemptGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectUnlockAttemptGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectUnlockAttemptGroupByOutputType[P]>;
}>>;
export type ProjectUnlockAttemptWhereInput = {
    AND?: Prisma.ProjectUnlockAttemptWhereInput | Prisma.ProjectUnlockAttemptWhereInput[];
    OR?: Prisma.ProjectUnlockAttemptWhereInput[];
    NOT?: Prisma.ProjectUnlockAttemptWhereInput | Prisma.ProjectUnlockAttemptWhereInput[];
    id?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    projectId?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    userId?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    failedCount?: Prisma.IntFilter<"ProjectUnlockAttempt"> | number;
    lockedUntil?: Prisma.DateTimeNullableFilter<"ProjectUnlockAttempt"> | Date | string | null;
    lastFailAt?: Prisma.DateTimeNullableFilter<"ProjectUnlockAttempt"> | Date | string | null;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ProjectUnlockAttemptOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    failedCount?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastFailAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ProjectUnlockAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    projectId_userId?: Prisma.ProjectUnlockAttemptProjectIdUserIdCompoundUniqueInput;
    AND?: Prisma.ProjectUnlockAttemptWhereInput | Prisma.ProjectUnlockAttemptWhereInput[];
    OR?: Prisma.ProjectUnlockAttemptWhereInput[];
    NOT?: Prisma.ProjectUnlockAttemptWhereInput | Prisma.ProjectUnlockAttemptWhereInput[];
    projectId?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    userId?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    failedCount?: Prisma.IntFilter<"ProjectUnlockAttempt"> | number;
    lockedUntil?: Prisma.DateTimeNullableFilter<"ProjectUnlockAttempt"> | Date | string | null;
    lastFailAt?: Prisma.DateTimeNullableFilter<"ProjectUnlockAttempt"> | Date | string | null;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "projectId_userId">;
export type ProjectUnlockAttemptOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    failedCount?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastFailAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ProjectUnlockAttemptCountOrderByAggregateInput;
    _avg?: Prisma.ProjectUnlockAttemptAvgOrderByAggregateInput;
    _max?: Prisma.ProjectUnlockAttemptMaxOrderByAggregateInput;
    _min?: Prisma.ProjectUnlockAttemptMinOrderByAggregateInput;
    _sum?: Prisma.ProjectUnlockAttemptSumOrderByAggregateInput;
};
export type ProjectUnlockAttemptScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectUnlockAttemptScalarWhereWithAggregatesInput | Prisma.ProjectUnlockAttemptScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectUnlockAttemptScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectUnlockAttemptScalarWhereWithAggregatesInput | Prisma.ProjectUnlockAttemptScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProjectUnlockAttempt"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"ProjectUnlockAttempt"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ProjectUnlockAttempt"> | string;
    failedCount?: Prisma.IntWithAggregatesFilter<"ProjectUnlockAttempt"> | number;
    lockedUntil?: Prisma.DateTimeNullableWithAggregatesFilter<"ProjectUnlockAttempt"> | Date | string | null;
    lastFailAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ProjectUnlockAttempt"> | Date | string | null;
};
export type ProjectUnlockAttemptCreateInput = {
    id?: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
    project: Prisma.ProjectCreateNestedOneWithoutUnlockAttemptsInput;
    user: Prisma.UserCreateNestedOneWithoutProjectUnlockAttemptsInput;
};
export type ProjectUnlockAttemptUncheckedCreateInput = {
    id?: string;
    projectId: string;
    userId: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
};
export type ProjectUnlockAttemptUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneRequiredWithoutUnlockAttemptsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectUnlockAttemptsNestedInput;
};
export type ProjectUnlockAttemptUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProjectUnlockAttemptCreateManyInput = {
    id?: string;
    projectId: string;
    userId: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
};
export type ProjectUnlockAttemptUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProjectUnlockAttemptUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProjectUnlockAttemptListRelationFilter = {
    every?: Prisma.ProjectUnlockAttemptWhereInput;
    some?: Prisma.ProjectUnlockAttemptWhereInput;
    none?: Prisma.ProjectUnlockAttemptWhereInput;
};
export type ProjectUnlockAttemptOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectUnlockAttemptProjectIdUserIdCompoundUniqueInput = {
    projectId: string;
    userId: string;
};
export type ProjectUnlockAttemptCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    failedCount?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrder;
    lastFailAt?: Prisma.SortOrder;
};
export type ProjectUnlockAttemptAvgOrderByAggregateInput = {
    failedCount?: Prisma.SortOrder;
};
export type ProjectUnlockAttemptMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    failedCount?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrder;
    lastFailAt?: Prisma.SortOrder;
};
export type ProjectUnlockAttemptMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    failedCount?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrder;
    lastFailAt?: Prisma.SortOrder;
};
export type ProjectUnlockAttemptSumOrderByAggregateInput = {
    failedCount?: Prisma.SortOrder;
};
export type ProjectUnlockAttemptCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockAttemptCreateWithoutUserInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
};
export type ProjectUnlockAttemptUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockAttemptCreateWithoutUserInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
};
export type ProjectUnlockAttemptUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockAttemptCreateWithoutUserInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyUserInputEnvelope;
    set?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    update?: Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutUserInput | Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectUnlockAttemptScalarWhereInput | Prisma.ProjectUnlockAttemptScalarWhereInput[];
};
export type ProjectUnlockAttemptUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockAttemptCreateWithoutUserInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyUserInputEnvelope;
    set?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    update?: Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutUserInput | Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectUnlockAttemptScalarWhereInput | Prisma.ProjectUnlockAttemptScalarWhereInput[];
};
export type ProjectUnlockAttemptCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockAttemptCreateWithoutProjectInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
};
export type ProjectUnlockAttemptUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockAttemptCreateWithoutProjectInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
};
export type ProjectUnlockAttemptUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockAttemptCreateWithoutProjectInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    update?: Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectUnlockAttemptScalarWhereInput | Prisma.ProjectUnlockAttemptScalarWhereInput[];
};
export type ProjectUnlockAttemptUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockAttemptCreateWithoutProjectInput[] | Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockAttemptCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockAttemptUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockAttemptCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockAttemptWhereUniqueInput | Prisma.ProjectUnlockAttemptWhereUniqueInput[];
    update?: Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockAttemptUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectUnlockAttemptUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectUnlockAttemptScalarWhereInput | Prisma.ProjectUnlockAttemptScalarWhereInput[];
};
export type ProjectUnlockAttemptCreateWithoutUserInput = {
    id?: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
    project: Prisma.ProjectCreateNestedOneWithoutUnlockAttemptsInput;
};
export type ProjectUnlockAttemptUncheckedCreateWithoutUserInput = {
    id?: string;
    projectId: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
};
export type ProjectUnlockAttemptCreateOrConnectWithoutUserInput = {
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput>;
};
export type ProjectUnlockAttemptCreateManyUserInputEnvelope = {
    data: Prisma.ProjectUnlockAttemptCreateManyUserInput | Prisma.ProjectUnlockAttemptCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ProjectUnlockAttemptUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutUserInput>;
};
export type ProjectUnlockAttemptUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateWithoutUserInput, Prisma.ProjectUnlockAttemptUncheckedUpdateWithoutUserInput>;
};
export type ProjectUnlockAttemptUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ProjectUnlockAttemptScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateManyMutationInput, Prisma.ProjectUnlockAttemptUncheckedUpdateManyWithoutUserInput>;
};
export type ProjectUnlockAttemptScalarWhereInput = {
    AND?: Prisma.ProjectUnlockAttemptScalarWhereInput | Prisma.ProjectUnlockAttemptScalarWhereInput[];
    OR?: Prisma.ProjectUnlockAttemptScalarWhereInput[];
    NOT?: Prisma.ProjectUnlockAttemptScalarWhereInput | Prisma.ProjectUnlockAttemptScalarWhereInput[];
    id?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    projectId?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    userId?: Prisma.StringFilter<"ProjectUnlockAttempt"> | string;
    failedCount?: Prisma.IntFilter<"ProjectUnlockAttempt"> | number;
    lockedUntil?: Prisma.DateTimeNullableFilter<"ProjectUnlockAttempt"> | Date | string | null;
    lastFailAt?: Prisma.DateTimeNullableFilter<"ProjectUnlockAttempt"> | Date | string | null;
};
export type ProjectUnlockAttemptCreateWithoutProjectInput = {
    id?: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutProjectUnlockAttemptsInput;
};
export type ProjectUnlockAttemptUncheckedCreateWithoutProjectInput = {
    id?: string;
    userId: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
};
export type ProjectUnlockAttemptCreateOrConnectWithoutProjectInput = {
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput>;
};
export type ProjectUnlockAttemptCreateManyProjectInputEnvelope = {
    data: Prisma.ProjectUnlockAttemptCreateManyProjectInput | Prisma.ProjectUnlockAttemptCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ProjectUnlockAttemptUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedCreateWithoutProjectInput>;
};
export type ProjectUnlockAttemptUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateWithoutProjectInput, Prisma.ProjectUnlockAttemptUncheckedUpdateWithoutProjectInput>;
};
export type ProjectUnlockAttemptUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ProjectUnlockAttemptScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateManyMutationInput, Prisma.ProjectUnlockAttemptUncheckedUpdateManyWithoutProjectInput>;
};
export type ProjectUnlockAttemptCreateManyUserInput = {
    id?: string;
    projectId: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
};
export type ProjectUnlockAttemptUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneRequiredWithoutUnlockAttemptsNestedInput;
};
export type ProjectUnlockAttemptUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProjectUnlockAttemptUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProjectUnlockAttemptCreateManyProjectInput = {
    id?: string;
    userId: string;
    failedCount?: number;
    lockedUntil?: Date | string | null;
    lastFailAt?: Date | string | null;
};
export type ProjectUnlockAttemptUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectUnlockAttemptsNestedInput;
};
export type ProjectUnlockAttemptUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProjectUnlockAttemptUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    failedCount?: Prisma.IntFieldUpdateOperationsInput | number;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastFailAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProjectUnlockAttemptSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    failedCount?: boolean;
    lockedUntil?: boolean;
    lastFailAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectUnlockAttempt"]>;
export type ProjectUnlockAttemptSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    failedCount?: boolean;
    lockedUntil?: boolean;
    lastFailAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectUnlockAttempt"]>;
export type ProjectUnlockAttemptSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    failedCount?: boolean;
    lockedUntil?: boolean;
    lastFailAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectUnlockAttempt"]>;
export type ProjectUnlockAttemptSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    failedCount?: boolean;
    lockedUntil?: boolean;
    lastFailAt?: boolean;
};
export type ProjectUnlockAttemptOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "userId" | "failedCount" | "lockedUntil" | "lastFailAt", ExtArgs["result"]["projectUnlockAttempt"]>;
export type ProjectUnlockAttemptInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ProjectUnlockAttemptIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ProjectUnlockAttemptIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ProjectUnlockAttemptPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProjectUnlockAttempt";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        userId: string;
        failedCount: number;
        lockedUntil: Date | null;
        lastFailAt: Date | null;
    }, ExtArgs["result"]["projectUnlockAttempt"]>;
    composites: {};
};
export type ProjectUnlockAttemptGetPayload<S extends boolean | null | undefined | ProjectUnlockAttemptDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload, S>;
export type ProjectUnlockAttemptCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectUnlockAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectUnlockAttemptCountAggregateInputType | true;
};
export interface ProjectUnlockAttemptDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProjectUnlockAttempt'];
        meta: {
            name: 'ProjectUnlockAttempt';
        };
    };
    findUnique<T extends ProjectUnlockAttemptFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProjectUnlockAttemptFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProjectUnlockAttemptFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockAttemptFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProjectUnlockAttemptFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProjectUnlockAttemptFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProjectUnlockAttemptCreateArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProjectUnlockAttemptCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProjectUnlockAttemptCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProjectUnlockAttemptDeleteArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProjectUnlockAttemptUpdateArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProjectUnlockAttemptDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProjectUnlockAttemptUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProjectUnlockAttemptUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProjectUnlockAttemptUpsertArgs>(args: Prisma.SelectSubset<T, ProjectUnlockAttemptUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockAttemptClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProjectUnlockAttemptCountArgs>(args?: Prisma.Subset<T, ProjectUnlockAttemptCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectUnlockAttemptCountAggregateOutputType> : number>;
    aggregate<T extends ProjectUnlockAttemptAggregateArgs>(args: Prisma.Subset<T, ProjectUnlockAttemptAggregateArgs>): Prisma.PrismaPromise<GetProjectUnlockAttemptAggregateType<T>>;
    groupBy<T extends ProjectUnlockAttemptGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectUnlockAttemptGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectUnlockAttemptGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectUnlockAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectUnlockAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProjectUnlockAttemptFieldRefs;
}
export interface Prisma__ProjectUnlockAttemptClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProjectUnlockAttemptFieldRefs {
    readonly id: Prisma.FieldRef<"ProjectUnlockAttempt", 'String'>;
    readonly projectId: Prisma.FieldRef<"ProjectUnlockAttempt", 'String'>;
    readonly userId: Prisma.FieldRef<"ProjectUnlockAttempt", 'String'>;
    readonly failedCount: Prisma.FieldRef<"ProjectUnlockAttempt", 'Int'>;
    readonly lockedUntil: Prisma.FieldRef<"ProjectUnlockAttempt", 'DateTime'>;
    readonly lastFailAt: Prisma.FieldRef<"ProjectUnlockAttempt", 'DateTime'>;
}
export type ProjectUnlockAttemptFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
};
export type ProjectUnlockAttemptFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
};
export type ProjectUnlockAttemptFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    orderBy?: Prisma.ProjectUnlockAttemptOrderByWithRelationInput | Prisma.ProjectUnlockAttemptOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectUnlockAttemptScalarFieldEnum | Prisma.ProjectUnlockAttemptScalarFieldEnum[];
};
export type ProjectUnlockAttemptFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    orderBy?: Prisma.ProjectUnlockAttemptOrderByWithRelationInput | Prisma.ProjectUnlockAttemptOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectUnlockAttemptScalarFieldEnum | Prisma.ProjectUnlockAttemptScalarFieldEnum[];
};
export type ProjectUnlockAttemptFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    orderBy?: Prisma.ProjectUnlockAttemptOrderByWithRelationInput | Prisma.ProjectUnlockAttemptOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectUnlockAttemptScalarFieldEnum | Prisma.ProjectUnlockAttemptScalarFieldEnum[];
};
export type ProjectUnlockAttemptCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateInput, Prisma.ProjectUnlockAttemptUncheckedCreateInput>;
};
export type ProjectUnlockAttemptCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProjectUnlockAttemptCreateManyInput | Prisma.ProjectUnlockAttemptCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProjectUnlockAttemptCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    data: Prisma.ProjectUnlockAttemptCreateManyInput | Prisma.ProjectUnlockAttemptCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProjectUnlockAttemptIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProjectUnlockAttemptUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateInput, Prisma.ProjectUnlockAttemptUncheckedUpdateInput>;
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
};
export type ProjectUnlockAttemptUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateManyMutationInput, Prisma.ProjectUnlockAttemptUncheckedUpdateManyInput>;
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    limit?: number;
};
export type ProjectUnlockAttemptUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateManyMutationInput, Prisma.ProjectUnlockAttemptUncheckedUpdateManyInput>;
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    limit?: number;
    include?: Prisma.ProjectUnlockAttemptIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProjectUnlockAttemptUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectUnlockAttemptCreateInput, Prisma.ProjectUnlockAttemptUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProjectUnlockAttemptUpdateInput, Prisma.ProjectUnlockAttemptUncheckedUpdateInput>;
};
export type ProjectUnlockAttemptDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockAttemptWhereUniqueInput;
};
export type ProjectUnlockAttemptDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectUnlockAttemptWhereInput;
    limit?: number;
};
export type ProjectUnlockAttemptDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockAttemptSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockAttemptOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockAttemptInclude<ExtArgs> | null;
};
