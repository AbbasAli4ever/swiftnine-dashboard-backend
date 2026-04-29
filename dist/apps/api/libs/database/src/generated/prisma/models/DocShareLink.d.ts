import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type DocShareLinkModel = runtime.Types.Result.DefaultSelection<Prisma.$DocShareLinkPayload>;
export type AggregateDocShareLink = {
    _count: DocShareLinkCountAggregateOutputType | null;
    _min: DocShareLinkMinAggregateOutputType | null;
    _max: DocShareLinkMaxAggregateOutputType | null;
};
export type DocShareLinkMinAggregateOutputType = {
    id: string | null;
    docId: string | null;
    token: string | null;
    role: $Enums.DocRole | null;
    expiresAt: Date | null;
    createdById: string | null;
    revokedAt: Date | null;
    createdAt: Date | null;
};
export type DocShareLinkMaxAggregateOutputType = {
    id: string | null;
    docId: string | null;
    token: string | null;
    role: $Enums.DocRole | null;
    expiresAt: Date | null;
    createdById: string | null;
    revokedAt: Date | null;
    createdAt: Date | null;
};
export type DocShareLinkCountAggregateOutputType = {
    id: number;
    docId: number;
    token: number;
    role: number;
    expiresAt: number;
    createdById: number;
    revokedAt: number;
    createdAt: number;
    _all: number;
};
export type DocShareLinkMinAggregateInputType = {
    id?: true;
    docId?: true;
    token?: true;
    role?: true;
    expiresAt?: true;
    createdById?: true;
    revokedAt?: true;
    createdAt?: true;
};
export type DocShareLinkMaxAggregateInputType = {
    id?: true;
    docId?: true;
    token?: true;
    role?: true;
    expiresAt?: true;
    createdById?: true;
    revokedAt?: true;
    createdAt?: true;
};
export type DocShareLinkCountAggregateInputType = {
    id?: true;
    docId?: true;
    token?: true;
    role?: true;
    expiresAt?: true;
    createdById?: true;
    revokedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type DocShareLinkAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocShareLinkWhereInput;
    orderBy?: Prisma.DocShareLinkOrderByWithRelationInput | Prisma.DocShareLinkOrderByWithRelationInput[];
    cursor?: Prisma.DocShareLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocShareLinkCountAggregateInputType;
    _min?: DocShareLinkMinAggregateInputType;
    _max?: DocShareLinkMaxAggregateInputType;
};
export type GetDocShareLinkAggregateType<T extends DocShareLinkAggregateArgs> = {
    [P in keyof T & keyof AggregateDocShareLink]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocShareLink[P]> : Prisma.GetScalarType<T[P], AggregateDocShareLink[P]>;
};
export type DocShareLinkGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocShareLinkWhereInput;
    orderBy?: Prisma.DocShareLinkOrderByWithAggregationInput | Prisma.DocShareLinkOrderByWithAggregationInput[];
    by: Prisma.DocShareLinkScalarFieldEnum[] | Prisma.DocShareLinkScalarFieldEnum;
    having?: Prisma.DocShareLinkScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocShareLinkCountAggregateInputType | true;
    _min?: DocShareLinkMinAggregateInputType;
    _max?: DocShareLinkMaxAggregateInputType;
};
export type DocShareLinkGroupByOutputType = {
    id: string;
    docId: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt: Date | null;
    createdById: string;
    revokedAt: Date | null;
    createdAt: Date;
    _count: DocShareLinkCountAggregateOutputType | null;
    _min: DocShareLinkMinAggregateOutputType | null;
    _max: DocShareLinkMaxAggregateOutputType | null;
};
export type GetDocShareLinkGroupByPayload<T extends DocShareLinkGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocShareLinkGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocShareLinkGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocShareLinkGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocShareLinkGroupByOutputType[P]>;
}>>;
export type DocShareLinkWhereInput = {
    AND?: Prisma.DocShareLinkWhereInput | Prisma.DocShareLinkWhereInput[];
    OR?: Prisma.DocShareLinkWhereInput[];
    NOT?: Prisma.DocShareLinkWhereInput | Prisma.DocShareLinkWhereInput[];
    id?: Prisma.StringFilter<"DocShareLink"> | string;
    docId?: Prisma.StringFilter<"DocShareLink"> | string;
    token?: Prisma.StringFilter<"DocShareLink"> | string;
    role?: Prisma.EnumDocRoleFilter<"DocShareLink"> | $Enums.DocRole;
    expiresAt?: Prisma.DateTimeNullableFilter<"DocShareLink"> | Date | string | null;
    createdById?: Prisma.StringFilter<"DocShareLink"> | string;
    revokedAt?: Prisma.DateTimeNullableFilter<"DocShareLink"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocShareLink"> | Date | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type DocShareLinkOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    doc?: Prisma.DocOrderByWithRelationInput;
    createdBy?: Prisma.UserOrderByWithRelationInput;
};
export type DocShareLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    token?: string;
    AND?: Prisma.DocShareLinkWhereInput | Prisma.DocShareLinkWhereInput[];
    OR?: Prisma.DocShareLinkWhereInput[];
    NOT?: Prisma.DocShareLinkWhereInput | Prisma.DocShareLinkWhereInput[];
    docId?: Prisma.StringFilter<"DocShareLink"> | string;
    role?: Prisma.EnumDocRoleFilter<"DocShareLink"> | $Enums.DocRole;
    expiresAt?: Prisma.DateTimeNullableFilter<"DocShareLink"> | Date | string | null;
    createdById?: Prisma.StringFilter<"DocShareLink"> | string;
    revokedAt?: Prisma.DateTimeNullableFilter<"DocShareLink"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocShareLink"> | Date | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "token">;
export type DocShareLinkOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.DocShareLinkCountOrderByAggregateInput;
    _max?: Prisma.DocShareLinkMaxOrderByAggregateInput;
    _min?: Prisma.DocShareLinkMinOrderByAggregateInput;
};
export type DocShareLinkScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocShareLinkScalarWhereWithAggregatesInput | Prisma.DocShareLinkScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocShareLinkScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocShareLinkScalarWhereWithAggregatesInput | Prisma.DocShareLinkScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DocShareLink"> | string;
    docId?: Prisma.StringWithAggregatesFilter<"DocShareLink"> | string;
    token?: Prisma.StringWithAggregatesFilter<"DocShareLink"> | string;
    role?: Prisma.EnumDocRoleWithAggregatesFilter<"DocShareLink"> | $Enums.DocRole;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"DocShareLink"> | Date | string | null;
    createdById?: Prisma.StringWithAggregatesFilter<"DocShareLink"> | string;
    revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"DocShareLink"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DocShareLink"> | Date | string;
};
export type DocShareLinkCreateInput = {
    id?: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutShareLinksInput;
    createdBy: Prisma.UserCreateNestedOneWithoutDocShareLinksCreatedInput;
};
export type DocShareLinkUncheckedCreateInput = {
    id?: string;
    docId: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    createdById: string;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type DocShareLinkUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutShareLinksNestedInput;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutDocShareLinksCreatedNestedInput;
};
export type DocShareLinkUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocShareLinkCreateManyInput = {
    id?: string;
    docId: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    createdById: string;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type DocShareLinkUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocShareLinkUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocShareLinkListRelationFilter = {
    every?: Prisma.DocShareLinkWhereInput;
    some?: Prisma.DocShareLinkWhereInput;
    none?: Prisma.DocShareLinkWhereInput;
};
export type DocShareLinkOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocShareLinkCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocShareLinkMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocShareLinkMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocShareLinkCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput> | Prisma.DocShareLinkCreateWithoutCreatedByInput[] | Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput | Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.DocShareLinkCreateManyCreatedByInputEnvelope;
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
};
export type DocShareLinkUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput> | Prisma.DocShareLinkCreateWithoutCreatedByInput[] | Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput | Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.DocShareLinkCreateManyCreatedByInputEnvelope;
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
};
export type DocShareLinkUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput> | Prisma.DocShareLinkCreateWithoutCreatedByInput[] | Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput | Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.DocShareLinkUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.DocShareLinkUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.DocShareLinkCreateManyCreatedByInputEnvelope;
    set?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    disconnect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    delete?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    update?: Prisma.DocShareLinkUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.DocShareLinkUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.DocShareLinkUpdateManyWithWhereWithoutCreatedByInput | Prisma.DocShareLinkUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.DocShareLinkScalarWhereInput | Prisma.DocShareLinkScalarWhereInput[];
};
export type DocShareLinkUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput> | Prisma.DocShareLinkCreateWithoutCreatedByInput[] | Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput | Prisma.DocShareLinkCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.DocShareLinkUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.DocShareLinkUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.DocShareLinkCreateManyCreatedByInputEnvelope;
    set?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    disconnect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    delete?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    update?: Prisma.DocShareLinkUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.DocShareLinkUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.DocShareLinkUpdateManyWithWhereWithoutCreatedByInput | Prisma.DocShareLinkUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.DocShareLinkScalarWhereInput | Prisma.DocShareLinkScalarWhereInput[];
};
export type DocShareLinkCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutDocInput, Prisma.DocShareLinkUncheckedCreateWithoutDocInput> | Prisma.DocShareLinkCreateWithoutDocInput[] | Prisma.DocShareLinkUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutDocInput | Prisma.DocShareLinkCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocShareLinkCreateManyDocInputEnvelope;
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
};
export type DocShareLinkUncheckedCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutDocInput, Prisma.DocShareLinkUncheckedCreateWithoutDocInput> | Prisma.DocShareLinkCreateWithoutDocInput[] | Prisma.DocShareLinkUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutDocInput | Prisma.DocShareLinkCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocShareLinkCreateManyDocInputEnvelope;
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
};
export type DocShareLinkUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutDocInput, Prisma.DocShareLinkUncheckedCreateWithoutDocInput> | Prisma.DocShareLinkCreateWithoutDocInput[] | Prisma.DocShareLinkUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutDocInput | Prisma.DocShareLinkCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocShareLinkUpsertWithWhereUniqueWithoutDocInput | Prisma.DocShareLinkUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocShareLinkCreateManyDocInputEnvelope;
    set?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    disconnect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    delete?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    update?: Prisma.DocShareLinkUpdateWithWhereUniqueWithoutDocInput | Prisma.DocShareLinkUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocShareLinkUpdateManyWithWhereWithoutDocInput | Prisma.DocShareLinkUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocShareLinkScalarWhereInput | Prisma.DocShareLinkScalarWhereInput[];
};
export type DocShareLinkUncheckedUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocShareLinkCreateWithoutDocInput, Prisma.DocShareLinkUncheckedCreateWithoutDocInput> | Prisma.DocShareLinkCreateWithoutDocInput[] | Prisma.DocShareLinkUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocShareLinkCreateOrConnectWithoutDocInput | Prisma.DocShareLinkCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocShareLinkUpsertWithWhereUniqueWithoutDocInput | Prisma.DocShareLinkUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocShareLinkCreateManyDocInputEnvelope;
    set?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    disconnect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    delete?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    connect?: Prisma.DocShareLinkWhereUniqueInput | Prisma.DocShareLinkWhereUniqueInput[];
    update?: Prisma.DocShareLinkUpdateWithWhereUniqueWithoutDocInput | Prisma.DocShareLinkUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocShareLinkUpdateManyWithWhereWithoutDocInput | Prisma.DocShareLinkUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocShareLinkScalarWhereInput | Prisma.DocShareLinkScalarWhereInput[];
};
export type DocShareLinkCreateWithoutCreatedByInput = {
    id?: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutShareLinksInput;
};
export type DocShareLinkUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    docId: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type DocShareLinkCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.DocShareLinkWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocShareLinkCreateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput>;
};
export type DocShareLinkCreateManyCreatedByInputEnvelope = {
    data: Prisma.DocShareLinkCreateManyCreatedByInput | Prisma.DocShareLinkCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type DocShareLinkUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.DocShareLinkWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocShareLinkUpdateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.DocShareLinkCreateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedCreateWithoutCreatedByInput>;
};
export type DocShareLinkUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.DocShareLinkWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocShareLinkUpdateWithoutCreatedByInput, Prisma.DocShareLinkUncheckedUpdateWithoutCreatedByInput>;
};
export type DocShareLinkUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.DocShareLinkScalarWhereInput;
    data: Prisma.XOR<Prisma.DocShareLinkUpdateManyMutationInput, Prisma.DocShareLinkUncheckedUpdateManyWithoutCreatedByInput>;
};
export type DocShareLinkScalarWhereInput = {
    AND?: Prisma.DocShareLinkScalarWhereInput | Prisma.DocShareLinkScalarWhereInput[];
    OR?: Prisma.DocShareLinkScalarWhereInput[];
    NOT?: Prisma.DocShareLinkScalarWhereInput | Prisma.DocShareLinkScalarWhereInput[];
    id?: Prisma.StringFilter<"DocShareLink"> | string;
    docId?: Prisma.StringFilter<"DocShareLink"> | string;
    token?: Prisma.StringFilter<"DocShareLink"> | string;
    role?: Prisma.EnumDocRoleFilter<"DocShareLink"> | $Enums.DocRole;
    expiresAt?: Prisma.DateTimeNullableFilter<"DocShareLink"> | Date | string | null;
    createdById?: Prisma.StringFilter<"DocShareLink"> | string;
    revokedAt?: Prisma.DateTimeNullableFilter<"DocShareLink"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocShareLink"> | Date | string;
};
export type DocShareLinkCreateWithoutDocInput = {
    id?: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutDocShareLinksCreatedInput;
};
export type DocShareLinkUncheckedCreateWithoutDocInput = {
    id?: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    createdById: string;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type DocShareLinkCreateOrConnectWithoutDocInput = {
    where: Prisma.DocShareLinkWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocShareLinkCreateWithoutDocInput, Prisma.DocShareLinkUncheckedCreateWithoutDocInput>;
};
export type DocShareLinkCreateManyDocInputEnvelope = {
    data: Prisma.DocShareLinkCreateManyDocInput | Prisma.DocShareLinkCreateManyDocInput[];
    skipDuplicates?: boolean;
};
export type DocShareLinkUpsertWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocShareLinkWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocShareLinkUpdateWithoutDocInput, Prisma.DocShareLinkUncheckedUpdateWithoutDocInput>;
    create: Prisma.XOR<Prisma.DocShareLinkCreateWithoutDocInput, Prisma.DocShareLinkUncheckedCreateWithoutDocInput>;
};
export type DocShareLinkUpdateWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocShareLinkWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocShareLinkUpdateWithoutDocInput, Prisma.DocShareLinkUncheckedUpdateWithoutDocInput>;
};
export type DocShareLinkUpdateManyWithWhereWithoutDocInput = {
    where: Prisma.DocShareLinkScalarWhereInput;
    data: Prisma.XOR<Prisma.DocShareLinkUpdateManyMutationInput, Prisma.DocShareLinkUncheckedUpdateManyWithoutDocInput>;
};
export type DocShareLinkCreateManyCreatedByInput = {
    id?: string;
    docId: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type DocShareLinkUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutShareLinksNestedInput;
};
export type DocShareLinkUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocShareLinkUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocShareLinkCreateManyDocInput = {
    id?: string;
    token: string;
    role: $Enums.DocRole;
    expiresAt?: Date | string | null;
    createdById: string;
    revokedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type DocShareLinkUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutDocShareLinksCreatedNestedInput;
};
export type DocShareLinkUncheckedUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocShareLinkUncheckedUpdateManyWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocShareLinkSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    token?: boolean;
    role?: boolean;
    expiresAt?: boolean;
    createdById?: boolean;
    revokedAt?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docShareLink"]>;
export type DocShareLinkSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    token?: boolean;
    role?: boolean;
    expiresAt?: boolean;
    createdById?: boolean;
    revokedAt?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docShareLink"]>;
export type DocShareLinkSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    token?: boolean;
    role?: boolean;
    expiresAt?: boolean;
    createdById?: boolean;
    revokedAt?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docShareLink"]>;
export type DocShareLinkSelectScalar = {
    id?: boolean;
    docId?: boolean;
    token?: boolean;
    role?: boolean;
    expiresAt?: boolean;
    createdById?: boolean;
    revokedAt?: boolean;
    createdAt?: boolean;
};
export type DocShareLinkOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "docId" | "token" | "role" | "expiresAt" | "createdById" | "revokedAt" | "createdAt", ExtArgs["result"]["docShareLink"]>;
export type DocShareLinkInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocShareLinkIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocShareLinkIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DocShareLinkPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DocShareLink";
    objects: {
        doc: Prisma.$DocPayload<ExtArgs>;
        createdBy: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        docId: string;
        token: string;
        role: $Enums.DocRole;
        expiresAt: Date | null;
        createdById: string;
        revokedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["docShareLink"]>;
    composites: {};
};
export type DocShareLinkGetPayload<S extends boolean | null | undefined | DocShareLinkDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload, S>;
export type DocShareLinkCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocShareLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocShareLinkCountAggregateInputType | true;
};
export interface DocShareLinkDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DocShareLink'];
        meta: {
            name: 'DocShareLink';
        };
    };
    findUnique<T extends DocShareLinkFindUniqueArgs>(args: Prisma.SelectSubset<T, DocShareLinkFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocShareLinkFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocShareLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocShareLinkFindFirstArgs>(args?: Prisma.SelectSubset<T, DocShareLinkFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocShareLinkFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocShareLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocShareLinkFindManyArgs>(args?: Prisma.SelectSubset<T, DocShareLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocShareLinkCreateArgs>(args: Prisma.SelectSubset<T, DocShareLinkCreateArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocShareLinkCreateManyArgs>(args?: Prisma.SelectSubset<T, DocShareLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocShareLinkCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocShareLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocShareLinkDeleteArgs>(args: Prisma.SelectSubset<T, DocShareLinkDeleteArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocShareLinkUpdateArgs>(args: Prisma.SelectSubset<T, DocShareLinkUpdateArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocShareLinkDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocShareLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocShareLinkUpdateManyArgs>(args: Prisma.SelectSubset<T, DocShareLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocShareLinkUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocShareLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocShareLinkUpsertArgs>(args: Prisma.SelectSubset<T, DocShareLinkUpsertArgs<ExtArgs>>): Prisma.Prisma__DocShareLinkClient<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocShareLinkCountArgs>(args?: Prisma.Subset<T, DocShareLinkCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocShareLinkCountAggregateOutputType> : number>;
    aggregate<T extends DocShareLinkAggregateArgs>(args: Prisma.Subset<T, DocShareLinkAggregateArgs>): Prisma.PrismaPromise<GetDocShareLinkAggregateType<T>>;
    groupBy<T extends DocShareLinkGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocShareLinkGroupByArgs['orderBy'];
    } : {
        orderBy?: DocShareLinkGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocShareLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocShareLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocShareLinkFieldRefs;
}
export interface Prisma__DocShareLinkClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    doc<T extends Prisma.DocDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocDefaultArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocShareLinkFieldRefs {
    readonly id: Prisma.FieldRef<"DocShareLink", 'String'>;
    readonly docId: Prisma.FieldRef<"DocShareLink", 'String'>;
    readonly token: Prisma.FieldRef<"DocShareLink", 'String'>;
    readonly role: Prisma.FieldRef<"DocShareLink", 'DocRole'>;
    readonly expiresAt: Prisma.FieldRef<"DocShareLink", 'DateTime'>;
    readonly createdById: Prisma.FieldRef<"DocShareLink", 'String'>;
    readonly revokedAt: Prisma.FieldRef<"DocShareLink", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"DocShareLink", 'DateTime'>;
}
export type DocShareLinkFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    where: Prisma.DocShareLinkWhereUniqueInput;
};
export type DocShareLinkFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    where: Prisma.DocShareLinkWhereUniqueInput;
};
export type DocShareLinkFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    where?: Prisma.DocShareLinkWhereInput;
    orderBy?: Prisma.DocShareLinkOrderByWithRelationInput | Prisma.DocShareLinkOrderByWithRelationInput[];
    cursor?: Prisma.DocShareLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocShareLinkScalarFieldEnum | Prisma.DocShareLinkScalarFieldEnum[];
};
export type DocShareLinkFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    where?: Prisma.DocShareLinkWhereInput;
    orderBy?: Prisma.DocShareLinkOrderByWithRelationInput | Prisma.DocShareLinkOrderByWithRelationInput[];
    cursor?: Prisma.DocShareLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocShareLinkScalarFieldEnum | Prisma.DocShareLinkScalarFieldEnum[];
};
export type DocShareLinkFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    where?: Prisma.DocShareLinkWhereInput;
    orderBy?: Prisma.DocShareLinkOrderByWithRelationInput | Prisma.DocShareLinkOrderByWithRelationInput[];
    cursor?: Prisma.DocShareLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocShareLinkScalarFieldEnum | Prisma.DocShareLinkScalarFieldEnum[];
};
export type DocShareLinkCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocShareLinkCreateInput, Prisma.DocShareLinkUncheckedCreateInput>;
};
export type DocShareLinkCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocShareLinkCreateManyInput | Prisma.DocShareLinkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocShareLinkCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    data: Prisma.DocShareLinkCreateManyInput | Prisma.DocShareLinkCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DocShareLinkIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DocShareLinkUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocShareLinkUpdateInput, Prisma.DocShareLinkUncheckedUpdateInput>;
    where: Prisma.DocShareLinkWhereUniqueInput;
};
export type DocShareLinkUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocShareLinkUpdateManyMutationInput, Prisma.DocShareLinkUncheckedUpdateManyInput>;
    where?: Prisma.DocShareLinkWhereInput;
    limit?: number;
};
export type DocShareLinkUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocShareLinkUpdateManyMutationInput, Prisma.DocShareLinkUncheckedUpdateManyInput>;
    where?: Prisma.DocShareLinkWhereInput;
    limit?: number;
    include?: Prisma.DocShareLinkIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DocShareLinkUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    where: Prisma.DocShareLinkWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocShareLinkCreateInput, Prisma.DocShareLinkUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocShareLinkUpdateInput, Prisma.DocShareLinkUncheckedUpdateInput>;
};
export type DocShareLinkDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
    where: Prisma.DocShareLinkWhereUniqueInput;
};
export type DocShareLinkDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocShareLinkWhereInput;
    limit?: number;
};
export type DocShareLinkDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocShareLinkSelect<ExtArgs> | null;
    omit?: Prisma.DocShareLinkOmit<ExtArgs> | null;
    include?: Prisma.DocShareLinkInclude<ExtArgs> | null;
};
