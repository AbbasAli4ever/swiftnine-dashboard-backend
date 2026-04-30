import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type DocPermissionModel = runtime.Types.Result.DefaultSelection<Prisma.$DocPermissionPayload>;
export type AggregateDocPermission = {
    _count: DocPermissionCountAggregateOutputType | null;
    _min: DocPermissionMinAggregateOutputType | null;
    _max: DocPermissionMaxAggregateOutputType | null;
};
export type DocPermissionMinAggregateOutputType = {
    id: string | null;
    docId: string | null;
    userId: string | null;
    role: $Enums.DocRole | null;
    grantedById: string | null;
    createdAt: Date | null;
};
export type DocPermissionMaxAggregateOutputType = {
    id: string | null;
    docId: string | null;
    userId: string | null;
    role: $Enums.DocRole | null;
    grantedById: string | null;
    createdAt: Date | null;
};
export type DocPermissionCountAggregateOutputType = {
    id: number;
    docId: number;
    userId: number;
    role: number;
    grantedById: number;
    createdAt: number;
    _all: number;
};
export type DocPermissionMinAggregateInputType = {
    id?: true;
    docId?: true;
    userId?: true;
    role?: true;
    grantedById?: true;
    createdAt?: true;
};
export type DocPermissionMaxAggregateInputType = {
    id?: true;
    docId?: true;
    userId?: true;
    role?: true;
    grantedById?: true;
    createdAt?: true;
};
export type DocPermissionCountAggregateInputType = {
    id?: true;
    docId?: true;
    userId?: true;
    role?: true;
    grantedById?: true;
    createdAt?: true;
    _all?: true;
};
export type DocPermissionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocPermissionWhereInput;
    orderBy?: Prisma.DocPermissionOrderByWithRelationInput | Prisma.DocPermissionOrderByWithRelationInput[];
    cursor?: Prisma.DocPermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocPermissionCountAggregateInputType;
    _min?: DocPermissionMinAggregateInputType;
    _max?: DocPermissionMaxAggregateInputType;
};
export type GetDocPermissionAggregateType<T extends DocPermissionAggregateArgs> = {
    [P in keyof T & keyof AggregateDocPermission]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocPermission[P]> : Prisma.GetScalarType<T[P], AggregateDocPermission[P]>;
};
export type DocPermissionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocPermissionWhereInput;
    orderBy?: Prisma.DocPermissionOrderByWithAggregationInput | Prisma.DocPermissionOrderByWithAggregationInput[];
    by: Prisma.DocPermissionScalarFieldEnum[] | Prisma.DocPermissionScalarFieldEnum;
    having?: Prisma.DocPermissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocPermissionCountAggregateInputType | true;
    _min?: DocPermissionMinAggregateInputType;
    _max?: DocPermissionMaxAggregateInputType;
};
export type DocPermissionGroupByOutputType = {
    id: string;
    docId: string;
    userId: string;
    role: $Enums.DocRole;
    grantedById: string;
    createdAt: Date;
    _count: DocPermissionCountAggregateOutputType | null;
    _min: DocPermissionMinAggregateOutputType | null;
    _max: DocPermissionMaxAggregateOutputType | null;
};
export type GetDocPermissionGroupByPayload<T extends DocPermissionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocPermissionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocPermissionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocPermissionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocPermissionGroupByOutputType[P]>;
}>>;
export type DocPermissionWhereInput = {
    AND?: Prisma.DocPermissionWhereInput | Prisma.DocPermissionWhereInput[];
    OR?: Prisma.DocPermissionWhereInput[];
    NOT?: Prisma.DocPermissionWhereInput | Prisma.DocPermissionWhereInput[];
    id?: Prisma.StringFilter<"DocPermission"> | string;
    docId?: Prisma.StringFilter<"DocPermission"> | string;
    userId?: Prisma.StringFilter<"DocPermission"> | string;
    role?: Prisma.EnumDocRoleFilter<"DocPermission"> | $Enums.DocRole;
    grantedById?: Prisma.StringFilter<"DocPermission"> | string;
    createdAt?: Prisma.DateTimeFilter<"DocPermission"> | Date | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    grantedBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type DocPermissionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    grantedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    doc?: Prisma.DocOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    grantedBy?: Prisma.UserOrderByWithRelationInput;
};
export type DocPermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    docId_userId?: Prisma.DocPermissionDocIdUserIdCompoundUniqueInput;
    AND?: Prisma.DocPermissionWhereInput | Prisma.DocPermissionWhereInput[];
    OR?: Prisma.DocPermissionWhereInput[];
    NOT?: Prisma.DocPermissionWhereInput | Prisma.DocPermissionWhereInput[];
    docId?: Prisma.StringFilter<"DocPermission"> | string;
    userId?: Prisma.StringFilter<"DocPermission"> | string;
    role?: Prisma.EnumDocRoleFilter<"DocPermission"> | $Enums.DocRole;
    grantedById?: Prisma.StringFilter<"DocPermission"> | string;
    createdAt?: Prisma.DateTimeFilter<"DocPermission"> | Date | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    grantedBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "docId_userId">;
export type DocPermissionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    grantedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.DocPermissionCountOrderByAggregateInput;
    _max?: Prisma.DocPermissionMaxOrderByAggregateInput;
    _min?: Prisma.DocPermissionMinOrderByAggregateInput;
};
export type DocPermissionScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocPermissionScalarWhereWithAggregatesInput | Prisma.DocPermissionScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocPermissionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocPermissionScalarWhereWithAggregatesInput | Prisma.DocPermissionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DocPermission"> | string;
    docId?: Prisma.StringWithAggregatesFilter<"DocPermission"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"DocPermission"> | string;
    role?: Prisma.EnumDocRoleWithAggregatesFilter<"DocPermission"> | $Enums.DocRole;
    grantedById?: Prisma.StringWithAggregatesFilter<"DocPermission"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DocPermission"> | Date | string;
};
export type DocPermissionCreateInput = {
    id?: string;
    role: $Enums.DocRole;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutPermissionsInput;
    user: Prisma.UserCreateNestedOneWithoutDocPermissionsReceivedInput;
    grantedBy: Prisma.UserCreateNestedOneWithoutDocPermissionsGrantedInput;
};
export type DocPermissionUncheckedCreateInput = {
    id?: string;
    docId: string;
    userId: string;
    role: $Enums.DocRole;
    grantedById: string;
    createdAt?: Date | string;
};
export type DocPermissionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutPermissionsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutDocPermissionsReceivedNestedInput;
    grantedBy?: Prisma.UserUpdateOneRequiredWithoutDocPermissionsGrantedNestedInput;
};
export type DocPermissionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    grantedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionCreateManyInput = {
    id?: string;
    docId: string;
    userId: string;
    role: $Enums.DocRole;
    grantedById: string;
    createdAt?: Date | string;
};
export type DocPermissionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    grantedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionListRelationFilter = {
    every?: Prisma.DocPermissionWhereInput;
    some?: Prisma.DocPermissionWhereInput;
    none?: Prisma.DocPermissionWhereInput;
};
export type DocPermissionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocPermissionDocIdUserIdCompoundUniqueInput = {
    docId: string;
    userId: string;
};
export type DocPermissionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    grantedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocPermissionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    grantedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocPermissionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    grantedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocPermissionCreateNestedManyWithoutGrantedByInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutGrantedByInput, Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput> | Prisma.DocPermissionCreateWithoutGrantedByInput[] | Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput | Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput[];
    createMany?: Prisma.DocPermissionCreateManyGrantedByInputEnvelope;
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
};
export type DocPermissionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutUserInput, Prisma.DocPermissionUncheckedCreateWithoutUserInput> | Prisma.DocPermissionCreateWithoutUserInput[] | Prisma.DocPermissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutUserInput | Prisma.DocPermissionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DocPermissionCreateManyUserInputEnvelope;
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
};
export type DocPermissionUncheckedCreateNestedManyWithoutGrantedByInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutGrantedByInput, Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput> | Prisma.DocPermissionCreateWithoutGrantedByInput[] | Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput | Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput[];
    createMany?: Prisma.DocPermissionCreateManyGrantedByInputEnvelope;
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
};
export type DocPermissionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutUserInput, Prisma.DocPermissionUncheckedCreateWithoutUserInput> | Prisma.DocPermissionCreateWithoutUserInput[] | Prisma.DocPermissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutUserInput | Prisma.DocPermissionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DocPermissionCreateManyUserInputEnvelope;
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
};
export type DocPermissionUpdateManyWithoutGrantedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutGrantedByInput, Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput> | Prisma.DocPermissionCreateWithoutGrantedByInput[] | Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput | Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput[];
    upsert?: Prisma.DocPermissionUpsertWithWhereUniqueWithoutGrantedByInput | Prisma.DocPermissionUpsertWithWhereUniqueWithoutGrantedByInput[];
    createMany?: Prisma.DocPermissionCreateManyGrantedByInputEnvelope;
    set?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    disconnect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    delete?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    update?: Prisma.DocPermissionUpdateWithWhereUniqueWithoutGrantedByInput | Prisma.DocPermissionUpdateWithWhereUniqueWithoutGrantedByInput[];
    updateMany?: Prisma.DocPermissionUpdateManyWithWhereWithoutGrantedByInput | Prisma.DocPermissionUpdateManyWithWhereWithoutGrantedByInput[];
    deleteMany?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
};
export type DocPermissionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutUserInput, Prisma.DocPermissionUncheckedCreateWithoutUserInput> | Prisma.DocPermissionCreateWithoutUserInput[] | Prisma.DocPermissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutUserInput | Prisma.DocPermissionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DocPermissionUpsertWithWhereUniqueWithoutUserInput | Prisma.DocPermissionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DocPermissionCreateManyUserInputEnvelope;
    set?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    disconnect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    delete?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    update?: Prisma.DocPermissionUpdateWithWhereUniqueWithoutUserInput | Prisma.DocPermissionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DocPermissionUpdateManyWithWhereWithoutUserInput | Prisma.DocPermissionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
};
export type DocPermissionUncheckedUpdateManyWithoutGrantedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutGrantedByInput, Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput> | Prisma.DocPermissionCreateWithoutGrantedByInput[] | Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput | Prisma.DocPermissionCreateOrConnectWithoutGrantedByInput[];
    upsert?: Prisma.DocPermissionUpsertWithWhereUniqueWithoutGrantedByInput | Prisma.DocPermissionUpsertWithWhereUniqueWithoutGrantedByInput[];
    createMany?: Prisma.DocPermissionCreateManyGrantedByInputEnvelope;
    set?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    disconnect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    delete?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    update?: Prisma.DocPermissionUpdateWithWhereUniqueWithoutGrantedByInput | Prisma.DocPermissionUpdateWithWhereUniqueWithoutGrantedByInput[];
    updateMany?: Prisma.DocPermissionUpdateManyWithWhereWithoutGrantedByInput | Prisma.DocPermissionUpdateManyWithWhereWithoutGrantedByInput[];
    deleteMany?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
};
export type DocPermissionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutUserInput, Prisma.DocPermissionUncheckedCreateWithoutUserInput> | Prisma.DocPermissionCreateWithoutUserInput[] | Prisma.DocPermissionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutUserInput | Prisma.DocPermissionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DocPermissionUpsertWithWhereUniqueWithoutUserInput | Prisma.DocPermissionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DocPermissionCreateManyUserInputEnvelope;
    set?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    disconnect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    delete?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    update?: Prisma.DocPermissionUpdateWithWhereUniqueWithoutUserInput | Prisma.DocPermissionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DocPermissionUpdateManyWithWhereWithoutUserInput | Prisma.DocPermissionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
};
export type DocPermissionCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutDocInput, Prisma.DocPermissionUncheckedCreateWithoutDocInput> | Prisma.DocPermissionCreateWithoutDocInput[] | Prisma.DocPermissionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutDocInput | Prisma.DocPermissionCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocPermissionCreateManyDocInputEnvelope;
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
};
export type DocPermissionUncheckedCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutDocInput, Prisma.DocPermissionUncheckedCreateWithoutDocInput> | Prisma.DocPermissionCreateWithoutDocInput[] | Prisma.DocPermissionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutDocInput | Prisma.DocPermissionCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocPermissionCreateManyDocInputEnvelope;
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
};
export type DocPermissionUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutDocInput, Prisma.DocPermissionUncheckedCreateWithoutDocInput> | Prisma.DocPermissionCreateWithoutDocInput[] | Prisma.DocPermissionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutDocInput | Prisma.DocPermissionCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocPermissionUpsertWithWhereUniqueWithoutDocInput | Prisma.DocPermissionUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocPermissionCreateManyDocInputEnvelope;
    set?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    disconnect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    delete?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    update?: Prisma.DocPermissionUpdateWithWhereUniqueWithoutDocInput | Prisma.DocPermissionUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocPermissionUpdateManyWithWhereWithoutDocInput | Prisma.DocPermissionUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
};
export type DocPermissionUncheckedUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocPermissionCreateWithoutDocInput, Prisma.DocPermissionUncheckedCreateWithoutDocInput> | Prisma.DocPermissionCreateWithoutDocInput[] | Prisma.DocPermissionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocPermissionCreateOrConnectWithoutDocInput | Prisma.DocPermissionCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocPermissionUpsertWithWhereUniqueWithoutDocInput | Prisma.DocPermissionUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocPermissionCreateManyDocInputEnvelope;
    set?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    disconnect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    delete?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    connect?: Prisma.DocPermissionWhereUniqueInput | Prisma.DocPermissionWhereUniqueInput[];
    update?: Prisma.DocPermissionUpdateWithWhereUniqueWithoutDocInput | Prisma.DocPermissionUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocPermissionUpdateManyWithWhereWithoutDocInput | Prisma.DocPermissionUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
};
export type EnumDocRoleFieldUpdateOperationsInput = {
    set?: $Enums.DocRole;
};
export type DocPermissionCreateWithoutGrantedByInput = {
    id?: string;
    role: $Enums.DocRole;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutPermissionsInput;
    user: Prisma.UserCreateNestedOneWithoutDocPermissionsReceivedInput;
};
export type DocPermissionUncheckedCreateWithoutGrantedByInput = {
    id?: string;
    docId: string;
    userId: string;
    role: $Enums.DocRole;
    createdAt?: Date | string;
};
export type DocPermissionCreateOrConnectWithoutGrantedByInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocPermissionCreateWithoutGrantedByInput, Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput>;
};
export type DocPermissionCreateManyGrantedByInputEnvelope = {
    data: Prisma.DocPermissionCreateManyGrantedByInput | Prisma.DocPermissionCreateManyGrantedByInput[];
    skipDuplicates?: boolean;
};
export type DocPermissionCreateWithoutUserInput = {
    id?: string;
    role: $Enums.DocRole;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutPermissionsInput;
    grantedBy: Prisma.UserCreateNestedOneWithoutDocPermissionsGrantedInput;
};
export type DocPermissionUncheckedCreateWithoutUserInput = {
    id?: string;
    docId: string;
    role: $Enums.DocRole;
    grantedById: string;
    createdAt?: Date | string;
};
export type DocPermissionCreateOrConnectWithoutUserInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocPermissionCreateWithoutUserInput, Prisma.DocPermissionUncheckedCreateWithoutUserInput>;
};
export type DocPermissionCreateManyUserInputEnvelope = {
    data: Prisma.DocPermissionCreateManyUserInput | Prisma.DocPermissionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type DocPermissionUpsertWithWhereUniqueWithoutGrantedByInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocPermissionUpdateWithoutGrantedByInput, Prisma.DocPermissionUncheckedUpdateWithoutGrantedByInput>;
    create: Prisma.XOR<Prisma.DocPermissionCreateWithoutGrantedByInput, Prisma.DocPermissionUncheckedCreateWithoutGrantedByInput>;
};
export type DocPermissionUpdateWithWhereUniqueWithoutGrantedByInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocPermissionUpdateWithoutGrantedByInput, Prisma.DocPermissionUncheckedUpdateWithoutGrantedByInput>;
};
export type DocPermissionUpdateManyWithWhereWithoutGrantedByInput = {
    where: Prisma.DocPermissionScalarWhereInput;
    data: Prisma.XOR<Prisma.DocPermissionUpdateManyMutationInput, Prisma.DocPermissionUncheckedUpdateManyWithoutGrantedByInput>;
};
export type DocPermissionScalarWhereInput = {
    AND?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
    OR?: Prisma.DocPermissionScalarWhereInput[];
    NOT?: Prisma.DocPermissionScalarWhereInput | Prisma.DocPermissionScalarWhereInput[];
    id?: Prisma.StringFilter<"DocPermission"> | string;
    docId?: Prisma.StringFilter<"DocPermission"> | string;
    userId?: Prisma.StringFilter<"DocPermission"> | string;
    role?: Prisma.EnumDocRoleFilter<"DocPermission"> | $Enums.DocRole;
    grantedById?: Prisma.StringFilter<"DocPermission"> | string;
    createdAt?: Prisma.DateTimeFilter<"DocPermission"> | Date | string;
};
export type DocPermissionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocPermissionUpdateWithoutUserInput, Prisma.DocPermissionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.DocPermissionCreateWithoutUserInput, Prisma.DocPermissionUncheckedCreateWithoutUserInput>;
};
export type DocPermissionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocPermissionUpdateWithoutUserInput, Prisma.DocPermissionUncheckedUpdateWithoutUserInput>;
};
export type DocPermissionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.DocPermissionScalarWhereInput;
    data: Prisma.XOR<Prisma.DocPermissionUpdateManyMutationInput, Prisma.DocPermissionUncheckedUpdateManyWithoutUserInput>;
};
export type DocPermissionCreateWithoutDocInput = {
    id?: string;
    role: $Enums.DocRole;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutDocPermissionsReceivedInput;
    grantedBy: Prisma.UserCreateNestedOneWithoutDocPermissionsGrantedInput;
};
export type DocPermissionUncheckedCreateWithoutDocInput = {
    id?: string;
    userId: string;
    role: $Enums.DocRole;
    grantedById: string;
    createdAt?: Date | string;
};
export type DocPermissionCreateOrConnectWithoutDocInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocPermissionCreateWithoutDocInput, Prisma.DocPermissionUncheckedCreateWithoutDocInput>;
};
export type DocPermissionCreateManyDocInputEnvelope = {
    data: Prisma.DocPermissionCreateManyDocInput | Prisma.DocPermissionCreateManyDocInput[];
    skipDuplicates?: boolean;
};
export type DocPermissionUpsertWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocPermissionUpdateWithoutDocInput, Prisma.DocPermissionUncheckedUpdateWithoutDocInput>;
    create: Prisma.XOR<Prisma.DocPermissionCreateWithoutDocInput, Prisma.DocPermissionUncheckedCreateWithoutDocInput>;
};
export type DocPermissionUpdateWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocPermissionWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocPermissionUpdateWithoutDocInput, Prisma.DocPermissionUncheckedUpdateWithoutDocInput>;
};
export type DocPermissionUpdateManyWithWhereWithoutDocInput = {
    where: Prisma.DocPermissionScalarWhereInput;
    data: Prisma.XOR<Prisma.DocPermissionUpdateManyMutationInput, Prisma.DocPermissionUncheckedUpdateManyWithoutDocInput>;
};
export type DocPermissionCreateManyGrantedByInput = {
    id?: string;
    docId: string;
    userId: string;
    role: $Enums.DocRole;
    createdAt?: Date | string;
};
export type DocPermissionCreateManyUserInput = {
    id?: string;
    docId: string;
    role: $Enums.DocRole;
    grantedById: string;
    createdAt?: Date | string;
};
export type DocPermissionUpdateWithoutGrantedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutPermissionsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutDocPermissionsReceivedNestedInput;
};
export type DocPermissionUncheckedUpdateWithoutGrantedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionUncheckedUpdateManyWithoutGrantedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutPermissionsNestedInput;
    grantedBy?: Prisma.UserUpdateOneRequiredWithoutDocPermissionsGrantedNestedInput;
};
export type DocPermissionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    grantedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    grantedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionCreateManyDocInput = {
    id?: string;
    userId: string;
    role: $Enums.DocRole;
    grantedById: string;
    createdAt?: Date | string;
};
export type DocPermissionUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutDocPermissionsReceivedNestedInput;
    grantedBy?: Prisma.UserUpdateOneRequiredWithoutDocPermissionsGrantedNestedInput;
};
export type DocPermissionUncheckedUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    grantedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionUncheckedUpdateManyWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumDocRoleFieldUpdateOperationsInput | $Enums.DocRole;
    grantedById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocPermissionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    userId?: boolean;
    role?: boolean;
    grantedById?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    grantedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docPermission"]>;
export type DocPermissionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    userId?: boolean;
    role?: boolean;
    grantedById?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    grantedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docPermission"]>;
export type DocPermissionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    userId?: boolean;
    role?: boolean;
    grantedById?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    grantedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docPermission"]>;
export type DocPermissionSelectScalar = {
    id?: boolean;
    docId?: boolean;
    userId?: boolean;
    role?: boolean;
    grantedById?: boolean;
    createdAt?: boolean;
};
export type DocPermissionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "docId" | "userId" | "role" | "grantedById" | "createdAt", ExtArgs["result"]["docPermission"]>;
export type DocPermissionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    grantedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocPermissionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    grantedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocPermissionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    grantedBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DocPermissionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DocPermission";
    objects: {
        doc: Prisma.$DocPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
        grantedBy: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        docId: string;
        userId: string;
        role: $Enums.DocRole;
        grantedById: string;
        createdAt: Date;
    }, ExtArgs["result"]["docPermission"]>;
    composites: {};
};
export type DocPermissionGetPayload<S extends boolean | null | undefined | DocPermissionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload, S>;
export type DocPermissionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocPermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocPermissionCountAggregateInputType | true;
};
export interface DocPermissionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DocPermission'];
        meta: {
            name: 'DocPermission';
        };
    };
    findUnique<T extends DocPermissionFindUniqueArgs>(args: Prisma.SelectSubset<T, DocPermissionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocPermissionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocPermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocPermissionFindFirstArgs>(args?: Prisma.SelectSubset<T, DocPermissionFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocPermissionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocPermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocPermissionFindManyArgs>(args?: Prisma.SelectSubset<T, DocPermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocPermissionCreateArgs>(args: Prisma.SelectSubset<T, DocPermissionCreateArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocPermissionCreateManyArgs>(args?: Prisma.SelectSubset<T, DocPermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocPermissionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocPermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocPermissionDeleteArgs>(args: Prisma.SelectSubset<T, DocPermissionDeleteArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocPermissionUpdateArgs>(args: Prisma.SelectSubset<T, DocPermissionUpdateArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocPermissionDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocPermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocPermissionUpdateManyArgs>(args: Prisma.SelectSubset<T, DocPermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocPermissionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocPermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocPermissionUpsertArgs>(args: Prisma.SelectSubset<T, DocPermissionUpsertArgs<ExtArgs>>): Prisma.Prisma__DocPermissionClient<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocPermissionCountArgs>(args?: Prisma.Subset<T, DocPermissionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocPermissionCountAggregateOutputType> : number>;
    aggregate<T extends DocPermissionAggregateArgs>(args: Prisma.Subset<T, DocPermissionAggregateArgs>): Prisma.PrismaPromise<GetDocPermissionAggregateType<T>>;
    groupBy<T extends DocPermissionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocPermissionGroupByArgs['orderBy'];
    } : {
        orderBy?: DocPermissionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocPermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocPermissionFieldRefs;
}
export interface Prisma__DocPermissionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    doc<T extends Prisma.DocDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocDefaultArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    grantedBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocPermissionFieldRefs {
    readonly id: Prisma.FieldRef<"DocPermission", 'String'>;
    readonly docId: Prisma.FieldRef<"DocPermission", 'String'>;
    readonly userId: Prisma.FieldRef<"DocPermission", 'String'>;
    readonly role: Prisma.FieldRef<"DocPermission", 'DocRole'>;
    readonly grantedById: Prisma.FieldRef<"DocPermission", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DocPermission", 'DateTime'>;
}
export type DocPermissionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    where: Prisma.DocPermissionWhereUniqueInput;
};
export type DocPermissionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    where: Prisma.DocPermissionWhereUniqueInput;
};
export type DocPermissionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    where?: Prisma.DocPermissionWhereInput;
    orderBy?: Prisma.DocPermissionOrderByWithRelationInput | Prisma.DocPermissionOrderByWithRelationInput[];
    cursor?: Prisma.DocPermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocPermissionScalarFieldEnum | Prisma.DocPermissionScalarFieldEnum[];
};
export type DocPermissionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    where?: Prisma.DocPermissionWhereInput;
    orderBy?: Prisma.DocPermissionOrderByWithRelationInput | Prisma.DocPermissionOrderByWithRelationInput[];
    cursor?: Prisma.DocPermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocPermissionScalarFieldEnum | Prisma.DocPermissionScalarFieldEnum[];
};
export type DocPermissionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    where?: Prisma.DocPermissionWhereInput;
    orderBy?: Prisma.DocPermissionOrderByWithRelationInput | Prisma.DocPermissionOrderByWithRelationInput[];
    cursor?: Prisma.DocPermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocPermissionScalarFieldEnum | Prisma.DocPermissionScalarFieldEnum[];
};
export type DocPermissionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocPermissionCreateInput, Prisma.DocPermissionUncheckedCreateInput>;
};
export type DocPermissionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocPermissionCreateManyInput | Prisma.DocPermissionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocPermissionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    data: Prisma.DocPermissionCreateManyInput | Prisma.DocPermissionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DocPermissionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DocPermissionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocPermissionUpdateInput, Prisma.DocPermissionUncheckedUpdateInput>;
    where: Prisma.DocPermissionWhereUniqueInput;
};
export type DocPermissionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocPermissionUpdateManyMutationInput, Prisma.DocPermissionUncheckedUpdateManyInput>;
    where?: Prisma.DocPermissionWhereInput;
    limit?: number;
};
export type DocPermissionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocPermissionUpdateManyMutationInput, Prisma.DocPermissionUncheckedUpdateManyInput>;
    where?: Prisma.DocPermissionWhereInput;
    limit?: number;
    include?: Prisma.DocPermissionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DocPermissionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    where: Prisma.DocPermissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocPermissionCreateInput, Prisma.DocPermissionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocPermissionUpdateInput, Prisma.DocPermissionUncheckedUpdateInput>;
};
export type DocPermissionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
    where: Prisma.DocPermissionWhereUniqueInput;
};
export type DocPermissionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocPermissionWhereInput;
    limit?: number;
};
export type DocPermissionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocPermissionSelect<ExtArgs> | null;
    omit?: Prisma.DocPermissionOmit<ExtArgs> | null;
    include?: Prisma.DocPermissionInclude<ExtArgs> | null;
};
