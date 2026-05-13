import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ProjectPasswordResetTokenModel = runtime.Types.Result.DefaultSelection<Prisma.$ProjectPasswordResetTokenPayload>;
export type AggregateProjectPasswordResetToken = {
    _count: ProjectPasswordResetTokenCountAggregateOutputType | null;
    _min: ProjectPasswordResetTokenMinAggregateOutputType | null;
    _max: ProjectPasswordResetTokenMaxAggregateOutputType | null;
};
export type ProjectPasswordResetTokenMinAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    tokenHash: string | null;
    expiresAt: Date | null;
    usedAt: Date | null;
    createdAt: Date | null;
};
export type ProjectPasswordResetTokenMaxAggregateOutputType = {
    id: string | null;
    projectId: string | null;
    tokenHash: string | null;
    expiresAt: Date | null;
    usedAt: Date | null;
    createdAt: Date | null;
};
export type ProjectPasswordResetTokenCountAggregateOutputType = {
    id: number;
    projectId: number;
    tokenHash: number;
    expiresAt: number;
    usedAt: number;
    createdAt: number;
    _all: number;
};
export type ProjectPasswordResetTokenMinAggregateInputType = {
    id?: true;
    projectId?: true;
    tokenHash?: true;
    expiresAt?: true;
    usedAt?: true;
    createdAt?: true;
};
export type ProjectPasswordResetTokenMaxAggregateInputType = {
    id?: true;
    projectId?: true;
    tokenHash?: true;
    expiresAt?: true;
    usedAt?: true;
    createdAt?: true;
};
export type ProjectPasswordResetTokenCountAggregateInputType = {
    id?: true;
    projectId?: true;
    tokenHash?: true;
    expiresAt?: true;
    usedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ProjectPasswordResetTokenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    orderBy?: Prisma.ProjectPasswordResetTokenOrderByWithRelationInput | Prisma.ProjectPasswordResetTokenOrderByWithRelationInput[];
    cursor?: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProjectPasswordResetTokenCountAggregateInputType;
    _min?: ProjectPasswordResetTokenMinAggregateInputType;
    _max?: ProjectPasswordResetTokenMaxAggregateInputType;
};
export type GetProjectPasswordResetTokenAggregateType<T extends ProjectPasswordResetTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectPasswordResetToken]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProjectPasswordResetToken[P]> : Prisma.GetScalarType<T[P], AggregateProjectPasswordResetToken[P]>;
};
export type ProjectPasswordResetTokenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    orderBy?: Prisma.ProjectPasswordResetTokenOrderByWithAggregationInput | Prisma.ProjectPasswordResetTokenOrderByWithAggregationInput[];
    by: Prisma.ProjectPasswordResetTokenScalarFieldEnum[] | Prisma.ProjectPasswordResetTokenScalarFieldEnum;
    having?: Prisma.ProjectPasswordResetTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProjectPasswordResetTokenCountAggregateInputType | true;
    _min?: ProjectPasswordResetTokenMinAggregateInputType;
    _max?: ProjectPasswordResetTokenMaxAggregateInputType;
};
export type ProjectPasswordResetTokenGroupByOutputType = {
    id: string;
    projectId: string;
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
    _count: ProjectPasswordResetTokenCountAggregateOutputType | null;
    _min: ProjectPasswordResetTokenMinAggregateOutputType | null;
    _max: ProjectPasswordResetTokenMaxAggregateOutputType | null;
};
export type GetProjectPasswordResetTokenGroupByPayload<T extends ProjectPasswordResetTokenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProjectPasswordResetTokenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProjectPasswordResetTokenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProjectPasswordResetTokenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProjectPasswordResetTokenGroupByOutputType[P]>;
}>>;
export type ProjectPasswordResetTokenWhereInput = {
    AND?: Prisma.ProjectPasswordResetTokenWhereInput | Prisma.ProjectPasswordResetTokenWhereInput[];
    OR?: Prisma.ProjectPasswordResetTokenWhereInput[];
    NOT?: Prisma.ProjectPasswordResetTokenWhereInput | Prisma.ProjectPasswordResetTokenWhereInput[];
    id?: Prisma.StringFilter<"ProjectPasswordResetToken"> | string;
    projectId?: Prisma.StringFilter<"ProjectPasswordResetToken"> | string;
    tokenHash?: Prisma.StringFilter<"ProjectPasswordResetToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"ProjectPasswordResetToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"ProjectPasswordResetToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ProjectPasswordResetToken"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
};
export type ProjectPasswordResetTokenOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    project?: Prisma.ProjectOrderByWithRelationInput;
};
export type ProjectPasswordResetTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    tokenHash?: string;
    AND?: Prisma.ProjectPasswordResetTokenWhereInput | Prisma.ProjectPasswordResetTokenWhereInput[];
    OR?: Prisma.ProjectPasswordResetTokenWhereInput[];
    NOT?: Prisma.ProjectPasswordResetTokenWhereInput | Prisma.ProjectPasswordResetTokenWhereInput[];
    projectId?: Prisma.StringFilter<"ProjectPasswordResetToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"ProjectPasswordResetToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"ProjectPasswordResetToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ProjectPasswordResetToken"> | Date | string;
    project?: Prisma.XOR<Prisma.ProjectScalarRelationFilter, Prisma.ProjectWhereInput>;
}, "id" | "tokenHash">;
export type ProjectPasswordResetTokenOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ProjectPasswordResetTokenCountOrderByAggregateInput;
    _max?: Prisma.ProjectPasswordResetTokenMaxOrderByAggregateInput;
    _min?: Prisma.ProjectPasswordResetTokenMinOrderByAggregateInput;
};
export type ProjectPasswordResetTokenScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProjectPasswordResetTokenScalarWhereWithAggregatesInput | Prisma.ProjectPasswordResetTokenScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProjectPasswordResetTokenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProjectPasswordResetTokenScalarWhereWithAggregatesInput | Prisma.ProjectPasswordResetTokenScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ProjectPasswordResetToken"> | string;
    projectId?: Prisma.StringWithAggregatesFilter<"ProjectPasswordResetToken"> | string;
    tokenHash?: Prisma.StringWithAggregatesFilter<"ProjectPasswordResetToken"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"ProjectPasswordResetToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ProjectPasswordResetToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProjectPasswordResetToken"> | Date | string;
};
export type ProjectPasswordResetTokenCreateInput = {
    id?: string;
    tokenHash: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
    project: Prisma.ProjectCreateNestedOneWithoutPasswordResetTokensInput;
};
export type ProjectPasswordResetTokenUncheckedCreateInput = {
    id?: string;
    projectId: string;
    tokenHash: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ProjectPasswordResetTokenUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    project?: Prisma.ProjectUpdateOneRequiredWithoutPasswordResetTokensNestedInput;
};
export type ProjectPasswordResetTokenUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectPasswordResetTokenCreateManyInput = {
    id?: string;
    projectId: string;
    tokenHash: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ProjectPasswordResetTokenUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectPasswordResetTokenUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectPasswordResetTokenListRelationFilter = {
    every?: Prisma.ProjectPasswordResetTokenWhereInput;
    some?: Prisma.ProjectPasswordResetTokenWhereInput;
    none?: Prisma.ProjectPasswordResetTokenWhereInput;
};
export type ProjectPasswordResetTokenOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ProjectPasswordResetTokenCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectPasswordResetTokenMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectPasswordResetTokenMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ProjectPasswordResetTokenCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput> | Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput[] | Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput | Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectPasswordResetTokenCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
};
export type ProjectPasswordResetTokenUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput> | Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput[] | Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput | Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.ProjectPasswordResetTokenCreateManyProjectInputEnvelope;
    connect?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
};
export type ProjectPasswordResetTokenUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput> | Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput[] | Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput | Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectPasswordResetTokenUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectPasswordResetTokenUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectPasswordResetTokenCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    disconnect?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    delete?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    connect?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    update?: Prisma.ProjectPasswordResetTokenUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectPasswordResetTokenUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectPasswordResetTokenUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectPasswordResetTokenUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectPasswordResetTokenScalarWhereInput | Prisma.ProjectPasswordResetTokenScalarWhereInput[];
};
export type ProjectPasswordResetTokenUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput> | Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput[] | Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput | Prisma.ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.ProjectPasswordResetTokenUpsertWithWhereUniqueWithoutProjectInput | Prisma.ProjectPasswordResetTokenUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.ProjectPasswordResetTokenCreateManyProjectInputEnvelope;
    set?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    disconnect?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    delete?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    connect?: Prisma.ProjectPasswordResetTokenWhereUniqueInput | Prisma.ProjectPasswordResetTokenWhereUniqueInput[];
    update?: Prisma.ProjectPasswordResetTokenUpdateWithWhereUniqueWithoutProjectInput | Prisma.ProjectPasswordResetTokenUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.ProjectPasswordResetTokenUpdateManyWithWhereWithoutProjectInput | Prisma.ProjectPasswordResetTokenUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.ProjectPasswordResetTokenScalarWhereInput | Prisma.ProjectPasswordResetTokenScalarWhereInput[];
};
export type ProjectPasswordResetTokenCreateWithoutProjectInput = {
    id?: string;
    tokenHash: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput = {
    id?: string;
    tokenHash: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ProjectPasswordResetTokenCreateOrConnectWithoutProjectInput = {
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput>;
};
export type ProjectPasswordResetTokenCreateManyProjectInputEnvelope = {
    data: Prisma.ProjectPasswordResetTokenCreateManyProjectInput | Prisma.ProjectPasswordResetTokenCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type ProjectPasswordResetTokenUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    update: Prisma.XOR<Prisma.ProjectPasswordResetTokenUpdateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedCreateWithoutProjectInput>;
};
export type ProjectPasswordResetTokenUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    data: Prisma.XOR<Prisma.ProjectPasswordResetTokenUpdateWithoutProjectInput, Prisma.ProjectPasswordResetTokenUncheckedUpdateWithoutProjectInput>;
};
export type ProjectPasswordResetTokenUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.ProjectPasswordResetTokenScalarWhereInput;
    data: Prisma.XOR<Prisma.ProjectPasswordResetTokenUpdateManyMutationInput, Prisma.ProjectPasswordResetTokenUncheckedUpdateManyWithoutProjectInput>;
};
export type ProjectPasswordResetTokenScalarWhereInput = {
    AND?: Prisma.ProjectPasswordResetTokenScalarWhereInput | Prisma.ProjectPasswordResetTokenScalarWhereInput[];
    OR?: Prisma.ProjectPasswordResetTokenScalarWhereInput[];
    NOT?: Prisma.ProjectPasswordResetTokenScalarWhereInput | Prisma.ProjectPasswordResetTokenScalarWhereInput[];
    id?: Prisma.StringFilter<"ProjectPasswordResetToken"> | string;
    projectId?: Prisma.StringFilter<"ProjectPasswordResetToken"> | string;
    tokenHash?: Prisma.StringFilter<"ProjectPasswordResetToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"ProjectPasswordResetToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"ProjectPasswordResetToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ProjectPasswordResetToken"> | Date | string;
};
export type ProjectPasswordResetTokenCreateManyProjectInput = {
    id?: string;
    tokenHash: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ProjectPasswordResetTokenUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectPasswordResetTokenUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectPasswordResetTokenUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProjectPasswordResetTokenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectPasswordResetToken"]>;
export type ProjectPasswordResetTokenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectPasswordResetToken"]>;
export type ProjectPasswordResetTokenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    projectId?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
    createdAt?: boolean;
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["projectPasswordResetToken"]>;
export type ProjectPasswordResetTokenSelectScalar = {
    id?: boolean;
    projectId?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
    createdAt?: boolean;
};
export type ProjectPasswordResetTokenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "projectId" | "tokenHash" | "expiresAt" | "usedAt" | "createdAt", ExtArgs["result"]["projectPasswordResetToken"]>;
export type ProjectPasswordResetTokenInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type ProjectPasswordResetTokenIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type ProjectPasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    project?: boolean | Prisma.ProjectDefaultArgs<ExtArgs>;
};
export type $ProjectPasswordResetTokenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProjectPasswordResetToken";
    objects: {
        project: Prisma.$ProjectPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        projectId: string;
        tokenHash: string;
        expiresAt: Date;
        usedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["projectPasswordResetToken"]>;
    composites: {};
};
export type ProjectPasswordResetTokenGetPayload<S extends boolean | null | undefined | ProjectPasswordResetTokenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload, S>;
export type ProjectPasswordResetTokenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProjectPasswordResetTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectPasswordResetTokenCountAggregateInputType | true;
};
export interface ProjectPasswordResetTokenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProjectPasswordResetToken'];
        meta: {
            name: 'ProjectPasswordResetToken';
        };
    };
    findUnique<T extends ProjectPasswordResetTokenFindUniqueArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProjectPasswordResetTokenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProjectPasswordResetTokenFindFirstArgs>(args?: Prisma.SelectSubset<T, ProjectPasswordResetTokenFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProjectPasswordResetTokenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProjectPasswordResetTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProjectPasswordResetTokenFindManyArgs>(args?: Prisma.SelectSubset<T, ProjectPasswordResetTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProjectPasswordResetTokenCreateArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenCreateArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProjectPasswordResetTokenCreateManyArgs>(args?: Prisma.SelectSubset<T, ProjectPasswordResetTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProjectPasswordResetTokenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProjectPasswordResetTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProjectPasswordResetTokenDeleteArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenDeleteArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProjectPasswordResetTokenUpdateArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenUpdateArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProjectPasswordResetTokenDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProjectPasswordResetTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProjectPasswordResetTokenUpdateManyArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProjectPasswordResetTokenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProjectPasswordResetTokenUpsertArgs>(args: Prisma.SelectSubset<T, ProjectPasswordResetTokenUpsertArgs<ExtArgs>>): Prisma.Prisma__ProjectPasswordResetTokenClient<runtime.Types.Result.GetResult<Prisma.$ProjectPasswordResetTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProjectPasswordResetTokenCountArgs>(args?: Prisma.Subset<T, ProjectPasswordResetTokenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProjectPasswordResetTokenCountAggregateOutputType> : number>;
    aggregate<T extends ProjectPasswordResetTokenAggregateArgs>(args: Prisma.Subset<T, ProjectPasswordResetTokenAggregateArgs>): Prisma.PrismaPromise<GetProjectPasswordResetTokenAggregateType<T>>;
    groupBy<T extends ProjectPasswordResetTokenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProjectPasswordResetTokenGroupByArgs['orderBy'];
    } : {
        orderBy?: ProjectPasswordResetTokenGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProjectPasswordResetTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectPasswordResetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProjectPasswordResetTokenFieldRefs;
}
export interface Prisma__ProjectPasswordResetTokenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    project<T extends Prisma.ProjectDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProjectDefaultArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProjectPasswordResetTokenFieldRefs {
    readonly id: Prisma.FieldRef<"ProjectPasswordResetToken", 'String'>;
    readonly projectId: Prisma.FieldRef<"ProjectPasswordResetToken", 'String'>;
    readonly tokenHash: Prisma.FieldRef<"ProjectPasswordResetToken", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"ProjectPasswordResetToken", 'DateTime'>;
    readonly usedAt: Prisma.FieldRef<"ProjectPasswordResetToken", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ProjectPasswordResetToken", 'DateTime'>;
}
export type ProjectPasswordResetTokenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
};
export type ProjectPasswordResetTokenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
};
export type ProjectPasswordResetTokenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    orderBy?: Prisma.ProjectPasswordResetTokenOrderByWithRelationInput | Prisma.ProjectPasswordResetTokenOrderByWithRelationInput[];
    cursor?: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectPasswordResetTokenScalarFieldEnum | Prisma.ProjectPasswordResetTokenScalarFieldEnum[];
};
export type ProjectPasswordResetTokenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    orderBy?: Prisma.ProjectPasswordResetTokenOrderByWithRelationInput | Prisma.ProjectPasswordResetTokenOrderByWithRelationInput[];
    cursor?: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectPasswordResetTokenScalarFieldEnum | Prisma.ProjectPasswordResetTokenScalarFieldEnum[];
};
export type ProjectPasswordResetTokenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    orderBy?: Prisma.ProjectPasswordResetTokenOrderByWithRelationInput | Prisma.ProjectPasswordResetTokenOrderByWithRelationInput[];
    cursor?: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProjectPasswordResetTokenScalarFieldEnum | Prisma.ProjectPasswordResetTokenScalarFieldEnum[];
};
export type ProjectPasswordResetTokenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateInput, Prisma.ProjectPasswordResetTokenUncheckedCreateInput>;
};
export type ProjectPasswordResetTokenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProjectPasswordResetTokenCreateManyInput | Prisma.ProjectPasswordResetTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProjectPasswordResetTokenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    data: Prisma.ProjectPasswordResetTokenCreateManyInput | Prisma.ProjectPasswordResetTokenCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ProjectPasswordResetTokenIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ProjectPasswordResetTokenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectPasswordResetTokenUpdateInput, Prisma.ProjectPasswordResetTokenUncheckedUpdateInput>;
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
};
export type ProjectPasswordResetTokenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProjectPasswordResetTokenUpdateManyMutationInput, Prisma.ProjectPasswordResetTokenUncheckedUpdateManyInput>;
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    limit?: number;
};
export type ProjectPasswordResetTokenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProjectPasswordResetTokenUpdateManyMutationInput, Prisma.ProjectPasswordResetTokenUncheckedUpdateManyInput>;
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    limit?: number;
    include?: Prisma.ProjectPasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ProjectPasswordResetTokenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProjectPasswordResetTokenCreateInput, Prisma.ProjectPasswordResetTokenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProjectPasswordResetTokenUpdateInput, Prisma.ProjectPasswordResetTokenUncheckedUpdateInput>;
};
export type ProjectPasswordResetTokenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
    where: Prisma.ProjectPasswordResetTokenWhereUniqueInput;
};
export type ProjectPasswordResetTokenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProjectPasswordResetTokenWhereInput;
    limit?: number;
};
export type ProjectPasswordResetTokenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectPasswordResetTokenSelect<ExtArgs> | null;
    omit?: Prisma.ProjectPasswordResetTokenOmit<ExtArgs> | null;
    include?: Prisma.ProjectPasswordResetTokenInclude<ExtArgs> | null;
};
