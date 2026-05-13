import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ProjectUnlockSessionModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectUnlockSessionPayload>;
export type AggregateProjectUnlockSession = {
    _count: ProjectUnlockSessionCountAggregateOutputType | null;
    _min: ProjectUnlockSessionMinAggregateOutputType | null;
    _max: ProjectUnlockSessionMaxAggregateOutputType | null;
};
export type ProjectUnlockSessionMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type ProjectUnlockSessionMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    userId: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type ProjectUnlockSessionCountAggregateOutputType = {
    id: number;
    projectId: number;
    userId: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type ProjectUnlockSessionMinAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type ProjectUnlockSessionMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type ProjectUnlockSessionCountAggregateInputType = {
    id?: true;
    projectId?: true;
    userId?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ProjectUnlockSessionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectUnlockSessionWhereInput;
    orderBy?: Prisma.ProjectUnlockSessionOrderByWithRelationInput | Prisma.ProjectUnlockSessionOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProjectUnlockSessionCountAggregateInputType;
    _min?: ProjectUnlockSessionMinAggregateInputType;
    _max?: ProjectUnlockSessionMaxAggregateInputType;
};
export type GetProjectUnlockSessionAggregateType<T extends ProjectUnlockSessionAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectUnlockSession]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProjectUnlockSession[P]> : Prisma.GetScalarType<T[P], AggregateProjectUnlockSession[P]>;
};
export type ProjectUnlockSessionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectUnlockSessionWhereInput;
    orderBy?: Prisma.ProjectUnlockSessionOrderByWithAggregationInput | Prisma.ProjectUnlockSessionOrderByWithAggregationInput[];
    by: Prisma.ProjectUnlockSessionScalarFieldEnum[] | Prisma.ProjectUnlockSessionScalarFieldEnum;
    having?: Prisma.ProjectUnlockSessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectUnlockSessionCountAggregateInputType | true;
    _min?: ProjectUnlockSessionMinAggregateInputType;
    _max?: ProjectUnlockSessionMaxAggregateInputType;
};
export type ProjectUnlockSessionGroupByOutputType = {
    id: string;
    projectId: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    _count: ProjectUnlockSessionCountAggregateOutputType | null;
    _min: ProjectUnlockSessionMinAggregateOutputType | null;
    _max: ProjectUnlockSessionMaxAggregateOutputType | null;
};
export type GetProjectUnlockSessionGroupByPayload<T extends ProjectUnlockSessionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectUnlockSessionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectUnlockSessionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectUnlockSessionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectUnlockSessionGroupByOutputType[P]>;
}>>;
export type ProjectUnlockSessionWhereInput = {
    AND?: Prisma.ProjectUnlockSessionWhereInput | Prisma.ProjectUnlockSessionWhereInput[];
    OR?: Prisma.ProjectUnlockSessionWhereInput[];
    NOT?: Prisma.ProjectUnlockSessionWhereInput | Prisma.ProjectUnlockSessionWhereInput[];
    id?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    projectId?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    userId?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    expiresAt?: Prisma.DateTimeFilter<"ProjectUnlockSession"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectUnlockSession"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ProjectUnlockSessionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ProjectUnlockSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    projectId_userId?: Prisma.ProjectUnlockSessionProjectIdUserIdCompoundUniqueInput;
    AND?: Prisma.ProjectUnlockSessionWhereInput | Prisma.ProjectUnlockSessionWhereInput[];
    OR?: Prisma.ProjectUnlockSessionWhereInput[];
    NOT?: Prisma.ProjectUnlockSessionWhereInput | Prisma.ProjectUnlockSessionWhereInput[];
    projectId?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    userId?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    expiresAt?: Prisma.DateTimeFilter<"ProjectUnlockSession"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectUnlockSession"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "projectId_userId">;
export type ProjectUnlockSessionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProjectUnlockSessionCountOrderByAggregateInput;
    _max?: Prisma.ProjectUnlockSessionMaxOrderByAggregateInput;
    _min?: Prisma.ProjectUnlockSessionMinOrderByAggregateInput;
};
export type ProjectUnlockSessionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectUnlockSessionScalarWhereWithAggregatesInput | Prisma.ProjectUnlockSessionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectUnlockSessionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectUnlockSessionScalarWhereWithAggregatesInput | Prisma.ProjectUnlockSessionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProjectUnlockSession"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"ProjectUnlockSession"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ProjectUnlockSession"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"ProjectUnlockSession"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProjectUnlockSession"> | Date | string;
};
export type ProjectUnlockSessionCreateInput = {
    id?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutUnlockSessionsInput;
    user: Prisma.UserCreateNestedOneWithoutProjectUnlockSessionsInput;
};
export type ProjectUnlockSessionUncheckedCreateInput = {
    id?: string;
    projectId: string;
    userId: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type ProjectUnlockSessionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutUnlockSessionsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectUnlockSessionsNestedInput;
};
export type ProjectUnlockSessionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUnlockSessionCreateManyInput = {
    id?: string;
    projectId: string;
    userId: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type ProjectUnlockSessionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUnlockSessionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUnlockSessionListRelationFilter = {
    every?: Prisma.ProjectUnlockSessionWhereInput;
    some?: Prisma.ProjectUnlockSessionWhereInput;
    none?: Prisma.ProjectUnlockSessionWhereInput;
};
export type ProjectUnlockSessionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectUnlockSessionProjectIdUserIdCompoundUniqueInput = {
    projectId: string;
    userId: string;
};
export type ProjectUnlockSessionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectUnlockSessionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectUnlockSessionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectUnlockSessionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockSessionCreateWithoutUserInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
};
export type ProjectUnlockSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockSessionCreateWithoutUserInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
};
export type ProjectUnlockSessionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockSessionCreateWithoutUserInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyUserInputEnvelope;
    set?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    update?: Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutUserInput | Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectUnlockSessionScalarWhereInput | Prisma.ProjectUnlockSessionScalarWhereInput[];
};
export type ProjectUnlockSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput> | Prisma.ProjectUnlockSessionCreateWithoutUserInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyUserInputEnvelope;
    set?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    update?: Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutUserInput | Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectUnlockSessionScalarWhereInput | Prisma.ProjectUnlockSessionScalarWhereInput[];
};
export type ProjectUnlockSessionCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockSessionCreateWithoutProjectInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
};
export type ProjectUnlockSessionUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockSessionCreateWithoutProjectInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
};
export type ProjectUnlockSessionUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockSessionCreateWithoutProjectInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    update?: Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectUnlockSessionScalarWhereInput | Prisma.ProjectUnlockSessionScalarWhereInput[];
};
export type ProjectUnlockSessionUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput> | Prisma.ProjectUnlockSessionCreateWithoutProjectInput[] | Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput | Prisma.ProjectUnlockSessionCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockSessionUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectUnlockSessionCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    disconnect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    delete?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    connect?: Prisma.ProjectUnlockSessionWhereUniqueInput | Prisma.ProjectUnlockSessionWhereUniqueInput[];
    update?: Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectUnlockSessionUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectUnlockSessionUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectUnlockSessionScalarWhereInput | Prisma.ProjectUnlockSessionScalarWhereInput[];
};
export type ProjectUnlockSessionCreateWithoutUserInput = {
    id?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutUnlockSessionsInput;
};
export type ProjectUnlockSessionUncheckedCreateWithoutUserInput = {
    id?: string;
    projectId: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type ProjectUnlockSessionCreateOrConnectWithoutUserInput = {
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput>;
};
export type ProjectUnlockSessionCreateManyUserInputEnvelope = {
    data: Prisma.ProjectUnlockSessionCreateManyUserInput | Prisma.ProjectUnlockSessionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ProjectUnlockSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutUserInput>;
};
export type ProjectUnlockSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateWithoutUserInput, Prisma.ProjectUnlockSessionUncheckedUpdateWithoutUserInput>;
};
export type ProjectUnlockSessionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ProjectUnlockSessionScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateManyMutationInput, Prisma.ProjectUnlockSessionUncheckedUpdateManyWithoutUserInput>;
};
export type ProjectUnlockSessionScalarWhereInput = {
    AND?: Prisma.ProjectUnlockSessionScalarWhereInput | Prisma.ProjectUnlockSessionScalarWhereInput[];
    OR?: Prisma.ProjectUnlockSessionScalarWhereInput[];
    NOT?: Prisma.ProjectUnlockSessionScalarWhereInput | Prisma.ProjectUnlockSessionScalarWhereInput[];
    id?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    projectId?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    userId?: Prisma.StringFilter<"ProjectUnlockSession"> | string;
    expiresAt?: Prisma.DateTimeFilter<"ProjectUnlockSession"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectUnlockSession"> | Date | string;
};
export type ProjectUnlockSessionCreateWithoutProjectInput = {
    id?: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutProjectUnlockSessionsInput;
};
export type ProjectUnlockSessionUncheckedCreateWithoutProjectInput = {
    id?: string;
    userId: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type ProjectUnlockSessionCreateOrConnectWithoutProjectInput = {
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput>;
};
export type ProjectUnlockSessionCreateManyProjectInputEnvelope = {
    data: Prisma.ProjectUnlockSessionCreateManyProjectInput | Prisma.ProjectUnlockSessionCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ProjectUnlockSessionUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ProjectUnlockSessionCreateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedCreateWithoutProjectInput>;
};
export type ProjectUnlockSessionUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateWithoutProjectInput, Prisma.ProjectUnlockSessionUncheckedUpdateWithoutProjectInput>;
};
export type ProjectUnlockSessionUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ProjectUnlockSessionScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateManyMutationInput, Prisma.ProjectUnlockSessionUncheckedUpdateManyWithoutProjectInput>;
};
export type ProjectUnlockSessionCreateManyUserInput = {
    id?: string;
    projectId: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type ProjectUnlockSessionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutUnlockSessionsNestedInput;
};
export type ProjectUnlockSessionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUnlockSessionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUnlockSessionCreateManyProjectInput = {
    id?: string;
    userId: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type ProjectUnlockSessionUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectUnlockSessionsNestedInput;
};
export type ProjectUnlockSessionUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUnlockSessionUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectUnlockSessionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectUnlockSession"]>;
export type ProjectUnlockSessionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectUnlockSession"]>;
export type ProjectUnlockSessionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectUnlockSession"]>;
export type ProjectUnlockSessionSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    userId?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type ProjectUnlockSessionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "userId" | "expiresAt" | "createdAt", ExtArgs["result"]["projectUnlockSession"]>;
export type ProjectUnlockSessionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ProjectUnlockSessionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ProjectUnlockSessionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ProjectUnlockSessionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProjectUnlockSession";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["projectUnlockSession"]>;
    composites: {};
};
export type ProjectUnlockSessionGetPayload<S extends boolean | null | undefined | ProjectUnlockSessionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload, S>;
export type ProjectUnlockSessionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectUnlockSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectUnlockSessionCountAggregateInputType | true;
};
export interface ProjectUnlockSessionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProjectUnlockSession'];
        meta: {
            name: 'ProjectUnlockSession';
        };
    };
    findUnique<T extends ProjectUnlockSessionFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProjectUnlockSessionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProjectUnlockSessionFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockSessionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProjectUnlockSessionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProjectUnlockSessionFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProjectUnlockSessionCreateArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProjectUnlockSessionCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProjectUnlockSessionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProjectUnlockSessionDeleteArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProjectUnlockSessionUpdateArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProjectUnlockSessionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectUnlockSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProjectUnlockSessionUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProjectUnlockSessionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProjectUnlockSessionUpsertArgs>(args: Prisma.SelectSubset<T, ProjectUnlockSessionUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectUnlockSessionClient<runtime.Types.Result.GetResult<Prisma.$ProjectUnlockSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProjectUnlockSessionCountArgs>(args?: Prisma.Subset<T, ProjectUnlockSessionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectUnlockSessionCountAggregateOutputType> : number>;
    aggregate<T extends ProjectUnlockSessionAggregateArgs>(args: Prisma.Subset<T, ProjectUnlockSessionAggregateArgs>): Prisma.PrismaPromise<GetProjectUnlockSessionAggregateType<T>>;
    groupBy<T extends ProjectUnlockSessionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectUnlockSessionGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectUnlockSessionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectUnlockSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectUnlockSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProjectUnlockSessionFieldRefs;
}
export interface Prisma__ProjectUnlockSessionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProjectUnlockSessionFieldRefs {
    readonly id: Prisma.FieldRef<"ProjectUnlockSession", 'String'>;
    readonly projectId: Prisma.FieldRef<"ProjectUnlockSession", 'String'>;
    readonly userId: Prisma.FieldRef<"ProjectUnlockSession", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"ProjectUnlockSession", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ProjectUnlockSession", 'DateTime'>;
}
export type ProjectUnlockSessionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
};
export type ProjectUnlockSessionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
};
export type ProjectUnlockSessionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    where?: Prisma.ProjectUnlockSessionWhereInput;
    orderBy?: Prisma.ProjectUnlockSessionOrderByWithRelationInput | Prisma.ProjectUnlockSessionOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectUnlockSessionScalarFieldEnum | Prisma.ProjectUnlockSessionScalarFieldEnum[];
};
export type ProjectUnlockSessionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    where?: Prisma.ProjectUnlockSessionWhereInput;
    orderBy?: Prisma.ProjectUnlockSessionOrderByWithRelationInput | Prisma.ProjectUnlockSessionOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectUnlockSessionScalarFieldEnum | Prisma.ProjectUnlockSessionScalarFieldEnum[];
};
export type ProjectUnlockSessionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    where?: Prisma.ProjectUnlockSessionWhereInput;
    orderBy?: Prisma.ProjectUnlockSessionOrderByWithRelationInput | Prisma.ProjectUnlockSessionOrderByWithRelationInput[];
    cursor?: Prisma.ProjectUnlockSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectUnlockSessionScalarFieldEnum | Prisma.ProjectUnlockSessionScalarFieldEnum[];
};
export type ProjectUnlockSessionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUnlockSessionCreateInput, Prisma.ProjectUnlockSessionUncheckedCreateInput>;
};
export type ProjectUnlockSessionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProjectUnlockSessionCreateManyInput | Prisma.ProjectUnlockSessionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProjectUnlockSessionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    data: Prisma.ProjectUnlockSessionCreateManyInput | Prisma.ProjectUnlockSessionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProjectUnlockSessionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProjectUnlockSessionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateInput, Prisma.ProjectUnlockSessionUncheckedUpdateInput>;
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
};
export type ProjectUnlockSessionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateManyMutationInput, Prisma.ProjectUnlockSessionUncheckedUpdateManyInput>;
    where?: Prisma.ProjectUnlockSessionWhereInput;
    limit?: number;
};
export type ProjectUnlockSessionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateManyMutationInput, Prisma.ProjectUnlockSessionUncheckedUpdateManyInput>;
    where?: Prisma.ProjectUnlockSessionWhereInput;
    limit?: number;
    include?: Prisma.ProjectUnlockSessionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProjectUnlockSessionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectUnlockSessionCreateInput, Prisma.ProjectUnlockSessionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProjectUnlockSessionUpdateInput, Prisma.ProjectUnlockSessionUncheckedUpdateInput>;
};
export type ProjectUnlockSessionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
    where: Prisma.ProjectUnlockSessionWhereUniqueInput;
};
export type ProjectUnlockSessionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectUnlockSessionWhereInput;
    limit?: number;
};
export type ProjectUnlockSessionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectUnlockSessionSelect<ExtArgs> | null;
    omit?: Prisma.ProjectUnlockSessionOmit<ExtArgs> | null;
    include?: Prisma.ProjectUnlockSessionInclude<ExtArgs> | null;
};
