import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type DocCommentThreadModel = runtime.Types.Result.DefaultSelection<Prisma.$DocCommentThreadPayload>;
export type AggregateDocCommentThread = {
    _count: DocCommentThreadCountAggregateOutputType | null;
    _min: DocCommentThreadMinAggregateOutputType | null;
    _max: DocCommentThreadMaxAggregateOutputType | null;
};
export type DocCommentThreadMinAggregateOutputType = {
    id: string | null;
    docId: string | null;
    anchorBlockId: string | null;
    resolved: boolean | null;
    isOrphan: boolean | null;
    createdById: string | null;
    createdAt: Date | null;
};
export type DocCommentThreadMaxAggregateOutputType = {
    id: string | null;
    docId: string | null;
    anchorBlockId: string | null;
    resolved: boolean | null;
    isOrphan: boolean | null;
    createdById: string | null;
    createdAt: Date | null;
};
export type DocCommentThreadCountAggregateOutputType = {
    id: number;
    docId: number;
    anchorBlockId: number;
    anchorMeta: number;
    resolved: number;
    isOrphan: number;
    createdById: number;
    createdAt: number;
    _all: number;
};
export type DocCommentThreadMinAggregateInputType = {
    id?: true;
    docId?: true;
    anchorBlockId?: true;
    resolved?: true;
    isOrphan?: true;
    createdById?: true;
    createdAt?: true;
};
export type DocCommentThreadMaxAggregateInputType = {
    id?: true;
    docId?: true;
    anchorBlockId?: true;
    resolved?: true;
    isOrphan?: true;
    createdById?: true;
    createdAt?: true;
};
export type DocCommentThreadCountAggregateInputType = {
    id?: true;
    docId?: true;
    anchorBlockId?: true;
    anchorMeta?: true;
    resolved?: true;
    isOrphan?: true;
    createdById?: true;
    createdAt?: true;
    _all?: true;
};
export type DocCommentThreadAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentThreadWhereInput;
    orderBy?: Prisma.DocCommentThreadOrderByWithRelationInput | Prisma.DocCommentThreadOrderByWithRelationInput[];
    cursor?: Prisma.DocCommentThreadWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocCommentThreadCountAggregateInputType;
    _min?: DocCommentThreadMinAggregateInputType;
    _max?: DocCommentThreadMaxAggregateInputType;
};
export type GetDocCommentThreadAggregateType<T extends DocCommentThreadAggregateArgs> = {
    [P in keyof T & keyof AggregateDocCommentThread]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocCommentThread[P]> : Prisma.GetScalarType<T[P], AggregateDocCommentThread[P]>;
};
export type DocCommentThreadGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentThreadWhereInput;
    orderBy?: Prisma.DocCommentThreadOrderByWithAggregationInput | Prisma.DocCommentThreadOrderByWithAggregationInput[];
    by: Prisma.DocCommentThreadScalarFieldEnum[] | Prisma.DocCommentThreadScalarFieldEnum;
    having?: Prisma.DocCommentThreadScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocCommentThreadCountAggregateInputType | true;
    _min?: DocCommentThreadMinAggregateInputType;
    _max?: DocCommentThreadMaxAggregateInputType;
};
export type DocCommentThreadGroupByOutputType = {
    id: string;
    docId: string;
    anchorBlockId: string | null;
    anchorMeta: runtime.JsonValue | null;
    resolved: boolean;
    isOrphan: boolean;
    createdById: string;
    createdAt: Date;
    _count: DocCommentThreadCountAggregateOutputType | null;
    _min: DocCommentThreadMinAggregateOutputType | null;
    _max: DocCommentThreadMaxAggregateOutputType | null;
};
export type GetDocCommentThreadGroupByPayload<T extends DocCommentThreadGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocCommentThreadGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocCommentThreadGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocCommentThreadGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocCommentThreadGroupByOutputType[P]>;
}>>;
export type DocCommentThreadWhereInput = {
    AND?: Prisma.DocCommentThreadWhereInput | Prisma.DocCommentThreadWhereInput[];
    OR?: Prisma.DocCommentThreadWhereInput[];
    NOT?: Prisma.DocCommentThreadWhereInput | Prisma.DocCommentThreadWhereInput[];
    id?: Prisma.StringFilter<"DocCommentThread"> | string;
    docId?: Prisma.StringFilter<"DocCommentThread"> | string;
    anchorBlockId?: Prisma.StringNullableFilter<"DocCommentThread"> | string | null;
    anchorMeta?: Prisma.JsonNullableFilter<"DocCommentThread">;
    resolved?: Prisma.BoolFilter<"DocCommentThread"> | boolean;
    isOrphan?: Prisma.BoolFilter<"DocCommentThread"> | boolean;
    createdById?: Prisma.StringFilter<"DocCommentThread"> | string;
    createdAt?: Prisma.DateTimeFilter<"DocCommentThread"> | Date | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    comments?: Prisma.DocCommentListRelationFilter;
};
export type DocCommentThreadOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    anchorBlockId?: Prisma.SortOrderInput | Prisma.SortOrder;
    anchorMeta?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    isOrphan?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    doc?: Prisma.DocOrderByWithRelationInput;
    createdBy?: Prisma.UserOrderByWithRelationInput;
    comments?: Prisma.DocCommentOrderByRelationAggregateInput;
};
export type DocCommentThreadWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DocCommentThreadWhereInput | Prisma.DocCommentThreadWhereInput[];
    OR?: Prisma.DocCommentThreadWhereInput[];
    NOT?: Prisma.DocCommentThreadWhereInput | Prisma.DocCommentThreadWhereInput[];
    docId?: Prisma.StringFilter<"DocCommentThread"> | string;
    anchorBlockId?: Prisma.StringNullableFilter<"DocCommentThread"> | string | null;
    anchorMeta?: Prisma.JsonNullableFilter<"DocCommentThread">;
    resolved?: Prisma.BoolFilter<"DocCommentThread"> | boolean;
    isOrphan?: Prisma.BoolFilter<"DocCommentThread"> | boolean;
    createdById?: Prisma.StringFilter<"DocCommentThread"> | string;
    createdAt?: Prisma.DateTimeFilter<"DocCommentThread"> | Date | string;
    doc?: Prisma.XOR<Prisma.DocScalarRelationFilter, Prisma.DocWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    comments?: Prisma.DocCommentListRelationFilter;
}, "id">;
export type DocCommentThreadOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    anchorBlockId?: Prisma.SortOrderInput | Prisma.SortOrder;
    anchorMeta?: Prisma.SortOrderInput | Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    isOrphan?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.DocCommentThreadCountOrderByAggregateInput;
    _max?: Prisma.DocCommentThreadMaxOrderByAggregateInput;
    _min?: Prisma.DocCommentThreadMinOrderByAggregateInput;
};
export type DocCommentThreadScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocCommentThreadScalarWhereWithAggregatesInput | Prisma.DocCommentThreadScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocCommentThreadScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocCommentThreadScalarWhereWithAggregatesInput | Prisma.DocCommentThreadScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DocCommentThread"> | string;
    docId?: Prisma.StringWithAggregatesFilter<"DocCommentThread"> | string;
    anchorBlockId?: Prisma.StringNullableWithAggregatesFilter<"DocCommentThread"> | string | null;
    anchorMeta?: Prisma.JsonNullableWithAggregatesFilter<"DocCommentThread">;
    resolved?: Prisma.BoolWithAggregatesFilter<"DocCommentThread"> | boolean;
    isOrphan?: Prisma.BoolWithAggregatesFilter<"DocCommentThread"> | boolean;
    createdById?: Prisma.StringWithAggregatesFilter<"DocCommentThread"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DocCommentThread"> | Date | string;
};
export type DocCommentThreadCreateInput = {
    id?: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutThreadsInput;
    createdBy: Prisma.UserCreateNestedOneWithoutDocThreadsCreatedInput;
    comments?: Prisma.DocCommentCreateNestedManyWithoutThreadInput;
};
export type DocCommentThreadUncheckedCreateInput = {
    id?: string;
    docId: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById: string;
    createdAt?: Date | string;
    comments?: Prisma.DocCommentUncheckedCreateNestedManyWithoutThreadInput;
};
export type DocCommentThreadUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutThreadsNestedInput;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutDocThreadsCreatedNestedInput;
    comments?: Prisma.DocCommentUpdateManyWithoutThreadNestedInput;
};
export type DocCommentThreadUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    comments?: Prisma.DocCommentUncheckedUpdateManyWithoutThreadNestedInput;
};
export type DocCommentThreadCreateManyInput = {
    id?: string;
    docId: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById: string;
    createdAt?: Date | string;
};
export type DocCommentThreadUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocCommentThreadUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocCommentThreadListRelationFilter = {
    every?: Prisma.DocCommentThreadWhereInput;
    some?: Prisma.DocCommentThreadWhereInput;
    none?: Prisma.DocCommentThreadWhereInput;
};
export type DocCommentThreadOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocCommentThreadCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    anchorBlockId?: Prisma.SortOrder;
    anchorMeta?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    isOrphan?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocCommentThreadMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    anchorBlockId?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    isOrphan?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocCommentThreadMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    docId?: Prisma.SortOrder;
    anchorBlockId?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    isOrphan?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type DocCommentThreadScalarRelationFilter = {
    is?: Prisma.DocCommentThreadWhereInput;
    isNot?: Prisma.DocCommentThreadWhereInput;
};
export type DocCommentThreadCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput> | Prisma.DocCommentThreadCreateWithoutCreatedByInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput | Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.DocCommentThreadCreateManyCreatedByInputEnvelope;
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
};
export type DocCommentThreadUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput> | Prisma.DocCommentThreadCreateWithoutCreatedByInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput | Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.DocCommentThreadCreateManyCreatedByInputEnvelope;
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
};
export type DocCommentThreadUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput> | Prisma.DocCommentThreadCreateWithoutCreatedByInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput | Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.DocCommentThreadCreateManyCreatedByInputEnvelope;
    set?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    disconnect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    delete?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    update?: Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.DocCommentThreadUpdateManyWithWhereWithoutCreatedByInput | Prisma.DocCommentThreadUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.DocCommentThreadScalarWhereInput | Prisma.DocCommentThreadScalarWhereInput[];
};
export type DocCommentThreadUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput> | Prisma.DocCommentThreadCreateWithoutCreatedByInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput | Prisma.DocCommentThreadCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.DocCommentThreadCreateManyCreatedByInputEnvelope;
    set?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    disconnect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    delete?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    update?: Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.DocCommentThreadUpdateManyWithWhereWithoutCreatedByInput | Prisma.DocCommentThreadUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.DocCommentThreadScalarWhereInput | Prisma.DocCommentThreadScalarWhereInput[];
};
export type DocCommentThreadCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutDocInput, Prisma.DocCommentThreadUncheckedCreateWithoutDocInput> | Prisma.DocCommentThreadCreateWithoutDocInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutDocInput | Prisma.DocCommentThreadCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocCommentThreadCreateManyDocInputEnvelope;
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
};
export type DocCommentThreadUncheckedCreateNestedManyWithoutDocInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutDocInput, Prisma.DocCommentThreadUncheckedCreateWithoutDocInput> | Prisma.DocCommentThreadCreateWithoutDocInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutDocInput | Prisma.DocCommentThreadCreateOrConnectWithoutDocInput[];
    createMany?: Prisma.DocCommentThreadCreateManyDocInputEnvelope;
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
};
export type DocCommentThreadUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutDocInput, Prisma.DocCommentThreadUncheckedCreateWithoutDocInput> | Prisma.DocCommentThreadCreateWithoutDocInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutDocInput | Prisma.DocCommentThreadCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutDocInput | Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocCommentThreadCreateManyDocInputEnvelope;
    set?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    disconnect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    delete?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    update?: Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutDocInput | Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocCommentThreadUpdateManyWithWhereWithoutDocInput | Prisma.DocCommentThreadUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocCommentThreadScalarWhereInput | Prisma.DocCommentThreadScalarWhereInput[];
};
export type DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutDocInput, Prisma.DocCommentThreadUncheckedCreateWithoutDocInput> | Prisma.DocCommentThreadCreateWithoutDocInput[] | Prisma.DocCommentThreadUncheckedCreateWithoutDocInput[];
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutDocInput | Prisma.DocCommentThreadCreateOrConnectWithoutDocInput[];
    upsert?: Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutDocInput | Prisma.DocCommentThreadUpsertWithWhereUniqueWithoutDocInput[];
    createMany?: Prisma.DocCommentThreadCreateManyDocInputEnvelope;
    set?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    disconnect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    delete?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    connect?: Prisma.DocCommentThreadWhereUniqueInput | Prisma.DocCommentThreadWhereUniqueInput[];
    update?: Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutDocInput | Prisma.DocCommentThreadUpdateWithWhereUniqueWithoutDocInput[];
    updateMany?: Prisma.DocCommentThreadUpdateManyWithWhereWithoutDocInput | Prisma.DocCommentThreadUpdateManyWithWhereWithoutDocInput[];
    deleteMany?: Prisma.DocCommentThreadScalarWhereInput | Prisma.DocCommentThreadScalarWhereInput[];
};
export type DocCommentThreadCreateNestedOneWithoutCommentsInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCommentsInput, Prisma.DocCommentThreadUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutCommentsInput;
    connect?: Prisma.DocCommentThreadWhereUniqueInput;
};
export type DocCommentThreadUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCommentsInput, Prisma.DocCommentThreadUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: Prisma.DocCommentThreadCreateOrConnectWithoutCommentsInput;
    upsert?: Prisma.DocCommentThreadUpsertWithoutCommentsInput;
    connect?: Prisma.DocCommentThreadWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocCommentThreadUpdateToOneWithWhereWithoutCommentsInput, Prisma.DocCommentThreadUpdateWithoutCommentsInput>, Prisma.DocCommentThreadUncheckedUpdateWithoutCommentsInput>;
};
export type DocCommentThreadCreateWithoutCreatedByInput = {
    id?: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutThreadsInput;
    comments?: Prisma.DocCommentCreateNestedManyWithoutThreadInput;
};
export type DocCommentThreadUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    docId: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdAt?: Date | string;
    comments?: Prisma.DocCommentUncheckedCreateNestedManyWithoutThreadInput;
};
export type DocCommentThreadCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.DocCommentThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput>;
};
export type DocCommentThreadCreateManyCreatedByInputEnvelope = {
    data: Prisma.DocCommentThreadCreateManyCreatedByInput | Prisma.DocCommentThreadCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type DocCommentThreadUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.DocCommentThreadWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocCommentThreadUpdateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedCreateWithoutCreatedByInput>;
};
export type DocCommentThreadUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.DocCommentThreadWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateWithoutCreatedByInput, Prisma.DocCommentThreadUncheckedUpdateWithoutCreatedByInput>;
};
export type DocCommentThreadUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.DocCommentThreadScalarWhereInput;
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateManyMutationInput, Prisma.DocCommentThreadUncheckedUpdateManyWithoutCreatedByInput>;
};
export type DocCommentThreadScalarWhereInput = {
    AND?: Prisma.DocCommentThreadScalarWhereInput | Prisma.DocCommentThreadScalarWhereInput[];
    OR?: Prisma.DocCommentThreadScalarWhereInput[];
    NOT?: Prisma.DocCommentThreadScalarWhereInput | Prisma.DocCommentThreadScalarWhereInput[];
    id?: Prisma.StringFilter<"DocCommentThread"> | string;
    docId?: Prisma.StringFilter<"DocCommentThread"> | string;
    anchorBlockId?: Prisma.StringNullableFilter<"DocCommentThread"> | string | null;
    anchorMeta?: Prisma.JsonNullableFilter<"DocCommentThread">;
    resolved?: Prisma.BoolFilter<"DocCommentThread"> | boolean;
    isOrphan?: Prisma.BoolFilter<"DocCommentThread"> | boolean;
    createdById?: Prisma.StringFilter<"DocCommentThread"> | string;
    createdAt?: Prisma.DateTimeFilter<"DocCommentThread"> | Date | string;
};
export type DocCommentThreadCreateWithoutDocInput = {
    id?: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutDocThreadsCreatedInput;
    comments?: Prisma.DocCommentCreateNestedManyWithoutThreadInput;
};
export type DocCommentThreadUncheckedCreateWithoutDocInput = {
    id?: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById: string;
    createdAt?: Date | string;
    comments?: Prisma.DocCommentUncheckedCreateNestedManyWithoutThreadInput;
};
export type DocCommentThreadCreateOrConnectWithoutDocInput = {
    where: Prisma.DocCommentThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutDocInput, Prisma.DocCommentThreadUncheckedCreateWithoutDocInput>;
};
export type DocCommentThreadCreateManyDocInputEnvelope = {
    data: Prisma.DocCommentThreadCreateManyDocInput | Prisma.DocCommentThreadCreateManyDocInput[];
    skipDuplicates?: boolean;
};
export type DocCommentThreadUpsertWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocCommentThreadWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocCommentThreadUpdateWithoutDocInput, Prisma.DocCommentThreadUncheckedUpdateWithoutDocInput>;
    create: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutDocInput, Prisma.DocCommentThreadUncheckedCreateWithoutDocInput>;
};
export type DocCommentThreadUpdateWithWhereUniqueWithoutDocInput = {
    where: Prisma.DocCommentThreadWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateWithoutDocInput, Prisma.DocCommentThreadUncheckedUpdateWithoutDocInput>;
};
export type DocCommentThreadUpdateManyWithWhereWithoutDocInput = {
    where: Prisma.DocCommentThreadScalarWhereInput;
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateManyMutationInput, Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocInput>;
};
export type DocCommentThreadCreateWithoutCommentsInput = {
    id?: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdAt?: Date | string;
    doc: Prisma.DocCreateNestedOneWithoutThreadsInput;
    createdBy: Prisma.UserCreateNestedOneWithoutDocThreadsCreatedInput;
};
export type DocCommentThreadUncheckedCreateWithoutCommentsInput = {
    id?: string;
    docId: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById: string;
    createdAt?: Date | string;
};
export type DocCommentThreadCreateOrConnectWithoutCommentsInput = {
    where: Prisma.DocCommentThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCommentsInput, Prisma.DocCommentThreadUncheckedCreateWithoutCommentsInput>;
};
export type DocCommentThreadUpsertWithoutCommentsInput = {
    update: Prisma.XOR<Prisma.DocCommentThreadUpdateWithoutCommentsInput, Prisma.DocCommentThreadUncheckedUpdateWithoutCommentsInput>;
    create: Prisma.XOR<Prisma.DocCommentThreadCreateWithoutCommentsInput, Prisma.DocCommentThreadUncheckedCreateWithoutCommentsInput>;
    where?: Prisma.DocCommentThreadWhereInput;
};
export type DocCommentThreadUpdateToOneWithWhereWithoutCommentsInput = {
    where?: Prisma.DocCommentThreadWhereInput;
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateWithoutCommentsInput, Prisma.DocCommentThreadUncheckedUpdateWithoutCommentsInput>;
};
export type DocCommentThreadUpdateWithoutCommentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutThreadsNestedInput;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutDocThreadsCreatedNestedInput;
};
export type DocCommentThreadUncheckedUpdateWithoutCommentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocCommentThreadCreateManyCreatedByInput = {
    id?: string;
    docId: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdAt?: Date | string;
};
export type DocCommentThreadUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    doc?: Prisma.DocUpdateOneRequiredWithoutThreadsNestedInput;
    comments?: Prisma.DocCommentUpdateManyWithoutThreadNestedInput;
};
export type DocCommentThreadUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    comments?: Prisma.DocCommentUncheckedUpdateManyWithoutThreadNestedInput;
};
export type DocCommentThreadUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    docId?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocCommentThreadCreateManyDocInput = {
    id?: string;
    anchorBlockId?: string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById: string;
    createdAt?: Date | string;
};
export type DocCommentThreadUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutDocThreadsCreatedNestedInput;
    comments?: Prisma.DocCommentUpdateManyWithoutThreadNestedInput;
};
export type DocCommentThreadUncheckedUpdateWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    comments?: Prisma.DocCommentUncheckedUpdateManyWithoutThreadNestedInput;
};
export type DocCommentThreadUncheckedUpdateManyWithoutDocInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    anchorBlockId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    anchorMeta?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isOrphan?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocCommentThreadCountOutputType = {
    comments: number;
};
export type DocCommentThreadCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    comments?: boolean | DocCommentThreadCountOutputTypeCountCommentsArgs;
};
export type DocCommentThreadCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadCountOutputTypeSelect<ExtArgs> | null;
};
export type DocCommentThreadCountOutputTypeCountCommentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentWhereInput;
};
export type DocCommentThreadSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    anchorBlockId?: boolean;
    anchorMeta?: boolean;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    comments?: boolean | Prisma.DocCommentThread$commentsArgs<ExtArgs>;
    _count?: boolean | Prisma.DocCommentThreadCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docCommentThread"]>;
export type DocCommentThreadSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    anchorBlockId?: boolean;
    anchorMeta?: boolean;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docCommentThread"]>;
export type DocCommentThreadSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    docId?: boolean;
    anchorBlockId?: boolean;
    anchorMeta?: boolean;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docCommentThread"]>;
export type DocCommentThreadSelectScalar = {
    id?: boolean;
    docId?: boolean;
    anchorBlockId?: boolean;
    anchorMeta?: boolean;
    resolved?: boolean;
    isOrphan?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
};
export type DocCommentThreadOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "docId" | "anchorBlockId" | "anchorMeta" | "resolved" | "isOrphan" | "createdById" | "createdAt", ExtArgs["result"]["docCommentThread"]>;
export type DocCommentThreadInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    comments?: boolean | Prisma.DocCommentThread$commentsArgs<ExtArgs>;
    _count?: boolean | Prisma.DocCommentThreadCountOutputTypeDefaultArgs<ExtArgs>;
};
export type DocCommentThreadIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocCommentThreadIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    doc?: boolean | Prisma.DocDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DocCommentThreadPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DocCommentThread";
    objects: {
        doc: Prisma.$DocPayload<ExtArgs>;
        createdBy: Prisma.$UserPayload<ExtArgs>;
        comments: Prisma.$DocCommentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        docId: string;
        anchorBlockId: string | null;
        anchorMeta: runtime.JsonValue | null;
        resolved: boolean;
        isOrphan: boolean;
        createdById: string;
        createdAt: Date;
    }, ExtArgs["result"]["docCommentThread"]>;
    composites: {};
};
export type DocCommentThreadGetPayload<S extends boolean | null | undefined | DocCommentThreadDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload, S>;
export type DocCommentThreadCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocCommentThreadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocCommentThreadCountAggregateInputType | true;
};
export interface DocCommentThreadDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DocCommentThread'];
        meta: {
            name: 'DocCommentThread';
        };
    };
    findUnique<T extends DocCommentThreadFindUniqueArgs>(args: Prisma.SelectSubset<T, DocCommentThreadFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocCommentThreadFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocCommentThreadFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocCommentThreadFindFirstArgs>(args?: Prisma.SelectSubset<T, DocCommentThreadFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocCommentThreadFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocCommentThreadFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocCommentThreadFindManyArgs>(args?: Prisma.SelectSubset<T, DocCommentThreadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocCommentThreadCreateArgs>(args: Prisma.SelectSubset<T, DocCommentThreadCreateArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocCommentThreadCreateManyArgs>(args?: Prisma.SelectSubset<T, DocCommentThreadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocCommentThreadCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocCommentThreadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocCommentThreadDeleteArgs>(args: Prisma.SelectSubset<T, DocCommentThreadDeleteArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocCommentThreadUpdateArgs>(args: Prisma.SelectSubset<T, DocCommentThreadUpdateArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocCommentThreadDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocCommentThreadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocCommentThreadUpdateManyArgs>(args: Prisma.SelectSubset<T, DocCommentThreadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocCommentThreadUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocCommentThreadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocCommentThreadUpsertArgs>(args: Prisma.SelectSubset<T, DocCommentThreadUpsertArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocCommentThreadCountArgs>(args?: Prisma.Subset<T, DocCommentThreadCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocCommentThreadCountAggregateOutputType> : number>;
    aggregate<T extends DocCommentThreadAggregateArgs>(args: Prisma.Subset<T, DocCommentThreadAggregateArgs>): Prisma.PrismaPromise<GetDocCommentThreadAggregateType<T>>;
    groupBy<T extends DocCommentThreadGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocCommentThreadGroupByArgs['orderBy'];
    } : {
        orderBy?: DocCommentThreadGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocCommentThreadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocCommentThreadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocCommentThreadFieldRefs;
}
export interface Prisma__DocCommentThreadClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    doc<T extends Prisma.DocDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocDefaultArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    comments<T extends Prisma.DocCommentThread$commentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocCommentThread$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocCommentThreadFieldRefs {
    readonly id: Prisma.FieldRef<"DocCommentThread", 'String'>;
    readonly docId: Prisma.FieldRef<"DocCommentThread", 'String'>;
    readonly anchorBlockId: Prisma.FieldRef<"DocCommentThread", 'String'>;
    readonly anchorMeta: Prisma.FieldRef<"DocCommentThread", 'Json'>;
    readonly resolved: Prisma.FieldRef<"DocCommentThread", 'Boolean'>;
    readonly isOrphan: Prisma.FieldRef<"DocCommentThread", 'Boolean'>;
    readonly createdById: Prisma.FieldRef<"DocCommentThread", 'String'>;
    readonly createdAt: Prisma.FieldRef<"DocCommentThread", 'DateTime'>;
}
export type DocCommentThreadFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    where: Prisma.DocCommentThreadWhereUniqueInput;
};
export type DocCommentThreadFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    where: Prisma.DocCommentThreadWhereUniqueInput;
};
export type DocCommentThreadFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    where?: Prisma.DocCommentThreadWhereInput;
    orderBy?: Prisma.DocCommentThreadOrderByWithRelationInput | Prisma.DocCommentThreadOrderByWithRelationInput[];
    cursor?: Prisma.DocCommentThreadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocCommentThreadScalarFieldEnum | Prisma.DocCommentThreadScalarFieldEnum[];
};
export type DocCommentThreadFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    where?: Prisma.DocCommentThreadWhereInput;
    orderBy?: Prisma.DocCommentThreadOrderByWithRelationInput | Prisma.DocCommentThreadOrderByWithRelationInput[];
    cursor?: Prisma.DocCommentThreadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocCommentThreadScalarFieldEnum | Prisma.DocCommentThreadScalarFieldEnum[];
};
export type DocCommentThreadFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    where?: Prisma.DocCommentThreadWhereInput;
    orderBy?: Prisma.DocCommentThreadOrderByWithRelationInput | Prisma.DocCommentThreadOrderByWithRelationInput[];
    cursor?: Prisma.DocCommentThreadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocCommentThreadScalarFieldEnum | Prisma.DocCommentThreadScalarFieldEnum[];
};
export type DocCommentThreadCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocCommentThreadCreateInput, Prisma.DocCommentThreadUncheckedCreateInput>;
};
export type DocCommentThreadCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocCommentThreadCreateManyInput | Prisma.DocCommentThreadCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocCommentThreadCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    data: Prisma.DocCommentThreadCreateManyInput | Prisma.DocCommentThreadCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DocCommentThreadIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DocCommentThreadUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateInput, Prisma.DocCommentThreadUncheckedUpdateInput>;
    where: Prisma.DocCommentThreadWhereUniqueInput;
};
export type DocCommentThreadUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateManyMutationInput, Prisma.DocCommentThreadUncheckedUpdateManyInput>;
    where?: Prisma.DocCommentThreadWhereInput;
    limit?: number;
};
export type DocCommentThreadUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocCommentThreadUpdateManyMutationInput, Prisma.DocCommentThreadUncheckedUpdateManyInput>;
    where?: Prisma.DocCommentThreadWhereInput;
    limit?: number;
    include?: Prisma.DocCommentThreadIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DocCommentThreadUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    where: Prisma.DocCommentThreadWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCommentThreadCreateInput, Prisma.DocCommentThreadUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocCommentThreadUpdateInput, Prisma.DocCommentThreadUncheckedUpdateInput>;
};
export type DocCommentThreadDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
    where: Prisma.DocCommentThreadWhereUniqueInput;
};
export type DocCommentThreadDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentThreadWhereInput;
    limit?: number;
};
export type DocCommentThread$commentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
    where?: Prisma.DocCommentWhereInput;
    orderBy?: Prisma.DocCommentOrderByWithRelationInput | Prisma.DocCommentOrderByWithRelationInput[];
    cursor?: Prisma.DocCommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocCommentScalarFieldEnum | Prisma.DocCommentScalarFieldEnum[];
};
export type DocCommentThreadDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentThreadSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentThreadOmit<ExtArgs> | null;
    include?: Prisma.DocCommentThreadInclude<ExtArgs> | null;
};
