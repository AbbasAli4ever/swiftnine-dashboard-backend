import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type DocCommentModel = runtime.Types.Result.DefaultSelection<Prisma.$DocCommentPayload>;
export type AggregateDocComment = {
    _count: DocCommentCountAggregateOutputType | null;
    _min: DocCommentMinAggregateOutputType | null;
    _max: DocCommentMaxAggregateOutputType | null;
};
export type DocCommentMinAggregateOutputType = {
    id: string | null;
    threadId: string | null;
    authorId: string | null;
    body: string | null;
    editedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type DocCommentMaxAggregateOutputType = {
    id: string | null;
    threadId: string | null;
    authorId: string | null;
    body: string | null;
    editedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type DocCommentCountAggregateOutputType = {
    id: number;
    threadId: number;
    authorId: number;
    body: number;
    editedAt: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type DocCommentMinAggregateInputType = {
    id?: true;
    threadId?: true;
    authorId?: true;
    body?: true;
    editedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type DocCommentMaxAggregateInputType = {
    id?: true;
    threadId?: true;
    authorId?: true;
    body?: true;
    editedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type DocCommentCountAggregateInputType = {
    id?: true;
    threadId?: true;
    authorId?: true;
    body?: true;
    editedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type DocCommentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentWhereInput;
    orderBy?: Prisma.DocCommentOrderByWithRelationInput | Prisma.DocCommentOrderByWithRelationInput[];
    cursor?: Prisma.DocCommentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocCommentCountAggregateInputType;
    _min?: DocCommentMinAggregateInputType;
    _max?: DocCommentMaxAggregateInputType;
};
export type GetDocCommentAggregateType<T extends DocCommentAggregateArgs> = {
    [P in keyof T & keyof AggregateDocComment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocComment[P]> : Prisma.GetScalarType<T[P], AggregateDocComment[P]>;
};
export type DocCommentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentWhereInput;
    orderBy?: Prisma.DocCommentOrderByWithAggregationInput | Prisma.DocCommentOrderByWithAggregationInput[];
    by: Prisma.DocCommentScalarFieldEnum[] | Prisma.DocCommentScalarFieldEnum;
    having?: Prisma.DocCommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocCommentCountAggregateInputType | true;
    _min?: DocCommentMinAggregateInputType;
    _max?: DocCommentMaxAggregateInputType;
};
export type DocCommentGroupByOutputType = {
    id: string;
    threadId: string;
    authorId: string;
    body: string;
    editedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: DocCommentCountAggregateOutputType | null;
    _min: DocCommentMinAggregateOutputType | null;
    _max: DocCommentMaxAggregateOutputType | null;
};
export type GetDocCommentGroupByPayload<T extends DocCommentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocCommentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocCommentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocCommentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocCommentGroupByOutputType[P]>;
}>>;
export type DocCommentWhereInput = {
    AND?: Prisma.DocCommentWhereInput | Prisma.DocCommentWhereInput[];
    OR?: Prisma.DocCommentWhereInput[];
    NOT?: Prisma.DocCommentWhereInput | Prisma.DocCommentWhereInput[];
    id?: Prisma.StringFilter<"DocComment"> | string;
    threadId?: Prisma.StringFilter<"DocComment"> | string;
    authorId?: Prisma.StringFilter<"DocComment"> | string;
    body?: Prisma.StringFilter<"DocComment"> | string;
    editedAt?: Prisma.DateTimeNullableFilter<"DocComment"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"DocComment"> | Date | string | null;
    thread?: Prisma.XOR<Prisma.DocCommentThreadScalarRelationFilter, Prisma.DocCommentThreadWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type DocCommentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    editedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    thread?: Prisma.DocCommentThreadOrderByWithRelationInput;
    author?: Prisma.UserOrderByWithRelationInput;
};
export type DocCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DocCommentWhereInput | Prisma.DocCommentWhereInput[];
    OR?: Prisma.DocCommentWhereInput[];
    NOT?: Prisma.DocCommentWhereInput | Prisma.DocCommentWhereInput[];
    threadId?: Prisma.StringFilter<"DocComment"> | string;
    authorId?: Prisma.StringFilter<"DocComment"> | string;
    body?: Prisma.StringFilter<"DocComment"> | string;
    editedAt?: Prisma.DateTimeNullableFilter<"DocComment"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"DocComment"> | Date | string | null;
    thread?: Prisma.XOR<Prisma.DocCommentThreadScalarRelationFilter, Prisma.DocCommentThreadWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type DocCommentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    editedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.DocCommentCountOrderByAggregateInput;
    _max?: Prisma.DocCommentMaxOrderByAggregateInput;
    _min?: Prisma.DocCommentMinOrderByAggregateInput;
};
export type DocCommentScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocCommentScalarWhereWithAggregatesInput | Prisma.DocCommentScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocCommentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocCommentScalarWhereWithAggregatesInput | Prisma.DocCommentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DocComment"> | string;
    threadId?: Prisma.StringWithAggregatesFilter<"DocComment"> | string;
    authorId?: Prisma.StringWithAggregatesFilter<"DocComment"> | string;
    body?: Prisma.StringWithAggregatesFilter<"DocComment"> | string;
    editedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"DocComment"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DocComment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"DocComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"DocComment"> | Date | string | null;
};
export type DocCommentCreateInput = {
    id?: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    thread: Prisma.DocCommentThreadCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutDocCommentsAuthoredInput;
};
export type DocCommentUncheckedCreateInput = {
    id?: string;
    threadId: string;
    authorId: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocCommentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    thread?: Prisma.DocCommentThreadUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutDocCommentsAuthoredNestedInput;
};
export type DocCommentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCommentCreateManyInput = {
    id?: string;
    threadId: string;
    authorId: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocCommentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCommentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCommentListRelationFilter = {
    every?: Prisma.DocCommentWhereInput;
    some?: Prisma.DocCommentWhereInput;
    none?: Prisma.DocCommentWhereInput;
};
export type DocCommentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocCommentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    editedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type DocCommentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    editedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type DocCommentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    threadId?: Prisma.SortOrder;
    authorId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    editedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type DocCommentCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutAuthorInput, Prisma.DocCommentUncheckedCreateWithoutAuthorInput> | Prisma.DocCommentCreateWithoutAuthorInput[] | Prisma.DocCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutAuthorInput | Prisma.DocCommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.DocCommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
};
export type DocCommentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutAuthorInput, Prisma.DocCommentUncheckedCreateWithoutAuthorInput> | Prisma.DocCommentCreateWithoutAuthorInput[] | Prisma.DocCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutAuthorInput | Prisma.DocCommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.DocCommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
};
export type DocCommentUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutAuthorInput, Prisma.DocCommentUncheckedCreateWithoutAuthorInput> | Prisma.DocCommentCreateWithoutAuthorInput[] | Prisma.DocCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutAuthorInput | Prisma.DocCommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.DocCommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.DocCommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.DocCommentCreateManyAuthorInputEnvelope;
    set?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    disconnect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    delete?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    update?: Prisma.DocCommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.DocCommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.DocCommentUpdateManyWithWhereWithoutAuthorInput | Prisma.DocCommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.DocCommentScalarWhereInput | Prisma.DocCommentScalarWhereInput[];
};
export type DocCommentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutAuthorInput, Prisma.DocCommentUncheckedCreateWithoutAuthorInput> | Prisma.DocCommentCreateWithoutAuthorInput[] | Prisma.DocCommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutAuthorInput | Prisma.DocCommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.DocCommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.DocCommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.DocCommentCreateManyAuthorInputEnvelope;
    set?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    disconnect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    delete?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    update?: Prisma.DocCommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.DocCommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.DocCommentUpdateManyWithWhereWithoutAuthorInput | Prisma.DocCommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.DocCommentScalarWhereInput | Prisma.DocCommentScalarWhereInput[];
};
export type DocCommentCreateNestedManyWithoutThreadInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutThreadInput, Prisma.DocCommentUncheckedCreateWithoutThreadInput> | Prisma.DocCommentCreateWithoutThreadInput[] | Prisma.DocCommentUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutThreadInput | Prisma.DocCommentCreateOrConnectWithoutThreadInput[];
    createMany?: Prisma.DocCommentCreateManyThreadInputEnvelope;
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
};
export type DocCommentUncheckedCreateNestedManyWithoutThreadInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutThreadInput, Prisma.DocCommentUncheckedCreateWithoutThreadInput> | Prisma.DocCommentCreateWithoutThreadInput[] | Prisma.DocCommentUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutThreadInput | Prisma.DocCommentCreateOrConnectWithoutThreadInput[];
    createMany?: Prisma.DocCommentCreateManyThreadInputEnvelope;
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
};
export type DocCommentUpdateManyWithoutThreadNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutThreadInput, Prisma.DocCommentUncheckedCreateWithoutThreadInput> | Prisma.DocCommentCreateWithoutThreadInput[] | Prisma.DocCommentUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutThreadInput | Prisma.DocCommentCreateOrConnectWithoutThreadInput[];
    upsert?: Prisma.DocCommentUpsertWithWhereUniqueWithoutThreadInput | Prisma.DocCommentUpsertWithWhereUniqueWithoutThreadInput[];
    createMany?: Prisma.DocCommentCreateManyThreadInputEnvelope;
    set?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    disconnect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    delete?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    update?: Prisma.DocCommentUpdateWithWhereUniqueWithoutThreadInput | Prisma.DocCommentUpdateWithWhereUniqueWithoutThreadInput[];
    updateMany?: Prisma.DocCommentUpdateManyWithWhereWithoutThreadInput | Prisma.DocCommentUpdateManyWithWhereWithoutThreadInput[];
    deleteMany?: Prisma.DocCommentScalarWhereInput | Prisma.DocCommentScalarWhereInput[];
};
export type DocCommentUncheckedUpdateManyWithoutThreadNestedInput = {
    create?: Prisma.XOR<Prisma.DocCommentCreateWithoutThreadInput, Prisma.DocCommentUncheckedCreateWithoutThreadInput> | Prisma.DocCommentCreateWithoutThreadInput[] | Prisma.DocCommentUncheckedCreateWithoutThreadInput[];
    connectOrCreate?: Prisma.DocCommentCreateOrConnectWithoutThreadInput | Prisma.DocCommentCreateOrConnectWithoutThreadInput[];
    upsert?: Prisma.DocCommentUpsertWithWhereUniqueWithoutThreadInput | Prisma.DocCommentUpsertWithWhereUniqueWithoutThreadInput[];
    createMany?: Prisma.DocCommentCreateManyThreadInputEnvelope;
    set?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    disconnect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    delete?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    connect?: Prisma.DocCommentWhereUniqueInput | Prisma.DocCommentWhereUniqueInput[];
    update?: Prisma.DocCommentUpdateWithWhereUniqueWithoutThreadInput | Prisma.DocCommentUpdateWithWhereUniqueWithoutThreadInput[];
    updateMany?: Prisma.DocCommentUpdateManyWithWhereWithoutThreadInput | Prisma.DocCommentUpdateManyWithWhereWithoutThreadInput[];
    deleteMany?: Prisma.DocCommentScalarWhereInput | Prisma.DocCommentScalarWhereInput[];
};
export type DocCommentCreateWithoutAuthorInput = {
    id?: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    thread: Prisma.DocCommentThreadCreateNestedOneWithoutCommentsInput;
};
export type DocCommentUncheckedCreateWithoutAuthorInput = {
    id?: string;
    threadId: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocCommentCreateOrConnectWithoutAuthorInput = {
    where: Prisma.DocCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCommentCreateWithoutAuthorInput, Prisma.DocCommentUncheckedCreateWithoutAuthorInput>;
};
export type DocCommentCreateManyAuthorInputEnvelope = {
    data: Prisma.DocCommentCreateManyAuthorInput | Prisma.DocCommentCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type DocCommentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.DocCommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocCommentUpdateWithoutAuthorInput, Prisma.DocCommentUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.DocCommentCreateWithoutAuthorInput, Prisma.DocCommentUncheckedCreateWithoutAuthorInput>;
};
export type DocCommentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.DocCommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocCommentUpdateWithoutAuthorInput, Prisma.DocCommentUncheckedUpdateWithoutAuthorInput>;
};
export type DocCommentUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.DocCommentScalarWhereInput;
    data: Prisma.XOR<Prisma.DocCommentUpdateManyMutationInput, Prisma.DocCommentUncheckedUpdateManyWithoutAuthorInput>;
};
export type DocCommentScalarWhereInput = {
    AND?: Prisma.DocCommentScalarWhereInput | Prisma.DocCommentScalarWhereInput[];
    OR?: Prisma.DocCommentScalarWhereInput[];
    NOT?: Prisma.DocCommentScalarWhereInput | Prisma.DocCommentScalarWhereInput[];
    id?: Prisma.StringFilter<"DocComment"> | string;
    threadId?: Prisma.StringFilter<"DocComment"> | string;
    authorId?: Prisma.StringFilter<"DocComment"> | string;
    body?: Prisma.StringFilter<"DocComment"> | string;
    editedAt?: Prisma.DateTimeNullableFilter<"DocComment"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"DocComment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocComment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"DocComment"> | Date | string | null;
};
export type DocCommentCreateWithoutThreadInput = {
    id?: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutDocCommentsAuthoredInput;
};
export type DocCommentUncheckedCreateWithoutThreadInput = {
    id?: string;
    authorId: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocCommentCreateOrConnectWithoutThreadInput = {
    where: Prisma.DocCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCommentCreateWithoutThreadInput, Prisma.DocCommentUncheckedCreateWithoutThreadInput>;
};
export type DocCommentCreateManyThreadInputEnvelope = {
    data: Prisma.DocCommentCreateManyThreadInput | Prisma.DocCommentCreateManyThreadInput[];
    skipDuplicates?: boolean;
};
export type DocCommentUpsertWithWhereUniqueWithoutThreadInput = {
    where: Prisma.DocCommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocCommentUpdateWithoutThreadInput, Prisma.DocCommentUncheckedUpdateWithoutThreadInput>;
    create: Prisma.XOR<Prisma.DocCommentCreateWithoutThreadInput, Prisma.DocCommentUncheckedCreateWithoutThreadInput>;
};
export type DocCommentUpdateWithWhereUniqueWithoutThreadInput = {
    where: Prisma.DocCommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocCommentUpdateWithoutThreadInput, Prisma.DocCommentUncheckedUpdateWithoutThreadInput>;
};
export type DocCommentUpdateManyWithWhereWithoutThreadInput = {
    where: Prisma.DocCommentScalarWhereInput;
    data: Prisma.XOR<Prisma.DocCommentUpdateManyMutationInput, Prisma.DocCommentUncheckedUpdateManyWithoutThreadInput>;
};
export type DocCommentCreateManyAuthorInput = {
    id?: string;
    threadId: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocCommentUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    thread?: Prisma.DocCommentThreadUpdateOneRequiredWithoutCommentsNestedInput;
};
export type DocCommentUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCommentUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    threadId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCommentCreateManyThreadInput = {
    id?: string;
    authorId: string;
    body: string;
    editedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocCommentUpdateWithoutThreadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutDocCommentsAuthoredNestedInput;
};
export type DocCommentUncheckedUpdateWithoutThreadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCommentUncheckedUpdateManyWithoutThreadInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    editedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCommentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    threadId?: boolean;
    authorId?: boolean;
    body?: boolean;
    editedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    thread?: boolean | Prisma.DocCommentThreadDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docComment"]>;
export type DocCommentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    threadId?: boolean;
    authorId?: boolean;
    body?: boolean;
    editedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    thread?: boolean | Prisma.DocCommentThreadDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docComment"]>;
export type DocCommentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    threadId?: boolean;
    authorId?: boolean;
    body?: boolean;
    editedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    thread?: boolean | Prisma.DocCommentThreadDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["docComment"]>;
export type DocCommentSelectScalar = {
    id?: boolean;
    threadId?: boolean;
    authorId?: boolean;
    body?: boolean;
    editedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type DocCommentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "threadId" | "authorId" | "body" | "editedAt" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["docComment"]>;
export type DocCommentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    thread?: boolean | Prisma.DocCommentThreadDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocCommentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    thread?: boolean | Prisma.DocCommentThreadDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocCommentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    thread?: boolean | Prisma.DocCommentThreadDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DocCommentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DocComment";
    objects: {
        thread: Prisma.$DocCommentThreadPayload<ExtArgs>;
        author: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        threadId: string;
        authorId: string;
        body: string;
        editedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["docComment"]>;
    composites: {};
};
export type DocCommentGetPayload<S extends boolean | null | undefined | DocCommentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocCommentPayload, S>;
export type DocCommentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocCommentCountAggregateInputType | true;
};
export interface DocCommentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DocComment'];
        meta: {
            name: 'DocComment';
        };
    };
    findUnique<T extends DocCommentFindUniqueArgs>(args: Prisma.SelectSubset<T, DocCommentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocCommentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocCommentFindFirstArgs>(args?: Prisma.SelectSubset<T, DocCommentFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocCommentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocCommentFindManyArgs>(args?: Prisma.SelectSubset<T, DocCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocCommentCreateArgs>(args: Prisma.SelectSubset<T, DocCommentCreateArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocCommentCreateManyArgs>(args?: Prisma.SelectSubset<T, DocCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocCommentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocCommentDeleteArgs>(args: Prisma.SelectSubset<T, DocCommentDeleteArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocCommentUpdateArgs>(args: Prisma.SelectSubset<T, DocCommentUpdateArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocCommentDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocCommentUpdateManyArgs>(args: Prisma.SelectSubset<T, DocCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocCommentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocCommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocCommentUpsertArgs>(args: Prisma.SelectSubset<T, DocCommentUpsertArgs<ExtArgs>>): Prisma.Prisma__DocCommentClient<runtime.Types.Result.GetResult<Prisma.$DocCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocCommentCountArgs>(args?: Prisma.Subset<T, DocCommentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocCommentCountAggregateOutputType> : number>;
    aggregate<T extends DocCommentAggregateArgs>(args: Prisma.Subset<T, DocCommentAggregateArgs>): Prisma.PrismaPromise<GetDocCommentAggregateType<T>>;
    groupBy<T extends DocCommentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocCommentGroupByArgs['orderBy'];
    } : {
        orderBy?: DocCommentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocCommentFieldRefs;
}
export interface Prisma__DocCommentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    thread<T extends Prisma.DocCommentThreadDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocCommentThreadDefaultArgs<ExtArgs>>): Prisma.Prisma__DocCommentThreadClient<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    author<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocCommentFieldRefs {
    readonly id: Prisma.FieldRef<"DocComment", 'String'>;
    readonly threadId: Prisma.FieldRef<"DocComment", 'String'>;
    readonly authorId: Prisma.FieldRef<"DocComment", 'String'>;
    readonly body: Prisma.FieldRef<"DocComment", 'String'>;
    readonly editedAt: Prisma.FieldRef<"DocComment", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"DocComment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"DocComment", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"DocComment", 'DateTime'>;
}
export type DocCommentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
    where: Prisma.DocCommentWhereUniqueInput;
};
export type DocCommentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
    where: Prisma.DocCommentWhereUniqueInput;
};
export type DocCommentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DocCommentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DocCommentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DocCommentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocCommentCreateInput, Prisma.DocCommentUncheckedCreateInput>;
};
export type DocCommentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocCommentCreateManyInput | Prisma.DocCommentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocCommentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    data: Prisma.DocCommentCreateManyInput | Prisma.DocCommentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DocCommentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DocCommentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocCommentUpdateInput, Prisma.DocCommentUncheckedUpdateInput>;
    where: Prisma.DocCommentWhereUniqueInput;
};
export type DocCommentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocCommentUpdateManyMutationInput, Prisma.DocCommentUncheckedUpdateManyInput>;
    where?: Prisma.DocCommentWhereInput;
    limit?: number;
};
export type DocCommentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocCommentUpdateManyMutationInput, Prisma.DocCommentUncheckedUpdateManyInput>;
    where?: Prisma.DocCommentWhereInput;
    limit?: number;
    include?: Prisma.DocCommentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DocCommentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
    where: Prisma.DocCommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCommentCreateInput, Prisma.DocCommentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocCommentUpdateInput, Prisma.DocCommentUncheckedUpdateInput>;
};
export type DocCommentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
    where: Prisma.DocCommentWhereUniqueInput;
};
export type DocCommentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentWhereInput;
    limit?: number;
};
export type DocCommentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCommentSelect<ExtArgs> | null;
    omit?: Prisma.DocCommentOmit<ExtArgs> | null;
    include?: Prisma.DocCommentInclude<ExtArgs> | null;
};
