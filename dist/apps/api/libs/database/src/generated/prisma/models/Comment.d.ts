import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CommentModel = runtime.Types.Result.DefaultSelection<Prisma.$CommentPayload>;
export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
export type CommentMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    parentId: string | null;
    content: string | null;
    isEdited: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type CommentMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    userId: string | null;
    parentId: string | null;
    content: string | null;
    isEdited: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type CommentCountAggregateOutputType = {
    id: number;
    taskId: number;
    userId: number;
    parentId: number;
    content: number;
    isEdited: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type CommentMinAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    parentId?: true;
    content?: true;
    isEdited?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type CommentMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    parentId?: true;
    content?: true;
    isEdited?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type CommentCountAggregateInputType = {
    id?: true;
    taskId?: true;
    userId?: true;
    parentId?: true;
    content?: true;
    isEdited?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type CommentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CommentCountAggregateInputType;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
    [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateComment[P]> : Prisma.GetScalarType<T[P], AggregateComment[P]>;
};
export type CommentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithAggregationInput | Prisma.CommentOrderByWithAggregationInput[];
    by: Prisma.CommentScalarFieldEnum[] | Prisma.CommentScalarFieldEnum;
    having?: Prisma.CommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CommentCountAggregateInputType | true;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type CommentGroupByOutputType = {
    id: string;
    taskId: string;
    userId: string;
    parentId: string | null;
    content: string;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
export type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CommentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]>;
}>>;
export type CommentWhereInput = {
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    id?: Prisma.StringFilter<"Comment"> | string;
    taskId?: Prisma.StringFilter<"Comment"> | string;
    userId?: Prisma.StringFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableFilter<"Comment"> | string | null;
    content?: Prisma.StringFilter<"Comment"> | string;
    isEdited?: Prisma.BoolFilter<"Comment"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Comment"> | Date | string | null;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    parent?: Prisma.XOR<Prisma.CommentNullableScalarRelationFilter, Prisma.CommentWhereInput> | null;
    replies?: Prisma.CommentListRelationFilter;
    mentions?: Prisma.MentionListRelationFilter;
    reactions?: Prisma.ReactionListRelationFilter;
};
export type CommentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isEdited?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    author?: Prisma.UserOrderByWithRelationInput;
    parent?: Prisma.CommentOrderByWithRelationInput;
    replies?: Prisma.CommentOrderByRelationAggregateInput;
    mentions?: Prisma.MentionOrderByRelationAggregateInput;
    reactions?: Prisma.ReactionOrderByRelationAggregateInput;
};
export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    taskId?: Prisma.StringFilter<"Comment"> | string;
    userId?: Prisma.StringFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableFilter<"Comment"> | string | null;
    content?: Prisma.StringFilter<"Comment"> | string;
    isEdited?: Prisma.BoolFilter<"Comment"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Comment"> | Date | string | null;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    author?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    parent?: Prisma.XOR<Prisma.CommentNullableScalarRelationFilter, Prisma.CommentWhereInput> | null;
    replies?: Prisma.CommentListRelationFilter;
    mentions?: Prisma.MentionListRelationFilter;
    reactions?: Prisma.ReactionListRelationFilter;
}, "id">;
export type CommentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isEdited?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.CommentCountOrderByAggregateInput;
    _max?: Prisma.CommentMaxOrderByAggregateInput;
    _min?: Prisma.CommentMinOrderByAggregateInput;
};
export type CommentScalarWhereWithAggregatesInput = {
    AND?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    OR?: Prisma.CommentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableWithAggregatesFilter<"Comment"> | string | null;
    content?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    isEdited?: Prisma.BoolWithAggregatesFilter<"Comment"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Comment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Comment"> | Date | string | null;
};
export type CommentCreateInput = {
    id?: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionCreateNestedManyWithoutCommentInput;
};
export type CommentUncheckedCreateInput = {
    id?: string;
    taskId: string;
    userId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionUncheckedCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionUncheckedCreateNestedManyWithoutCommentInput;
};
export type CommentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUncheckedUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUncheckedUpdateManyWithoutCommentNestedInput;
};
export type CommentCreateManyInput = {
    id?: string;
    taskId: string;
    userId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type CommentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CommentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CommentListRelationFilter = {
    every?: Prisma.CommentWhereInput;
    some?: Prisma.CommentWhereInput;
    none?: Prisma.CommentWhereInput;
};
export type CommentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CommentNullableScalarRelationFilter = {
    is?: Prisma.CommentWhereInput | null;
    isNot?: Prisma.CommentWhereInput | null;
};
export type CommentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isEdited?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type CommentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isEdited?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type CommentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    isEdited?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type CommentScalarRelationFilter = {
    is?: Prisma.CommentWhereInput;
    isNot?: Prisma.CommentWhereInput;
};
export type CommentCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutAuthorInput, Prisma.CommentUncheckedCreateWithoutAuthorInput> | Prisma.CommentCreateWithoutAuthorInput[] | Prisma.CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutAuthorInput | Prisma.CommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.CommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutAuthorInput, Prisma.CommentUncheckedCreateWithoutAuthorInput> | Prisma.CommentCreateWithoutAuthorInput[] | Prisma.CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutAuthorInput | Prisma.CommentCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.CommentCreateManyAuthorInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutAuthorInput, Prisma.CommentUncheckedCreateWithoutAuthorInput> | Prisma.CommentCreateWithoutAuthorInput[] | Prisma.CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutAuthorInput | Prisma.CommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.CommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.CommentCreateManyAuthorInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.CommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutAuthorInput | Prisma.CommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutAuthorInput, Prisma.CommentUncheckedCreateWithoutAuthorInput> | Prisma.CommentCreateWithoutAuthorInput[] | Prisma.CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutAuthorInput | Prisma.CommentCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutAuthorInput | Prisma.CommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.CommentCreateManyAuthorInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutAuthorInput | Prisma.CommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutAuthorInput | Prisma.CommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput | Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput | Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutTaskInput | Prisma.CommentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput> | Prisma.CommentCreateWithoutTaskInput[] | Prisma.CommentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutTaskInput | Prisma.CommentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput | Prisma.CommentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.CommentCreateManyTaskInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput | Prisma.CommentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutTaskInput | Prisma.CommentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateNestedOneWithoutRepliesInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutRepliesInput;
    connect?: Prisma.CommentWhereUniqueInput;
};
export type CommentCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateOneWithoutRepliesNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutRepliesInput;
    upsert?: Prisma.CommentUpsertWithoutRepliesInput;
    disconnect?: Prisma.CommentWhereInput | boolean;
    delete?: Prisma.CommentWhereInput | boolean;
    connect?: Prisma.CommentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CommentUpdateToOneWithWhereWithoutRepliesInput, Prisma.CommentUpdateWithoutRepliesInput>, Prisma.CommentUncheckedUpdateWithoutRepliesInput>;
};
export type CommentUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutParentInput | Prisma.CommentUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutParentInput | Prisma.CommentUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutParentInput | Prisma.CommentUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput> | Prisma.CommentCreateWithoutParentInput[] | Prisma.CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutParentInput | Prisma.CommentCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutParentInput | Prisma.CommentUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.CommentCreateManyParentInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutParentInput | Prisma.CommentUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutParentInput | Prisma.CommentUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateNestedOneWithoutReactionsInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutReactionsInput, Prisma.CommentUncheckedCreateWithoutReactionsInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutReactionsInput;
    connect?: Prisma.CommentWhereUniqueInput;
};
export type CommentUpdateOneRequiredWithoutReactionsNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutReactionsInput, Prisma.CommentUncheckedCreateWithoutReactionsInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutReactionsInput;
    upsert?: Prisma.CommentUpsertWithoutReactionsInput;
    connect?: Prisma.CommentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CommentUpdateToOneWithWhereWithoutReactionsInput, Prisma.CommentUpdateWithoutReactionsInput>, Prisma.CommentUncheckedUpdateWithoutReactionsInput>;
};
export type CommentCreateNestedOneWithoutMentionsInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutMentionsInput, Prisma.CommentUncheckedCreateWithoutMentionsInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutMentionsInput;
    connect?: Prisma.CommentWhereUniqueInput;
};
export type CommentUpdateOneRequiredWithoutMentionsNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutMentionsInput, Prisma.CommentUncheckedCreateWithoutMentionsInput>;
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutMentionsInput;
    upsert?: Prisma.CommentUpsertWithoutMentionsInput;
    connect?: Prisma.CommentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CommentUpdateToOneWithWhereWithoutMentionsInput, Prisma.CommentUpdateWithoutMentionsInput>, Prisma.CommentUncheckedUpdateWithoutMentionsInput>;
};
export type CommentCreateWithoutAuthorInput = {
    id?: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionCreateNestedManyWithoutCommentInput;
};
export type CommentUncheckedCreateWithoutAuthorInput = {
    id?: string;
    taskId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionUncheckedCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionUncheckedCreateNestedManyWithoutCommentInput;
};
export type CommentCreateOrConnectWithoutAuthorInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutAuthorInput, Prisma.CommentUncheckedCreateWithoutAuthorInput>;
};
export type CommentCreateManyAuthorInputEnvelope = {
    data: Prisma.CommentCreateManyAuthorInput | Prisma.CommentCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutAuthorInput, Prisma.CommentUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutAuthorInput, Prisma.CommentUncheckedCreateWithoutAuthorInput>;
};
export type CommentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutAuthorInput, Prisma.CommentUncheckedUpdateWithoutAuthorInput>;
};
export type CommentUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutAuthorInput>;
};
export type CommentScalarWhereInput = {
    AND?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    OR?: Prisma.CommentScalarWhereInput[];
    NOT?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    id?: Prisma.StringFilter<"Comment"> | string;
    taskId?: Prisma.StringFilter<"Comment"> | string;
    userId?: Prisma.StringFilter<"Comment"> | string;
    parentId?: Prisma.StringNullableFilter<"Comment"> | string | null;
    content?: Prisma.StringFilter<"Comment"> | string;
    isEdited?: Prisma.BoolFilter<"Comment"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Comment"> | Date | string | null;
};
export type CommentCreateWithoutTaskInput = {
    id?: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    author: Prisma.UserCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionCreateNestedManyWithoutCommentInput;
};
export type CommentUncheckedCreateWithoutTaskInput = {
    id?: string;
    userId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionUncheckedCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionUncheckedCreateNestedManyWithoutCommentInput;
};
export type CommentCreateOrConnectWithoutTaskInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput>;
};
export type CommentCreateManyTaskInputEnvelope = {
    data: Prisma.CommentCreateManyTaskInput | Prisma.CommentCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutTaskInput, Prisma.CommentUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutTaskInput, Prisma.CommentUncheckedCreateWithoutTaskInput>;
};
export type CommentUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutTaskInput, Prisma.CommentUncheckedUpdateWithoutTaskInput>;
};
export type CommentUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutTaskInput>;
};
export type CommentCreateWithoutRepliesInput = {
    id?: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    mentions?: Prisma.MentionCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionCreateNestedManyWithoutCommentInput;
};
export type CommentUncheckedCreateWithoutRepliesInput = {
    id?: string;
    taskId: string;
    userId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    mentions?: Prisma.MentionUncheckedCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionUncheckedCreateNestedManyWithoutCommentInput;
};
export type CommentCreateOrConnectWithoutRepliesInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
};
export type CommentCreateWithoutParentInput = {
    id?: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutCommentsInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionCreateNestedManyWithoutCommentInput;
};
export type CommentUncheckedCreateWithoutParentInput = {
    id?: string;
    taskId: string;
    userId: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionUncheckedCreateNestedManyWithoutCommentInput;
    reactions?: Prisma.ReactionUncheckedCreateNestedManyWithoutCommentInput;
};
export type CommentCreateOrConnectWithoutParentInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput>;
};
export type CommentCreateManyParentInputEnvelope = {
    data: Prisma.CommentCreateManyParentInput | Prisma.CommentCreateManyParentInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithoutRepliesInput = {
    update: Prisma.XOR<Prisma.CommentUpdateWithoutRepliesInput, Prisma.CommentUncheckedUpdateWithoutRepliesInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutRepliesInput, Prisma.CommentUncheckedCreateWithoutRepliesInput>;
    where?: Prisma.CommentWhereInput;
};
export type CommentUpdateToOneWithWhereWithoutRepliesInput = {
    where?: Prisma.CommentWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutRepliesInput, Prisma.CommentUncheckedUpdateWithoutRepliesInput>;
};
export type CommentUpdateWithoutRepliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    mentions?: Prisma.MentionUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateWithoutRepliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    mentions?: Prisma.MentionUncheckedUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUncheckedUpdateManyWithoutCommentNestedInput;
};
export type CommentUpsertWithWhereUniqueWithoutParentInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutParentInput, Prisma.CommentUncheckedUpdateWithoutParentInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutParentInput, Prisma.CommentUncheckedCreateWithoutParentInput>;
};
export type CommentUpdateWithWhereUniqueWithoutParentInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutParentInput, Prisma.CommentUncheckedUpdateWithoutParentInput>;
};
export type CommentUpdateManyWithWhereWithoutParentInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutParentInput>;
};
export type CommentCreateWithoutReactionsInput = {
    id?: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionCreateNestedManyWithoutCommentInput;
};
export type CommentUncheckedCreateWithoutReactionsInput = {
    id?: string;
    taskId: string;
    userId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
    mentions?: Prisma.MentionUncheckedCreateNestedManyWithoutCommentInput;
};
export type CommentCreateOrConnectWithoutReactionsInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutReactionsInput, Prisma.CommentUncheckedCreateWithoutReactionsInput>;
};
export type CommentUpsertWithoutReactionsInput = {
    update: Prisma.XOR<Prisma.CommentUpdateWithoutReactionsInput, Prisma.CommentUncheckedUpdateWithoutReactionsInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutReactionsInput, Prisma.CommentUncheckedCreateWithoutReactionsInput>;
    where?: Prisma.CommentWhereInput;
};
export type CommentUpdateToOneWithWhereWithoutReactionsInput = {
    where?: Prisma.CommentWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutReactionsInput, Prisma.CommentUncheckedUpdateWithoutReactionsInput>;
};
export type CommentUpdateWithoutReactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateWithoutReactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUncheckedUpdateManyWithoutCommentNestedInput;
};
export type CommentCreateWithoutMentionsInput = {
    id?: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutCommentsInput;
    author: Prisma.UserCreateNestedOneWithoutCommentsInput;
    parent?: Prisma.CommentCreateNestedOneWithoutRepliesInput;
    replies?: Prisma.CommentCreateNestedManyWithoutParentInput;
    reactions?: Prisma.ReactionCreateNestedManyWithoutCommentInput;
};
export type CommentUncheckedCreateWithoutMentionsInput = {
    id?: string;
    taskId: string;
    userId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    replies?: Prisma.CommentUncheckedCreateNestedManyWithoutParentInput;
    reactions?: Prisma.ReactionUncheckedCreateNestedManyWithoutCommentInput;
};
export type CommentCreateOrConnectWithoutMentionsInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutMentionsInput, Prisma.CommentUncheckedCreateWithoutMentionsInput>;
};
export type CommentUpsertWithoutMentionsInput = {
    update: Prisma.XOR<Prisma.CommentUpdateWithoutMentionsInput, Prisma.CommentUncheckedUpdateWithoutMentionsInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutMentionsInput, Prisma.CommentUncheckedCreateWithoutMentionsInput>;
    where?: Prisma.CommentWhereInput;
};
export type CommentUpdateToOneWithWhereWithoutMentionsInput = {
    where?: Prisma.CommentWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutMentionsInput, Prisma.CommentUncheckedUpdateWithoutMentionsInput>;
};
export type CommentUpdateWithoutMentionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
    reactions?: Prisma.ReactionUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateWithoutMentionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
    reactions?: Prisma.ReactionUncheckedUpdateManyWithoutCommentNestedInput;
};
export type CommentCreateManyAuthorInput = {
    id?: string;
    taskId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type CommentUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUncheckedUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUncheckedUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CommentCreateManyTaskInput = {
    id?: string;
    userId: string;
    parentId?: string | null;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type CommentUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    author?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
    parent?: Prisma.CommentUpdateOneWithoutRepliesNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUncheckedUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUncheckedUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CommentCreateManyParentInput = {
    id?: string;
    taskId: string;
    userId: string;
    content: string;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type CommentUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutCommentsNestedInput;
    author?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
    replies?: Prisma.CommentUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    replies?: Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput;
    mentions?: Prisma.MentionUncheckedUpdateManyWithoutCommentNestedInput;
    reactions?: Prisma.ReactionUncheckedUpdateManyWithoutCommentNestedInput;
};
export type CommentUncheckedUpdateManyWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    isEdited?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CommentCountOutputType = {
    replies: number;
    mentions: number;
    reactions: number;
};
export type CommentCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    replies?: boolean | CommentCountOutputTypeCountRepliesArgs;
    mentions?: boolean | CommentCountOutputTypeCountMentionsArgs;
    reactions?: boolean | CommentCountOutputTypeCountReactionsArgs;
};
export type CommentCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentCountOutputTypeSelect<ExtArgs> | null;
};
export type CommentCountOutputTypeCountRepliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
};
export type CommentCountOutputTypeCountMentionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentionWhereInput;
};
export type CommentCountOutputTypeCountReactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReactionWhereInput;
};
export type CommentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    parentId?: boolean;
    content?: boolean;
    isEdited?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
    replies?: boolean | Prisma.Comment$repliesArgs<ExtArgs>;
    mentions?: boolean | Prisma.Comment$mentionsArgs<ExtArgs>;
    reactions?: boolean | Prisma.Comment$reactionsArgs<ExtArgs>;
    _count?: boolean | Prisma.CommentCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    parentId?: boolean;
    content?: boolean;
    isEdited?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    parentId?: boolean;
    content?: boolean;
    isEdited?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectScalar = {
    id?: boolean;
    taskId?: boolean;
    userId?: boolean;
    parentId?: boolean;
    content?: boolean;
    isEdited?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type CommentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "userId" | "parentId" | "content" | "isEdited" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["comment"]>;
export type CommentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
    replies?: boolean | Prisma.Comment$repliesArgs<ExtArgs>;
    mentions?: boolean | Prisma.Comment$mentionsArgs<ExtArgs>;
    reactions?: boolean | Prisma.Comment$reactionsArgs<ExtArgs>;
    _count?: boolean | Prisma.CommentCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CommentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
};
export type CommentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    parent?: boolean | Prisma.Comment$parentArgs<ExtArgs>;
};
export type $CommentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Comment";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        author: Prisma.$UserPayload<ExtArgs>;
        parent: Prisma.$CommentPayload<ExtArgs> | null;
        replies: Prisma.$CommentPayload<ExtArgs>[];
        mentions: Prisma.$MentionPayload<ExtArgs>[];
        reactions: Prisma.$ReactionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        userId: string;
        parentId: string | null;
        content: string;
        isEdited: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["comment"]>;
    composites: {};
};
export type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CommentPayload, S>;
export type CommentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CommentCountAggregateInputType | true;
};
export interface CommentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Comment'];
        meta: {
            name: 'Comment';
        };
    };
    findUnique<T extends CommentFindUniqueArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CommentFindFirstArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CommentFindManyArgs>(args?: Prisma.SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CommentCreateArgs>(args: Prisma.SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CommentCreateManyArgs>(args?: Prisma.SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CommentDeleteArgs>(args: Prisma.SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CommentUpdateArgs>(args: Prisma.SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CommentDeleteManyArgs>(args?: Prisma.SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CommentUpdateManyArgs>(args: Prisma.SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CommentUpsertArgs>(args: Prisma.SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CommentCountArgs>(args?: Prisma.Subset<T, CommentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CommentCountAggregateOutputType> : number>;
    aggregate<T extends CommentAggregateArgs>(args: Prisma.Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>;
    groupBy<T extends CommentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CommentGroupByArgs['orderBy'];
    } : {
        orderBy?: CommentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CommentFieldRefs;
}
export interface Prisma__CommentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    author<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    parent<T extends Prisma.Comment$parentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Comment$parentArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    replies<T extends Prisma.Comment$repliesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Comment$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    mentions<T extends Prisma.Comment$mentionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Comment$mentionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reactions<T extends Prisma.Comment$reactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Comment$reactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CommentFieldRefs {
    readonly id: Prisma.FieldRef<"Comment", 'String'>;
    readonly taskId: Prisma.FieldRef<"Comment", 'String'>;
    readonly userId: Prisma.FieldRef<"Comment", 'String'>;
    readonly parentId: Prisma.FieldRef<"Comment", 'String'>;
    readonly content: Prisma.FieldRef<"Comment", 'String'>;
    readonly isEdited: Prisma.FieldRef<"Comment", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Comment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Comment", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Comment", 'DateTime'>;
}
export type CommentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
};
export type CommentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CommentCreateManyInput | Prisma.CommentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CommentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    data: Prisma.CommentCreateManyInput | Prisma.CommentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CommentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CommentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyInput>;
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type CommentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyInput>;
    where?: Prisma.CommentWhereInput;
    limit?: number;
    include?: Prisma.CommentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CommentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
};
export type CommentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type Comment$parentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
};
export type Comment$repliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type Comment$mentionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MentionSelect<ExtArgs> | null;
    omit?: Prisma.MentionOmit<ExtArgs> | null;
    include?: Prisma.MentionInclude<ExtArgs> | null;
    where?: Prisma.MentionWhereInput;
    orderBy?: Prisma.MentionOrderByWithRelationInput | Prisma.MentionOrderByWithRelationInput[];
    cursor?: Prisma.MentionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MentionScalarFieldEnum | Prisma.MentionScalarFieldEnum[];
};
export type Comment$reactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ReactionSelect<ExtArgs> | null;
    omit?: Prisma.ReactionOmit<ExtArgs> | null;
    include?: Prisma.ReactionInclude<ExtArgs> | null;
    where?: Prisma.ReactionWhereInput;
    orderBy?: Prisma.ReactionOrderByWithRelationInput | Prisma.ReactionOrderByWithRelationInput[];
    cursor?: Prisma.ReactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReactionScalarFieldEnum | Prisma.ReactionScalarFieldEnum[];
};
export type CommentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
};
