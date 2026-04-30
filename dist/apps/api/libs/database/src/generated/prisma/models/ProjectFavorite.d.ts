import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ProjectFavoriteModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectFavoritePayload>;
export type AggregateProjectFavorite = {
    _count: ProjectFavoriteCountAggregateOutputType | null;
    _min: ProjectFavoriteMinAggregateOutputType | null;
    _max: ProjectFavoriteMaxAggregateOutputType | null;
};
export type ProjectFavoriteMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    workspaceId: string | null;
    projectId: string | null;
    createdAt: Date | null;
};
export type ProjectFavoriteMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    workspaceId: string | null;
    projectId: string | null;
    createdAt: Date | null;
};
export type ProjectFavoriteCountAggregateOutputType = {
    id: number;
    userId: number;
    workspaceId: number;
    projectId: number;
    createdAt: number;
    _all: number;
};
export type ProjectFavoriteMinAggregateInputType = {
    id?: true;
    userId?: true;
    workspaceId?: true;
    projectId?: true;
    createdAt?: true;
};
export type ProjectFavoriteMaxAggregateInputType = {
    id?: true;
    userId?: true;
    workspaceId?: true;
    projectId?: true;
    createdAt?: true;
};
export type ProjectFavoriteCountAggregateInputType = {
    id?: true;
    userId?: true;
    workspaceId?: true;
    projectId?: true;
    createdAt?: true;
    _all?: true;
};
export type ProjectFavoriteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectFavoriteWhereInput;
    orderBy?: Prisma.ProjectFavoriteOrderByWithRelationInput | Prisma.ProjectFavoriteOrderByWithRelationInput[];
    cursor?: Prisma.ProjectFavoriteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProjectFavoriteCountAggregateInputType;
    _min?: ProjectFavoriteMinAggregateInputType;
    _max?: ProjectFavoriteMaxAggregateInputType;
};
export type GetProjectFavoriteAggregateType<T extends ProjectFavoriteAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectFavorite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProjectFavorite[P]> : Prisma.GetScalarType<T[P], AggregateProjectFavorite[P]>;
};
export type ProjectFavoriteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectFavoriteWhereInput;
    orderBy?: Prisma.ProjectFavoriteOrderByWithAggregationInput | Prisma.ProjectFavoriteOrderByWithAggregationInput[];
    by: Prisma.ProjectFavoriteScalarFieldEnum[] | Prisma.ProjectFavoriteScalarFieldEnum;
    having?: Prisma.ProjectFavoriteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectFavoriteCountAggregateInputType | true;
    _min?: ProjectFavoriteMinAggregateInputType;
    _max?: ProjectFavoriteMaxAggregateInputType;
};
export type ProjectFavoriteGroupByOutputType = {
    id: string;
    userId: string;
    workspaceId: string;
    projectId: string;
    createdAt: Date;
    _count: ProjectFavoriteCountAggregateOutputType | null;
    _min: ProjectFavoriteMinAggregateOutputType | null;
    _max: ProjectFavoriteMaxAggregateOutputType | null;
};
export type GetProjectFavoriteGroupByPayload<T extends ProjectFavoriteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectFavoriteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectFavoriteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectFavoriteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectFavoriteGroupByOutputType[P]>;
}>>;
export type ProjectFavoriteWhereInput = {
    AND?: Prisma.ProjectFavoriteWhereInput | Prisma.ProjectFavoriteWhereInput[];
    OR?: Prisma.ProjectFavoriteWhereInput[];
    NOT?: Prisma.ProjectFavoriteWhereInput | Prisma.ProjectFavoriteWhereInput[];
    id?: Prisma.StringFilter<"ProjectFavorite"> | string;
    userId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    workspaceId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    projectId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectFavorite"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
};
export type ProjectFavoriteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    project?: Prisma.ProjectOrderByWithRelationInput;
};
export type ProjectFavoriteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_projectId?: Prisma.ProjectFavoriteUserIdProjectIdCompoundUniqueInput;
    AND?: Prisma.ProjectFavoriteWhereInput | Prisma.ProjectFavoriteWhereInput[];
    OR?: Prisma.ProjectFavoriteWhereInput[];
    NOT?: Prisma.ProjectFavoriteWhereInput | Prisma.ProjectFavoriteWhereInput[];
    userId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    workspaceId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    projectId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectFavorite"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
}, "id" | "userId_projectId">;
export type ProjectFavoriteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProjectFavoriteCountOrderByAggregateInput;
    _max?: Prisma.ProjectFavoriteMaxOrderByAggregateInput;
    _min?: Prisma.ProjectFavoriteMinOrderByAggregateInput;
};
export type ProjectFavoriteScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectFavoriteScalarWhereWithAggregatesInput | Prisma.ProjectFavoriteScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectFavoriteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectFavoriteScalarWhereWithAggregatesInput | Prisma.ProjectFavoriteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProjectFavorite"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"ProjectFavorite"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"ProjectFavorite"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"ProjectFavorite"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProjectFavorite"> | Date | string;
};
export type ProjectFavoriteCreateInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutProjectFavoritesInput;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutProjectFavoritesInput;
    project: Prisma.ProjectCreateNestedOneWithoutFavoritesInput;
};
export type ProjectFavoriteUncheckedCreateInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    projectId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectFavoritesNestedInput;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutProjectFavoritesNestedInput;
    project?: Prisma.ProjectUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type ProjectFavoriteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteCreateManyInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    projectId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteListRelationFilter = {
    every?: Prisma.ProjectFavoriteWhereInput;
    some?: Prisma.ProjectFavoriteWhereInput;
    none?: Prisma.ProjectFavoriteWhereInput;
};
export type ProjectFavoriteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectFavoriteUserIdProjectIdCompoundUniqueInput = {
    userId: string;
    projectId: string;
};
export type ProjectFavoriteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectFavoriteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectFavoriteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectFavoriteCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutUserInput, Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput> | Prisma.ProjectFavoriteCreateWithoutUserInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput | Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
};
export type ProjectFavoriteUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutUserInput, Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput> | Prisma.ProjectFavoriteCreateWithoutUserInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput | Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyUserInputEnvelope;
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
};
export type ProjectFavoriteUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutUserInput, Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput> | Prisma.ProjectFavoriteCreateWithoutUserInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput | Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyUserInputEnvelope;
    set?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    disconnect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    delete?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    update?: Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectFavoriteUpdateManyWithWhereWithoutUserInput | Prisma.ProjectFavoriteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
};
export type ProjectFavoriteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutUserInput, Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput> | Prisma.ProjectFavoriteCreateWithoutUserInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput | Prisma.ProjectFavoriteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutUserInput | Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyUserInputEnvelope;
    set?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    disconnect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    delete?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    update?: Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutUserInput | Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ProjectFavoriteUpdateManyWithWhereWithoutUserInput | Prisma.ProjectFavoriteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
};
export type ProjectFavoriteCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.ProjectFavoriteCreateWithoutWorkspaceInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
};
export type ProjectFavoriteUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.ProjectFavoriteCreateWithoutWorkspaceInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
};
export type ProjectFavoriteUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.ProjectFavoriteCreateWithoutWorkspaceInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyWorkspaceInputEnvelope;
    set?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    disconnect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    delete?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    update?: Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.ProjectFavoriteUpdateManyWithWhereWithoutWorkspaceInput | Prisma.ProjectFavoriteUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
};
export type ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput> | Prisma.ProjectFavoriteCreateWithoutWorkspaceInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput | Prisma.ProjectFavoriteCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyWorkspaceInputEnvelope;
    set?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    disconnect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    delete?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    update?: Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.ProjectFavoriteUpdateManyWithWhereWithoutWorkspaceInput | Prisma.ProjectFavoriteUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
};
export type ProjectFavoriteCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput> | Prisma.ProjectFavoriteCreateWithoutProjectInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput | Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
};
export type ProjectFavoriteUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput> | Prisma.ProjectFavoriteCreateWithoutProjectInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput | Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
};
export type ProjectFavoriteUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput> | Prisma.ProjectFavoriteCreateWithoutProjectInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput | Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    disconnect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    delete?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    update?: Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectFavoriteUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectFavoriteUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
};
export type ProjectFavoriteUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput> | Prisma.ProjectFavoriteCreateWithoutProjectInput[] | Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput | Prisma.ProjectFavoriteCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectFavoriteUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectFavoriteCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    disconnect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    delete?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    connect?: Prisma.ProjectFavoriteWhereUniqueInput | Prisma.ProjectFavoriteWhereUniqueInput[];
    update?: Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectFavoriteUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectFavoriteUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectFavoriteUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
};
export type ProjectFavoriteCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutProjectFavoritesInput;
    project: Prisma.ProjectCreateNestedOneWithoutFavoritesInput;
};
export type ProjectFavoriteUncheckedCreateWithoutUserInput = {
    id?: string;
    workspaceId: string;
    projectId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteCreateOrConnectWithoutUserInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutUserInput, Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput>;
};
export type ProjectFavoriteCreateManyUserInputEnvelope = {
    data: Prisma.ProjectFavoriteCreateManyUserInput | Prisma.ProjectFavoriteCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ProjectFavoriteUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectFavoriteUpdateWithoutUserInput, Prisma.ProjectFavoriteUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutUserInput, Prisma.ProjectFavoriteUncheckedCreateWithoutUserInput>;
};
export type ProjectFavoriteUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateWithoutUserInput, Prisma.ProjectFavoriteUncheckedUpdateWithoutUserInput>;
};
export type ProjectFavoriteUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ProjectFavoriteScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateManyMutationInput, Prisma.ProjectFavoriteUncheckedUpdateManyWithoutUserInput>;
};
export type ProjectFavoriteScalarWhereInput = {
    AND?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
    OR?: Prisma.ProjectFavoriteScalarWhereInput[];
    NOT?: Prisma.ProjectFavoriteScalarWhereInput | Prisma.ProjectFavoriteScalarWhereInput[];
    id?: Prisma.StringFilter<"ProjectFavorite"> | string;
    userId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    workspaceId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    projectId?: Prisma.StringFilter<"ProjectFavorite"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProjectFavorite"> | Date | string;
};
export type ProjectFavoriteCreateWithoutWorkspaceInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutProjectFavoritesInput;
    project: Prisma.ProjectCreateNestedOneWithoutFavoritesInput;
};
export type ProjectFavoriteUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    userId: string;
    projectId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput>;
};
export type ProjectFavoriteCreateManyWorkspaceInputEnvelope = {
    data: Prisma.ProjectFavoriteCreateManyWorkspaceInput | Prisma.ProjectFavoriteCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type ProjectFavoriteUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectFavoriteUpdateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedCreateWithoutWorkspaceInput>;
};
export type ProjectFavoriteUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateWithoutWorkspaceInput, Prisma.ProjectFavoriteUncheckedUpdateWithoutWorkspaceInput>;
};
export type ProjectFavoriteUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.ProjectFavoriteScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateManyMutationInput, Prisma.ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type ProjectFavoriteCreateWithoutProjectInput = {
    id?: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutProjectFavoritesInput;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutProjectFavoritesInput;
};
export type ProjectFavoriteUncheckedCreateWithoutProjectInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteCreateOrConnectWithoutProjectInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput>;
};
export type ProjectFavoriteCreateManyProjectInputEnvelope = {
    data: Prisma.ProjectFavoriteCreateManyProjectInput | Prisma.ProjectFavoriteCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ProjectFavoriteUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectFavoriteUpdateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ProjectFavoriteCreateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedCreateWithoutProjectInput>;
};
export type ProjectFavoriteUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateWithoutProjectInput, Prisma.ProjectFavoriteUncheckedUpdateWithoutProjectInput>;
};
export type ProjectFavoriteUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ProjectFavoriteScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateManyMutationInput, Prisma.ProjectFavoriteUncheckedUpdateManyWithoutProjectInput>;
};
export type ProjectFavoriteCreateManyUserInput = {
    id?: string;
    workspaceId: string;
    projectId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutProjectFavoritesNestedInput;
    project?: Prisma.ProjectUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type ProjectFavoriteUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteCreateManyWorkspaceInput = {
    id?: string;
    userId: string;
    projectId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectFavoritesNestedInput;
    project?: Prisma.ProjectUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type ProjectFavoriteUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteCreateManyProjectInput = {
    id?: string;
    userId: string;
    workspaceId: string;
    createdAt?: Date | string;
};
export type ProjectFavoriteUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutProjectFavoritesNestedInput;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutProjectFavoritesNestedInput;
};
export type ProjectFavoriteUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectFavoriteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectFavorite"]>;
export type ProjectFavoriteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectFavorite"]>;
export type ProjectFavoriteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectFavorite"]>;
export type ProjectFavoriteSelectScalar = {
    id?: boolean;
    userId?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    createdAt?: boolean;
};
export type ProjectFavoriteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "workspaceId" | "projectId" | "createdAt", ExtArgs["result"]["projectFavorite"]>;
export type ProjectFavoriteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type ProjectFavoriteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type ProjectFavoriteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type $ProjectFavoritePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProjectFavorite";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        project: Prisma.$ProjectPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        workspaceId: string;
        projectId: string;
        createdAt: Date;
    }, ExtArgs["result"]["projectFavorite"]>;
    composites: {};
};
export type ProjectFavoriteGetPayload<S extends boolean | null | undefined | ProjectFavoriteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload, S>;
export type ProjectFavoriteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectFavoriteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectFavoriteCountAggregateInputType | true;
};
export interface ProjectFavoriteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProjectFavorite'];
        meta: {
            name: 'ProjectFavorite';
        };
    };
    findUnique<T extends ProjectFavoriteFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProjectFavoriteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProjectFavoriteFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectFavoriteFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProjectFavoriteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectFavoriteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProjectFavoriteFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectFavoriteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProjectFavoriteCreateArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProjectFavoriteCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectFavoriteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProjectFavoriteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProjectFavoriteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProjectFavoriteDeleteArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProjectFavoriteUpdateArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProjectFavoriteDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectFavoriteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProjectFavoriteUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProjectFavoriteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProjectFavoriteUpsertArgs>(args: Prisma.SelectSubset<T, ProjectFavoriteUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectFavoriteClient<runtime.Types.Result.GetResult<Prisma.$ProjectFavoritePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProjectFavoriteCountArgs>(args?: Prisma.Subset<T, ProjectFavoriteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectFavoriteCountAggregateOutputType> : number>;
    aggregate<T extends ProjectFavoriteAggregateArgs>(args: Prisma.Subset<T, ProjectFavoriteAggregateArgs>): Prisma.PrismaPromise<GetProjectFavoriteAggregateType<T>>;
    groupBy<T extends ProjectFavoriteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectFavoriteGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectFavoriteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectFavoriteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFavoriteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProjectFavoriteFieldRefs;
}
export interface Prisma__ProjectFavoriteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProjectFavoriteFieldRefs {
    readonly id: Prisma.FieldRef<"ProjectFavorite", 'String'>;
    readonly userId: Prisma.FieldRef<"ProjectFavorite", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"ProjectFavorite", 'String'>;
    readonly projectId: Prisma.FieldRef<"ProjectFavorite", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ProjectFavorite", 'DateTime'>;
}
export type ProjectFavoriteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
    where: Prisma.ProjectFavoriteWhereUniqueInput;
};
export type ProjectFavoriteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
    where: Prisma.ProjectFavoriteWhereUniqueInput;
};
export type ProjectFavoriteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectFavoriteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectFavoriteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ProjectFavoriteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectFavoriteCreateInput, Prisma.ProjectFavoriteUncheckedCreateInput>;
};
export type ProjectFavoriteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProjectFavoriteCreateManyInput | Prisma.ProjectFavoriteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProjectFavoriteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    data: Prisma.ProjectFavoriteCreateManyInput | Prisma.ProjectFavoriteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProjectFavoriteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProjectFavoriteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateInput, Prisma.ProjectFavoriteUncheckedUpdateInput>;
    where: Prisma.ProjectFavoriteWhereUniqueInput;
};
export type ProjectFavoriteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateManyMutationInput, Prisma.ProjectFavoriteUncheckedUpdateManyInput>;
    where?: Prisma.ProjectFavoriteWhereInput;
    limit?: number;
};
export type ProjectFavoriteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectFavoriteUpdateManyMutationInput, Prisma.ProjectFavoriteUncheckedUpdateManyInput>;
    where?: Prisma.ProjectFavoriteWhereInput;
    limit?: number;
    include?: Prisma.ProjectFavoriteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProjectFavoriteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
    where: Prisma.ProjectFavoriteWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectFavoriteCreateInput, Prisma.ProjectFavoriteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProjectFavoriteUpdateInput, Prisma.ProjectFavoriteUncheckedUpdateInput>;
};
export type ProjectFavoriteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
    where: Prisma.ProjectFavoriteWhereUniqueInput;
};
export type ProjectFavoriteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectFavoriteWhereInput;
    limit?: number;
};
export type ProjectFavoriteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectFavoriteSelect<ExtArgs> | null;
    omit?: Prisma.ProjectFavoriteOmit<ExtArgs> | null;
    include?: Prisma.ProjectFavoriteInclude<ExtArgs> | null;
};
