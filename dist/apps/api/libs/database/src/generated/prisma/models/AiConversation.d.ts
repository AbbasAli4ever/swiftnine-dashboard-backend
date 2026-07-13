import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type AiConversationModel = runtime.Types.Result.DefaultSelection<Prisma.$AiConversationPayload>;
export type AggregateAiConversation = {
    _count: AiConversationCountAggregateOutputType | null;
    _min: AiConversationMinAggregateOutputType | null;
    _max: AiConversationMaxAggregateOutputType | null;
};
export type AiConversationMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    userId: string | null;
    title: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type AiConversationMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    userId: string | null;
    title: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type AiConversationCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    userId: number;
    title: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type AiConversationMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    userId?: true;
    title?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type AiConversationMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    userId?: true;
    title?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type AiConversationCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    userId?: true;
    title?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type AiConversationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiConversationWhereInput;
    orderBy?: Prisma.AiConversationOrderByWithRelationInput | Prisma.AiConversationOrderByWithRelationInput[];
    cursor?: Prisma.AiConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AiConversationCountAggregateInputType;
    _min?: AiConversationMinAggregateInputType;
    _max?: AiConversationMaxAggregateInputType;
};
export type GetAiConversationAggregateType<T extends AiConversationAggregateArgs> = {
    [P in keyof T & keyof AggregateAiConversation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAiConversation[P]> : Prisma.GetScalarType<T[P], AggregateAiConversation[P]>;
};
export type AiConversationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiConversationWhereInput;
    orderBy?: Prisma.AiConversationOrderByWithAggregationInput | Prisma.AiConversationOrderByWithAggregationInput[];
    by: Prisma.AiConversationScalarFieldEnum[] | Prisma.AiConversationScalarFieldEnum;
    having?: Prisma.AiConversationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AiConversationCountAggregateInputType | true;
    _min?: AiConversationMinAggregateInputType;
    _max?: AiConversationMaxAggregateInputType;
};
export type AiConversationGroupByOutputType = {
    id: string;
    workspaceId: string;
    userId: string;
    title: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: AiConversationCountAggregateOutputType | null;
    _min: AiConversationMinAggregateOutputType | null;
    _max: AiConversationMaxAggregateOutputType | null;
};
export type GetAiConversationGroupByPayload<T extends AiConversationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AiConversationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AiConversationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AiConversationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AiConversationGroupByOutputType[P]>;
}>>;
export type AiConversationWhereInput = {
    AND?: Prisma.AiConversationWhereInput | Prisma.AiConversationWhereInput[];
    OR?: Prisma.AiConversationWhereInput[];
    NOT?: Prisma.AiConversationWhereInput | Prisma.AiConversationWhereInput[];
    id?: Prisma.StringFilter<"AiConversation"> | string;
    workspaceId?: Prisma.StringFilter<"AiConversation"> | string;
    userId?: Prisma.StringFilter<"AiConversation"> | string;
    title?: Prisma.StringNullableFilter<"AiConversation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"AiConversation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AiConversation"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"AiConversation"> | Date | string | null;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    messages?: Prisma.AiConversationMessageListRelationFilter;
    attachments?: Prisma.AttachmentListRelationFilter;
};
export type AiConversationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    messages?: Prisma.AiConversationMessageOrderByRelationAggregateInput;
    attachments?: Prisma.AttachmentOrderByRelationAggregateInput;
};
export type AiConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AiConversationWhereInput | Prisma.AiConversationWhereInput[];
    OR?: Prisma.AiConversationWhereInput[];
    NOT?: Prisma.AiConversationWhereInput | Prisma.AiConversationWhereInput[];
    workspaceId?: Prisma.StringFilter<"AiConversation"> | string;
    userId?: Prisma.StringFilter<"AiConversation"> | string;
    title?: Prisma.StringNullableFilter<"AiConversation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"AiConversation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AiConversation"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"AiConversation"> | Date | string | null;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    messages?: Prisma.AiConversationMessageListRelationFilter;
    attachments?: Prisma.AttachmentListRelationFilter;
}, "id">;
export type AiConversationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.AiConversationCountOrderByAggregateInput;
    _max?: Prisma.AiConversationMaxOrderByAggregateInput;
    _min?: Prisma.AiConversationMinOrderByAggregateInput;
};
export type AiConversationScalarWhereWithAggregatesInput = {
    AND?: Prisma.AiConversationScalarWhereWithAggregatesInput | Prisma.AiConversationScalarWhereWithAggregatesInput[];
    OR?: Prisma.AiConversationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AiConversationScalarWhereWithAggregatesInput | Prisma.AiConversationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"AiConversation"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"AiConversation"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"AiConversation"> | string;
    title?: Prisma.StringNullableWithAggregatesFilter<"AiConversation"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AiConversation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"AiConversation"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"AiConversation"> | Date | string | null;
};
export type AiConversationCreateInput = {
    id?: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutAiConversationsInput;
    user: Prisma.UserCreateNestedOneWithoutAiConversationsInput;
    messages?: Prisma.AiConversationMessageCreateNestedManyWithoutConversationInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    userId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedCreateNestedManyWithoutConversationInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutAiConversationsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutAiConversationsNestedInput;
    messages?: Prisma.AiConversationMessageUpdateManyWithoutConversationNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedUpdateManyWithoutConversationNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationCreateManyInput = {
    id?: string;
    workspaceId: string;
    userId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AiConversationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AiConversationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AiConversationListRelationFilter = {
    every?: Prisma.AiConversationWhereInput;
    some?: Prisma.AiConversationWhereInput;
    none?: Prisma.AiConversationWhereInput;
};
export type AiConversationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AiConversationNullableScalarRelationFilter = {
    is?: Prisma.AiConversationWhereInput | null;
    isNot?: Prisma.AiConversationWhereInput | null;
};
export type AiConversationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type AiConversationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type AiConversationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type AiConversationScalarRelationFilter = {
    is?: Prisma.AiConversationWhereInput;
    isNot?: Prisma.AiConversationWhereInput;
};
export type AiConversationCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutUserInput, Prisma.AiConversationUncheckedCreateWithoutUserInput> | Prisma.AiConversationCreateWithoutUserInput[] | Prisma.AiConversationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutUserInput | Prisma.AiConversationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AiConversationCreateManyUserInputEnvelope;
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
};
export type AiConversationUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutUserInput, Prisma.AiConversationUncheckedCreateWithoutUserInput> | Prisma.AiConversationCreateWithoutUserInput[] | Prisma.AiConversationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutUserInput | Prisma.AiConversationCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AiConversationCreateManyUserInputEnvelope;
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
};
export type AiConversationUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutUserInput, Prisma.AiConversationUncheckedCreateWithoutUserInput> | Prisma.AiConversationCreateWithoutUserInput[] | Prisma.AiConversationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutUserInput | Prisma.AiConversationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AiConversationUpsertWithWhereUniqueWithoutUserInput | Prisma.AiConversationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AiConversationCreateManyUserInputEnvelope;
    set?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    disconnect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    delete?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    update?: Prisma.AiConversationUpdateWithWhereUniqueWithoutUserInput | Prisma.AiConversationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AiConversationUpdateManyWithWhereWithoutUserInput | Prisma.AiConversationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AiConversationScalarWhereInput | Prisma.AiConversationScalarWhereInput[];
};
export type AiConversationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutUserInput, Prisma.AiConversationUncheckedCreateWithoutUserInput> | Prisma.AiConversationCreateWithoutUserInput[] | Prisma.AiConversationUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutUserInput | Prisma.AiConversationCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AiConversationUpsertWithWhereUniqueWithoutUserInput | Prisma.AiConversationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AiConversationCreateManyUserInputEnvelope;
    set?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    disconnect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    delete?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    update?: Prisma.AiConversationUpdateWithWhereUniqueWithoutUserInput | Prisma.AiConversationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AiConversationUpdateManyWithWhereWithoutUserInput | Prisma.AiConversationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AiConversationScalarWhereInput | Prisma.AiConversationScalarWhereInput[];
};
export type AiConversationCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutWorkspaceInput, Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput> | Prisma.AiConversationCreateWithoutWorkspaceInput[] | Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput | Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.AiConversationCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
};
export type AiConversationUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutWorkspaceInput, Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput> | Prisma.AiConversationCreateWithoutWorkspaceInput[] | Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput | Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.AiConversationCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
};
export type AiConversationUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutWorkspaceInput, Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput> | Prisma.AiConversationCreateWithoutWorkspaceInput[] | Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput | Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.AiConversationUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.AiConversationUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.AiConversationCreateManyWorkspaceInputEnvelope;
    set?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    disconnect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    delete?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    update?: Prisma.AiConversationUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.AiConversationUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.AiConversationUpdateManyWithWhereWithoutWorkspaceInput | Prisma.AiConversationUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.AiConversationScalarWhereInput | Prisma.AiConversationScalarWhereInput[];
};
export type AiConversationUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutWorkspaceInput, Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput> | Prisma.AiConversationCreateWithoutWorkspaceInput[] | Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput | Prisma.AiConversationCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.AiConversationUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.AiConversationUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.AiConversationCreateManyWorkspaceInputEnvelope;
    set?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    disconnect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    delete?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    connect?: Prisma.AiConversationWhereUniqueInput | Prisma.AiConversationWhereUniqueInput[];
    update?: Prisma.AiConversationUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.AiConversationUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.AiConversationUpdateManyWithWhereWithoutWorkspaceInput | Prisma.AiConversationUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.AiConversationScalarWhereInput | Prisma.AiConversationScalarWhereInput[];
};
export type AiConversationCreateNestedOneWithoutAttachmentsInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutAttachmentsInput, Prisma.AiConversationUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutAttachmentsInput;
    connect?: Prisma.AiConversationWhereUniqueInput;
};
export type AiConversationUpdateOneWithoutAttachmentsNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutAttachmentsInput, Prisma.AiConversationUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutAttachmentsInput;
    upsert?: Prisma.AiConversationUpsertWithoutAttachmentsInput;
    disconnect?: Prisma.AiConversationWhereInput | boolean;
    delete?: Prisma.AiConversationWhereInput | boolean;
    connect?: Prisma.AiConversationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AiConversationUpdateToOneWithWhereWithoutAttachmentsInput, Prisma.AiConversationUpdateWithoutAttachmentsInput>, Prisma.AiConversationUncheckedUpdateWithoutAttachmentsInput>;
};
export type AiConversationCreateNestedOneWithoutMessagesInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutMessagesInput, Prisma.AiConversationUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutMessagesInput;
    connect?: Prisma.AiConversationWhereUniqueInput;
};
export type AiConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationCreateWithoutMessagesInput, Prisma.AiConversationUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.AiConversationCreateOrConnectWithoutMessagesInput;
    upsert?: Prisma.AiConversationUpsertWithoutMessagesInput;
    connect?: Prisma.AiConversationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AiConversationUpdateToOneWithWhereWithoutMessagesInput, Prisma.AiConversationUpdateWithoutMessagesInput>, Prisma.AiConversationUncheckedUpdateWithoutMessagesInput>;
};
export type AiConversationCreateWithoutUserInput = {
    id?: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutAiConversationsInput;
    messages?: Prisma.AiConversationMessageCreateNestedManyWithoutConversationInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationUncheckedCreateWithoutUserInput = {
    id?: string;
    workspaceId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedCreateNestedManyWithoutConversationInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationCreateOrConnectWithoutUserInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutUserInput, Prisma.AiConversationUncheckedCreateWithoutUserInput>;
};
export type AiConversationCreateManyUserInputEnvelope = {
    data: Prisma.AiConversationCreateManyUserInput | Prisma.AiConversationCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type AiConversationUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    update: Prisma.XOR<Prisma.AiConversationUpdateWithoutUserInput, Prisma.AiConversationUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutUserInput, Prisma.AiConversationUncheckedCreateWithoutUserInput>;
};
export type AiConversationUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    data: Prisma.XOR<Prisma.AiConversationUpdateWithoutUserInput, Prisma.AiConversationUncheckedUpdateWithoutUserInput>;
};
export type AiConversationUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.AiConversationScalarWhereInput;
    data: Prisma.XOR<Prisma.AiConversationUpdateManyMutationInput, Prisma.AiConversationUncheckedUpdateManyWithoutUserInput>;
};
export type AiConversationScalarWhereInput = {
    AND?: Prisma.AiConversationScalarWhereInput | Prisma.AiConversationScalarWhereInput[];
    OR?: Prisma.AiConversationScalarWhereInput[];
    NOT?: Prisma.AiConversationScalarWhereInput | Prisma.AiConversationScalarWhereInput[];
    id?: Prisma.StringFilter<"AiConversation"> | string;
    workspaceId?: Prisma.StringFilter<"AiConversation"> | string;
    userId?: Prisma.StringFilter<"AiConversation"> | string;
    title?: Prisma.StringNullableFilter<"AiConversation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"AiConversation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AiConversation"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"AiConversation"> | Date | string | null;
};
export type AiConversationCreateWithoutWorkspaceInput = {
    id?: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutAiConversationsInput;
    messages?: Prisma.AiConversationMessageCreateNestedManyWithoutConversationInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    userId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedCreateNestedManyWithoutConversationInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutWorkspaceInput, Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput>;
};
export type AiConversationCreateManyWorkspaceInputEnvelope = {
    data: Prisma.AiConversationCreateManyWorkspaceInput | Prisma.AiConversationCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type AiConversationUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    update: Prisma.XOR<Prisma.AiConversationUpdateWithoutWorkspaceInput, Prisma.AiConversationUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutWorkspaceInput, Prisma.AiConversationUncheckedCreateWithoutWorkspaceInput>;
};
export type AiConversationUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    data: Prisma.XOR<Prisma.AiConversationUpdateWithoutWorkspaceInput, Prisma.AiConversationUncheckedUpdateWithoutWorkspaceInput>;
};
export type AiConversationUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.AiConversationScalarWhereInput;
    data: Prisma.XOR<Prisma.AiConversationUpdateManyMutationInput, Prisma.AiConversationUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type AiConversationCreateWithoutAttachmentsInput = {
    id?: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutAiConversationsInput;
    user: Prisma.UserCreateNestedOneWithoutAiConversationsInput;
    messages?: Prisma.AiConversationMessageCreateNestedManyWithoutConversationInput;
};
export type AiConversationUncheckedCreateWithoutAttachmentsInput = {
    id?: string;
    workspaceId: string;
    userId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedCreateNestedManyWithoutConversationInput;
};
export type AiConversationCreateOrConnectWithoutAttachmentsInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutAttachmentsInput, Prisma.AiConversationUncheckedCreateWithoutAttachmentsInput>;
};
export type AiConversationUpsertWithoutAttachmentsInput = {
    update: Prisma.XOR<Prisma.AiConversationUpdateWithoutAttachmentsInput, Prisma.AiConversationUncheckedUpdateWithoutAttachmentsInput>;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutAttachmentsInput, Prisma.AiConversationUncheckedCreateWithoutAttachmentsInput>;
    where?: Prisma.AiConversationWhereInput;
};
export type AiConversationUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: Prisma.AiConversationWhereInput;
    data: Prisma.XOR<Prisma.AiConversationUpdateWithoutAttachmentsInput, Prisma.AiConversationUncheckedUpdateWithoutAttachmentsInput>;
};
export type AiConversationUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutAiConversationsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutAiConversationsNestedInput;
    messages?: Prisma.AiConversationMessageUpdateManyWithoutConversationNestedInput;
};
export type AiConversationUncheckedUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedUpdateManyWithoutConversationNestedInput;
};
export type AiConversationCreateWithoutMessagesInput = {
    id?: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutAiConversationsInput;
    user: Prisma.UserCreateNestedOneWithoutAiConversationsInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationUncheckedCreateWithoutMessagesInput = {
    id?: string;
    workspaceId: string;
    userId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutAiConversationInput;
};
export type AiConversationCreateOrConnectWithoutMessagesInput = {
    where: Prisma.AiConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutMessagesInput, Prisma.AiConversationUncheckedCreateWithoutMessagesInput>;
};
export type AiConversationUpsertWithoutMessagesInput = {
    update: Prisma.XOR<Prisma.AiConversationUpdateWithoutMessagesInput, Prisma.AiConversationUncheckedUpdateWithoutMessagesInput>;
    create: Prisma.XOR<Prisma.AiConversationCreateWithoutMessagesInput, Prisma.AiConversationUncheckedCreateWithoutMessagesInput>;
    where?: Prisma.AiConversationWhereInput;
};
export type AiConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: Prisma.AiConversationWhereInput;
    data: Prisma.XOR<Prisma.AiConversationUpdateWithoutMessagesInput, Prisma.AiConversationUncheckedUpdateWithoutMessagesInput>;
};
export type AiConversationUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutAiConversationsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutAiConversationsNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationUncheckedUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationCreateManyUserInput = {
    id?: string;
    workspaceId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AiConversationUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutAiConversationsNestedInput;
    messages?: Prisma.AiConversationMessageUpdateManyWithoutConversationNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedUpdateManyWithoutConversationNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AiConversationCreateManyWorkspaceInput = {
    id?: string;
    userId: string;
    title?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AiConversationUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutAiConversationsNestedInput;
    messages?: Prisma.AiConversationMessageUpdateManyWithoutConversationNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    messages?: Prisma.AiConversationMessageUncheckedUpdateManyWithoutConversationNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutAiConversationNestedInput;
};
export type AiConversationUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AiConversationCountOutputType = {
    messages: number;
    attachments: number;
};
export type AiConversationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    messages?: boolean | AiConversationCountOutputTypeCountMessagesArgs;
    attachments?: boolean | AiConversationCountOutputTypeCountAttachmentsArgs;
};
export type AiConversationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationCountOutputTypeSelect<ExtArgs> | null;
};
export type AiConversationCountOutputTypeCountMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiConversationMessageWhereInput;
};
export type AiConversationCountOutputTypeCountAttachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AttachmentWhereInput;
};
export type AiConversationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    title?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    messages?: boolean | Prisma.AiConversation$messagesArgs<ExtArgs>;
    attachments?: boolean | Prisma.AiConversation$attachmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.AiConversationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiConversation"]>;
export type AiConversationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    title?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiConversation"]>;
export type AiConversationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    title?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiConversation"]>;
export type AiConversationSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    title?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type AiConversationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "userId" | "title" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["aiConversation"]>;
export type AiConversationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    messages?: boolean | Prisma.AiConversation$messagesArgs<ExtArgs>;
    attachments?: boolean | Prisma.AiConversation$attachmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.AiConversationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type AiConversationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AiConversationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AiConversationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AiConversation";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
        messages: Prisma.$AiConversationMessagePayload<ExtArgs>[];
        attachments: Prisma.$AttachmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        userId: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["aiConversation"]>;
    composites: {};
};
export type AiConversationGetPayload<S extends boolean | null | undefined | AiConversationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AiConversationPayload, S>;
export type AiConversationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AiConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AiConversationCountAggregateInputType | true;
};
export interface AiConversationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AiConversation'];
        meta: {
            name: 'AiConversation';
        };
    };
    findUnique<T extends AiConversationFindUniqueArgs>(args: Prisma.SelectSubset<T, AiConversationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AiConversationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AiConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AiConversationFindFirstArgs>(args?: Prisma.SelectSubset<T, AiConversationFindFirstArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AiConversationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AiConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AiConversationFindManyArgs>(args?: Prisma.SelectSubset<T, AiConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AiConversationCreateArgs>(args: Prisma.SelectSubset<T, AiConversationCreateArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AiConversationCreateManyArgs>(args?: Prisma.SelectSubset<T, AiConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AiConversationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AiConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AiConversationDeleteArgs>(args: Prisma.SelectSubset<T, AiConversationDeleteArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AiConversationUpdateArgs>(args: Prisma.SelectSubset<T, AiConversationUpdateArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AiConversationDeleteManyArgs>(args?: Prisma.SelectSubset<T, AiConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AiConversationUpdateManyArgs>(args: Prisma.SelectSubset<T, AiConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AiConversationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AiConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AiConversationUpsertArgs>(args: Prisma.SelectSubset<T, AiConversationUpsertArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AiConversationCountArgs>(args?: Prisma.Subset<T, AiConversationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AiConversationCountAggregateOutputType> : number>;
    aggregate<T extends AiConversationAggregateArgs>(args: Prisma.Subset<T, AiConversationAggregateArgs>): Prisma.PrismaPromise<GetAiConversationAggregateType<T>>;
    groupBy<T extends AiConversationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AiConversationGroupByArgs['orderBy'];
    } : {
        orderBy?: AiConversationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AiConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AiConversationFieldRefs;
}
export interface Prisma__AiConversationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    messages<T extends Prisma.AiConversation$messagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AiConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    attachments<T extends Prisma.AiConversation$attachmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AiConversation$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AiConversationFieldRefs {
    readonly id: Prisma.FieldRef<"AiConversation", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"AiConversation", 'String'>;
    readonly userId: Prisma.FieldRef<"AiConversation", 'String'>;
    readonly title: Prisma.FieldRef<"AiConversation", 'String'>;
    readonly createdAt: Prisma.FieldRef<"AiConversation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"AiConversation", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"AiConversation", 'DateTime'>;
}
export type AiConversationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    where: Prisma.AiConversationWhereUniqueInput;
};
export type AiConversationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    where: Prisma.AiConversationWhereUniqueInput;
};
export type AiConversationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    where?: Prisma.AiConversationWhereInput;
    orderBy?: Prisma.AiConversationOrderByWithRelationInput | Prisma.AiConversationOrderByWithRelationInput[];
    cursor?: Prisma.AiConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiConversationScalarFieldEnum | Prisma.AiConversationScalarFieldEnum[];
};
export type AiConversationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    where?: Prisma.AiConversationWhereInput;
    orderBy?: Prisma.AiConversationOrderByWithRelationInput | Prisma.AiConversationOrderByWithRelationInput[];
    cursor?: Prisma.AiConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiConversationScalarFieldEnum | Prisma.AiConversationScalarFieldEnum[];
};
export type AiConversationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    where?: Prisma.AiConversationWhereInput;
    orderBy?: Prisma.AiConversationOrderByWithRelationInput | Prisma.AiConversationOrderByWithRelationInput[];
    cursor?: Prisma.AiConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiConversationScalarFieldEnum | Prisma.AiConversationScalarFieldEnum[];
};
export type AiConversationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiConversationCreateInput, Prisma.AiConversationUncheckedCreateInput>;
};
export type AiConversationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AiConversationCreateManyInput | Prisma.AiConversationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AiConversationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    data: Prisma.AiConversationCreateManyInput | Prisma.AiConversationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AiConversationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AiConversationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiConversationUpdateInput, Prisma.AiConversationUncheckedUpdateInput>;
    where: Prisma.AiConversationWhereUniqueInput;
};
export type AiConversationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AiConversationUpdateManyMutationInput, Prisma.AiConversationUncheckedUpdateManyInput>;
    where?: Prisma.AiConversationWhereInput;
    limit?: number;
};
export type AiConversationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiConversationUpdateManyMutationInput, Prisma.AiConversationUncheckedUpdateManyInput>;
    where?: Prisma.AiConversationWhereInput;
    limit?: number;
    include?: Prisma.AiConversationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AiConversationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    where: Prisma.AiConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationCreateInput, Prisma.AiConversationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AiConversationUpdateInput, Prisma.AiConversationUncheckedUpdateInput>;
};
export type AiConversationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
    where: Prisma.AiConversationWhereUniqueInput;
};
export type AiConversationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiConversationWhereInput;
    limit?: number;
};
export type AiConversation$messagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
    where?: Prisma.AiConversationMessageWhereInput;
    orderBy?: Prisma.AiConversationMessageOrderByWithRelationInput | Prisma.AiConversationMessageOrderByWithRelationInput[];
    cursor?: Prisma.AiConversationMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AiConversationMessageScalarFieldEnum | Prisma.AiConversationMessageScalarFieldEnum[];
};
export type AiConversation$attachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
    where?: Prisma.AttachmentWhereInput;
    orderBy?: Prisma.AttachmentOrderByWithRelationInput | Prisma.AttachmentOrderByWithRelationInput[];
    cursor?: Prisma.AttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AttachmentScalarFieldEnum | Prisma.AttachmentScalarFieldEnum[];
};
export type AiConversationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationOmit<ExtArgs> | null;
    include?: Prisma.AiConversationInclude<ExtArgs> | null;
};
