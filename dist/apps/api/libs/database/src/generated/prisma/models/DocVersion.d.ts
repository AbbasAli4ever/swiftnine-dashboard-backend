import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type DocVersionModel = runtime.Types.Result.DefaultSelection<Prisma.$DocVersionPayload>;
export type AggregateDocVersion = {
    _count: DocVersionCountAggregateOutputType | null;
    _min: DocVersionMinAggregateOutputType | null;
    _max: DocVersionMaxAggregateOutputType | null;
};
export type DocVersionMinAggregateOutputType = {
    id: string | null;
    docId: string | null;
    type: $Enums.DocVersionType | null;
    label: string | null;
    createdAt: Date | null;
    createdById: string | null;
};
export type DocVersionMaxAggregateOutputType = {
    id: string | null;
    docId: string | null;
    type: $Enums.DocVersionType | null;
    label: string | null;
    createdAt: Date | null;
    createdById: string | null;
};
export type DocVersionCountAggregateOutputType = {
    id: number;
    docId: number;
    contentJson: number;
    type: number;
    label: number;
    createdAt: number;
    createdById: number;
    _all: number;
};
export type DocVersionMinAggregateInputType = {
    id?: true;
    docId?: true;
    type?: true;
    label?: true;
    createdAt?: true;
    createdById?: true;
};
export type DocVersionMaxAggregateInputType = {
    id?: true;
    docId?: true;
    type?: true;
    label?: true;
    createdAt?: true;
    createdById?: true;
};
export type DocVersionCountAggregateInputType = {
    id?: true;
    docId?: true;
    contentJson?: true;
    type?: true;
    label?: true;
    createdAt?: true;
    createdById?: true;
    _all?: true;
};
export type DocVersionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocVersionWhereInput;
    orderBy?: Prisma.DocVersionOrderByWithRelationInput | Prisma.DocVersionOrderByWithRelationInput[];
    cursor?: Prisma.DocVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocVersionCountAggregateInputType;
    _min?: DocVersionMinAggregateInputType;
    _max?: DocVersionMaxAggregateInputType;
};
export type GetDocVersionAggregateType<T extends DocVersionAggregateArgs> = {
    [P in keyof T & keyof AggregateDocVersion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocVersion[P]> : Prisma.GetScalarType<T[P], AggregateDocVersion[P]>;
};
export type DocVersionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocVersionWhereInput;
    orderBy?: Prisma.DocVersionOrderByWithAggregationInput | Prisma.DocVersionOrderByWithAggregationInput[];
    by: Prisma.DocVersionScalarFieldEnum[] | Prisma.DocVersionScalarFieldEnum;
    having?: Prisma.DocVersionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocVersionCountAggregateInputType | true;
    _min?: DocVersionMinAggregateInputType;
    _max?: DocVersionMaxAggregateInputType;
};
export type DocVersionGroupByOutputType = {
    id: string;
    docId: string;
    contentJson: runtime.JsonValue;
    type: $Enums.DocVersionType;
    label: string | null;
    createdAt: Date;
    createdById: string;
    _count: DocVersionCountAggregateOutputType | null;
    _min: DocVersionMinAggregateOutputType | null;
    _max: DocVersionMaxAggregateOutputType | null;
};
export type GetDocVersionGroupByPayload<T extends DocVersionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocVersionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocVersionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocVersionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocVersionGroupByOutputType[P]>;
}>>;
export type DocVersionWhereInput = {
    AND?: Prisma.DocVersionWhereInput | Prisma.DocVersionWhereInput[];
    OR?: Prisma.DocVersionWhereInput[];
    NOT?: Prisma.DocVersionWhereInput | Prisma.DocVersionWhereInput[];
    id?: Prisma.StringFilter<"DocVersion"> | string;
    docId?: Prisma.StringFilter<"DocVersion"> | string;
    contentJson?: Prisma.JsonFilter<"DocVersion">;
    type?: Prisma.EnumDocVersionTypeFilter<"DocVersion"> | $Enums.DocVersionType;
    label?: Prisma.StringNullableFilter<"DocVersion"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocVersion"> | Date | string;
    createdById?: Prisma.StringFilter<"DocVersion"> | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type DocVersionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    contentJson?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    doc?: Prisma.DocOrderByWithRelationInput;
    createdBy?: Prisma.UserOrderByWithRelationInput;
};
export type DocVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DocVersionWhereInput | Prisma.DocVersionWhereInput[];
    OR?: Prisma.DocVersionWhereInput[];
    NOT?: Prisma.DocVersionWhereInput | Prisma.DocVersionWhereInput[];
    docId?: Prisma.StringFilter<"DocVersion"> | string;
    contentJson?: Prisma.JsonFilter<"DocVersion">;
    type?: Prisma.EnumDocVersionTypeFilter<"DocVersion"> | $Enums.DocVersionType;
    label?: Prisma.StringNullableFilter<"DocVersion"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocVersion"> | Date | string;
    createdById?: Prisma.StringFilter<"DocVersion"> | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type DocVersionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    contentJson?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    _count?: Prisma.DocVersionCountOrderByAggregateInput;
    _max?: Prisma.DocVersionMaxOrderByAggregateInput;
    _min?: Prisma.DocVersionMinOrderByAggregateInput;
};
export type DocVersionScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocVersionScalarWhereWithAggregatesInput | Prisma.DocVersionScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocVersionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocVersionScalarWhereWithAggregatesInput | Prisma.DocVersionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DocVersion"> | string;
    docId?: Prisma.StringWithAggregatesFilter<"DocVersion"> | string;
    contentJson?: Prisma.JsonWithAggregatesFilter<"DocVersion">;
    type?: Prisma.EnumDocVersionTypeWithAggregatesFilter<"DocVersion"> | $Enums.DocVersionType;
    label?: Prisma.StringNullableWithAggregatesFilter<"DocVersion"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DocVersion"> | Date | string;
    createdById?: Prisma.StringWithAggregatesFilter<"DocVersion"> | string;
};
export type DocVersionCreateInput = {
    id?: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutVersionsInput;
    createdBy: Prisma.UserCreateNestedOneWithoutDocVersionsCreatedInput;
};
export type DocVersionUncheckedCreateInput = {
    id?: string;
    docId: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
    createdById: string;
};
export type DocVersionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutVersionsNestedInput;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutDocVersionsCreatedNestedInput;
};
export type DocVersionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DocVersionCreateManyInput = {
    id?: string;
    docId: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
    createdById: string;
};
export type DocVersionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocVersionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DocVersionListRelationFilter = {
    every?: Prisma.DocVersionWhereInput;
    some?: Prisma.DocVersionWhereInput;
    none?: Prisma.DocVersionWhereInput;
};
export type DocVersionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocVersionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    contentJson?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
};
export type DocVersionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
};
export type DocVersionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
};
export type DocVersionCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutCreatedByInput, Prisma.DocVersionUncheckedCreateWithoutCreatedByInput> | Prisma.DocVersionCreateWithoutCreatedByInput[] | Prisma.DocVersionUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutCreatedByInput | Prisma.DocVersionCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.DocVersionCreateManyCreatedByInputEnvelope;
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
};
export type DocVersionUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutCreatedByInput, Prisma.DocVersionUncheckedCreateWithoutCreatedByInput> | Prisma.DocVersionCreateWithoutCreatedByInput[] | Prisma.DocVersionUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutCreatedByInput | Prisma.DocVersionCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.DocVersionCreateManyCreatedByInputEnvelope;
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
};
export type DocVersionUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutCreatedByInput, Prisma.DocVersionUncheckedCreateWithoutCreatedByInput> | Prisma.DocVersionCreateWithoutCreatedByInput[] | Prisma.DocVersionUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutCreatedByInput | Prisma.DocVersionCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.DocVersionUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.DocVersionUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.DocVersionCreateManyCreatedByInputEnvelope;
    set?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    disconnect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    delete?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    update?: Prisma.DocVersionUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.DocVersionUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.DocVersionUpdateManyWithWhereWithoutCreatedByInput | Prisma.DocVersionUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.DocVersionScalarWhereInput | Prisma.DocVersionScalarWhereInput[];
};
export type DocVersionUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutCreatedByInput, Prisma.DocVersionUncheckedCreateWithoutCreatedByInput> | Prisma.DocVersionCreateWithoutCreatedByInput[] | Prisma.DocVersionUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutCreatedByInput | Prisma.DocVersionCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.DocVersionUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.DocVersionUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.DocVersionCreateManyCreatedByInputEnvelope;
    set?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    disconnect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    delete?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    update?: Prisma.DocVersionUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.DocVersionUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.DocVersionUpdateManyWithWhereWithoutCreatedByInput | Prisma.DocVersionUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.DocVersionScalarWhereInput | Prisma.DocVersionScalarWhereInput[];
};
export type DocVersionCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutDocInput, Prisma.DocVersionUncheckedCreateWithoutDocInput> | Prisma.DocVersionCreateWithoutDocInput[] | Prisma.DocVersionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutDocInput | Prisma.DocVersionCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocVersionCreateManyDocInputEnvelope;
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
};
export type DocVersionUncheckedCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutDocInput, Prisma.DocVersionUncheckedCreateWithoutDocInput> | Prisma.DocVersionCreateWithoutDocInput[] | Prisma.DocVersionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutDocInput | Prisma.DocVersionCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocVersionCreateManyDocInputEnvelope;
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
};
export type DocVersionUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutDocInput, Prisma.DocVersionUncheckedCreateWithoutDocInput> | Prisma.DocVersionCreateWithoutDocInput[] | Prisma.DocVersionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutDocInput | Prisma.DocVersionCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocVersionUpsertWithWhereUniqueWithoutDocInput | Prisma.DocVersionUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocVersionCreateManyDocInputEnvelope;
    set?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    disconnect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    delete?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    update?: Prisma.DocVersionUpdateWithWhereUniqueWithoutDocInput | Prisma.DocVersionUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocVersionUpdateManyWithWhereWithoutDocInput | Prisma.DocVersionUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocVersionScalarWhereInput | Prisma.DocVersionScalarWhereInput[];
};
export type DocVersionUncheckedUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocVersionCreateWithoutDocInput, Prisma.DocVersionUncheckedCreateWithoutDocInput> | Prisma.DocVersionCreateWithoutDocInput[] | Prisma.DocVersionUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocVersionCreateOrConnectWithoutDocInput | Prisma.DocVersionCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocVersionUpsertWithWhereUniqueWithoutDocInput | Prisma.DocVersionUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocVersionCreateManyDocInputEnvelope;
    set?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    disconnect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    delete?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    connect?: Prisma.DocVersionWhereUniqueInput | Prisma.DocVersionWhereUniqueInput[];
    update?: Prisma.DocVersionUpdateWithWhereUniqueWithoutDocInput | Prisma.DocVersionUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocVersionUpdateManyWithWhereWithoutDocInput | Prisma.DocVersionUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocVersionScalarWhereInput | Prisma.DocVersionScalarWhereInput[];
};
export type EnumDocVersionTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocVersionType;
};
export type DocVersionCreateWithoutCreatedByInput = {
    id?: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutVersionsInput;
};
export type DocVersionUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    docId: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
};
export type DocVersionCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.DocVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocVersionCreateWithoutCreatedByInput, Prisma.DocVersionUncheckedCreateWithoutCreatedByInput>;
};
export type DocVersionCreateManyCreatedByInputEnvelope = {
    data: Prisma.DocVersionCreateManyCreatedByInput | Prisma.DocVersionCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type DocVersionUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.DocVersionWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocVersionUpdateWithoutCreatedByInput, Prisma.DocVersionUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.DocVersionCreateWithoutCreatedByInput, Prisma.DocVersionUncheckedCreateWithoutCreatedByInput>;
};
export type DocVersionUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.DocVersionWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocVersionUpdateWithoutCreatedByInput, Prisma.DocVersionUncheckedUpdateWithoutCreatedByInput>;
};
export type DocVersionUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.DocVersionScalarWhereInput;
    data: Prisma.XOR<Prisma.DocVersionUpdateManyMutationInput, Prisma.DocVersionUncheckedUpdateManyWithoutCreatedByInput>;
};
export type DocVersionScalarWhereInput = {
    AND?: Prisma.DocVersionScalarWhereInput | Prisma.DocVersionScalarWhereInput[];
    OR?: Prisma.DocVersionScalarWhereInput[];
    NOT?: Prisma.DocVersionScalarWhereInput | Prisma.DocVersionScalarWhereInput[];
    id?: Prisma.StringFilter<"DocVersion"> | string;
    docId?: Prisma.StringFilter<"DocVersion"> | string;
    contentJson?: Prisma.JsonFilter<"DocVersion">;
    type?: Prisma.EnumDocVersionTypeFilter<"DocVersion"> | $Enums.DocVersionType;
    label?: Prisma.StringNullableFilter<"DocVersion"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocVersion"> | Date | string;
    createdById?: Prisma.StringFilter<"DocVersion"> | string;
};
export type DocVersionCreateWithoutDocInput = {
    id?: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutDocVersionsCreatedInput;
};
export type DocVersionUncheckedCreateWithoutDocInput = {
    id?: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
    createdById: string;
};
export type DocVersionCreateOrConnectWithoutDocInput = {
    where: Prisma.DocVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocVersionCreateWithoutDocInput, Prisma.DocVersionUncheckedCreateWithoutDocInput>;
};
export type DocVersionCreateManyDocInputEnvelope = {
    data: Prisma.DocVersionCreateManyDocInput | Prisma.DocVersionCreateManyDocInput[];
    skipDuplicates?: boolean;
};
export type DocVersionUpsertWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocVersionWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocVersionUpdateWithoutDocInput, Prisma.DocVersionUncheckedUpdateWithoutDocInput>;
    create: Prisma.XOR<Prisma.DocVersionCreateWithoutDocInput, Prisma.DocVersionUncheckedCreateWithoutDocInput>;
};
export type DocVersionUpdateWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocVersionWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocVersionUpdateWithoutDocInput, Prisma.DocVersionUncheckedUpdateWithoutDocInput>;
};
export type DocVersionUpdateManyWithWhereWithoutDocInput = {
    where: Prisma.DocVersionScalarWhereInput;
    data: Prisma.XOR<Prisma.DocVersionUpdateManyMutationInput, Prisma.DocVersionUncheckedUpdateManyWithoutDocInput>;
};
export type DocVersionCreateManyCreatedByInput = {
    id?: string;
    docId: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
};
export type DocVersionUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutVersionsNestedInput;
};
export type DocVersionUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocVersionUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocVersionCreateManyDocInput = {
    id?: string;
    contentJson: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type: $Enums.DocVersionType;
    label?: string | null;
    createdAt?: Date | string;
    createdById: string;
};
export type DocVersionUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutDocVersionsCreatedNestedInput;
};
export type DocVersionUncheckedUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DocVersionUncheckedUpdateManyWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    type?: Prisma.EnumDocVersionTypeFieldUpdateOperationsInput | $Enums.DocVersionType;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DocVersionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    contentJson?: boolean;
    type?: boolean;
    label?: boolean;
    createdAt?: boolean;
    createdById?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docVersion"]>;
export type DocVersionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    contentJson?: boolean;
    type?: boolean;
    label?: boolean;
    createdAt?: boolean;
    createdById?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docVersion"]>;
export type DocVersionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    contentJson?: boolean;
    type?: boolean;
    label?: boolean;
    createdAt?: boolean;
    createdById?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docVersion"]>;
export type DocVersionSelectScalar = {
    id?: boolean;
    docId?: boolean;
    contentJson?: boolean;
    type?: boolean;
    label?: boolean;
    createdAt?: boolean;
    createdById?: boolean;
};
export type DocVersionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "docId" | "contentJson" | "type" | "label" | "createdAt" | "createdById", ExtArgs["result"]["docVersion"]>;
export type DocVersionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocVersionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocVersionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DocVersionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DocVersion";
    objects: {
        doc: Prisma.$DocPayload<ExtArgs>;
        createdBy: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        docId: string;
        contentJson: runtime.JsonValue;
        type: $Enums.DocVersionType;
        label: string | null;
        createdAt: Date;
        createdById: string;
    }, ExtArgs["result"]["docVersion"]>;
    composites: {};
};
export type DocVersionGetPayload<S extends boolean | null | undefined | DocVersionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocVersionPayload, S>;
export type DocVersionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocVersionCountAggregateInputType | true;
};
export interface DocVersionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DocVersion'];
        meta: {
            name: 'DocVersion';
        };
    };
    findUnique<T extends DocVersionFindUniqueArgs>(args: Prisma.SelectSubset<T, DocVersionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocVersionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocVersionFindFirstArgs>(args?: Prisma.SelectSubset<T, DocVersionFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocVersionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocVersionFindManyArgs>(args?: Prisma.SelectSubset<T, DocVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocVersionCreateArgs>(args: Prisma.SelectSubset<T, DocVersionCreateArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocVersionCreateManyArgs>(args?: Prisma.SelectSubset<T, DocVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocVersionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocVersionDeleteArgs>(args: Prisma.SelectSubset<T, DocVersionDeleteArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocVersionUpdateArgs>(args: Prisma.SelectSubset<T, DocVersionUpdateArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocVersionDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocVersionUpdateManyArgs>(args: Prisma.SelectSubset<T, DocVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocVersionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocVersionUpsertArgs>(args: Prisma.SelectSubset<T, DocVersionUpsertArgs<ExtArgs>>): Prisma.Prisma__DocVersionClient<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocVersionCountArgs>(args?: Prisma.Subset<T, DocVersionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocVersionCountAggregateOutputType> : number>;
    aggregate<T extends DocVersionAggregateArgs>(args: Prisma.Subset<T, DocVersionAggregateArgs>): Prisma.PrismaPromise<GetDocVersionAggregateType<T>>;
    groupBy<T extends DocVersionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocVersionGroupByArgs['orderBy'];
    } : {
        orderBy?: DocVersionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocVersionFieldRefs;
}
export interface Prisma__DocVersionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    doc<T extends Prisma.DocDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocDefaultArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocVersionFieldRefs {
    readonly id: Prisma.FieldRef<"DocVersion", 'String'>;
    readonly docId: Prisma.FieldRef<"DocVersion", 'String'>;
    readonly contentJson: Prisma.FieldRef<"DocVersion", 'Json'>;
    readonly type: Prisma.FieldRef<"DocVersion", 'DocVersionType'>;
    readonly label: Prisma.FieldRef<"DocVersion", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DocVersion", 'DateTime'>;
    readonly createdById: Prisma.FieldRef<"DocVersion", 'String'>;
}
export type DocVersionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    where: Prisma.DocVersionWhereUniqueInput;
};
export type DocVersionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    where: Prisma.DocVersionWhereUniqueInput;
};
export type DocVersionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    where?: Prisma.DocVersionWhereInput;
    orderBy?: Prisma.DocVersionOrderByWithRelationInput | Prisma.DocVersionOrderByWithRelationInput[];
    cursor?: Prisma.DocVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocVersionScalarFieldEnum | Prisma.DocVersionScalarFieldEnum[];
};
export type DocVersionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    where?: Prisma.DocVersionWhereInput;
    orderBy?: Prisma.DocVersionOrderByWithRelationInput | Prisma.DocVersionOrderByWithRelationInput[];
    cursor?: Prisma.DocVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocVersionScalarFieldEnum | Prisma.DocVersionScalarFieldEnum[];
};
export type DocVersionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    where?: Prisma.DocVersionWhereInput;
    orderBy?: Prisma.DocVersionOrderByWithRelationInput | Prisma.DocVersionOrderByWithRelationInput[];
    cursor?: Prisma.DocVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocVersionScalarFieldEnum | Prisma.DocVersionScalarFieldEnum[];
};
export type DocVersionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocVersionCreateInput, Prisma.DocVersionUncheckedCreateInput>;
};
export type DocVersionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocVersionCreateManyInput | Prisma.DocVersionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocVersionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    data: Prisma.DocVersionCreateManyInput | Prisma.DocVersionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DocVersionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DocVersionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocVersionUpdateInput, Prisma.DocVersionUncheckedUpdateInput>;
    where: Prisma.DocVersionWhereUniqueInput;
};
export type DocVersionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocVersionUpdateManyMutationInput, Prisma.DocVersionUncheckedUpdateManyInput>;
    where?: Prisma.DocVersionWhereInput;
    limit?: number;
};
export type DocVersionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocVersionUpdateManyMutationInput, Prisma.DocVersionUncheckedUpdateManyInput>;
    where?: Prisma.DocVersionWhereInput;
    limit?: number;
    include?: Prisma.DocVersionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DocVersionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    where: Prisma.DocVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocVersionCreateInput, Prisma.DocVersionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocVersionUpdateInput, Prisma.DocVersionUncheckedUpdateInput>;
};
export type DocVersionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
    where: Prisma.DocVersionWhereUniqueInput;
};
export type DocVersionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocVersionWhereInput;
    limit?: number;
};
export type DocVersionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocVersionOmit<ExtArgs> | null;
    include?: Prisma.DocVersionInclude<ExtArgs> | null;
};
