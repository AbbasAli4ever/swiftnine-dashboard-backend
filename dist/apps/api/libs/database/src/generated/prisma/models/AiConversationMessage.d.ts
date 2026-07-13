import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type AiConversationMessageModel = runtime.Types.Result.DefaultSelection<Prisma.$AiConversationMessagePayload>;
export type AggregateAiConversationMessage = {
    _count: AiConversationMessageCountAggregateOutputType | null;
    _min: AiConversationMessageMinAggregateOutputType | null;
    _max: AiConversationMessageMaxAggregateOutputType | null;
};
export type AiConversationMessageMinAggregateOutputType = {
    id: string | null;
    conversationId: string | null;
    role: $Enums.AiMessageRole | null;
    content: string | null;
    status: $Enums.AiMessageStatus | null;
    createdAt: Date | null;
};
export type AiConversationMessageMaxAggregateOutputType = {
    id: string | null;
    conversationId: string | null;
    role: $Enums.AiMessageRole | null;
    content: string | null;
    status: $Enums.AiMessageStatus | null;
    createdAt: Date | null;
};
export type AiConversationMessageCountAggregateOutputType = {
    id: number;
    conversationId: number;
    role: number;
    content: number;
    status: number;
    createdAt: number;
    _all: number;
};
export type AiConversationMessageMinAggregateInputType = {
    id?: true;
    conversationId?: true;
    role?: true;
    content?: true;
    status?: true;
    createdAt?: true;
};
export type AiConversationMessageMaxAggregateInputType = {
    id?: true;
    conversationId?: true;
    role?: true;
    content?: true;
    status?: true;
    createdAt?: true;
};
export type AiConversationMessageCountAggregateInputType = {
    id?: true;
    conversationId?: true;
    role?: true;
    content?: true;
    status?: true;
    createdAt?: true;
    _all?: true;
};
export type AiConversationMessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiConversationMessageWhereInput;
    orderBy?: Prisma.AiConversationMessageOrderByWithRelationInput | Prisma.AiConversationMessageOrderByWithRelationInput[];
    cursor?: Prisma.AiConversationMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AiConversationMessageCountAggregateInputType;
    _min?: AiConversationMessageMinAggregateInputType;
    _max?: AiConversationMessageMaxAggregateInputType;
};
export type GetAiConversationMessageAggregateType<T extends AiConversationMessageAggregateArgs> = {
    [P in keyof T & keyof AggregateAiConversationMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAiConversationMessage[P]> : Prisma.GetScalarType<T[P], AggregateAiConversationMessage[P]>;
};
export type AiConversationMessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiConversationMessageWhereInput;
    orderBy?: Prisma.AiConversationMessageOrderByWithAggregationInput | Prisma.AiConversationMessageOrderByWithAggregationInput[];
    by: Prisma.AiConversationMessageScalarFieldEnum[] | Prisma.AiConversationMessageScalarFieldEnum;
    having?: Prisma.AiConversationMessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AiConversationMessageCountAggregateInputType | true;
    _min?: AiConversationMessageMinAggregateInputType;
    _max?: AiConversationMessageMaxAggregateInputType;
};
export type AiConversationMessageGroupByOutputType = {
    id: string;
    conversationId: string;
    role: $Enums.AiMessageRole;
    content: string;
    status: $Enums.AiMessageStatus;
    createdAt: Date;
    _count: AiConversationMessageCountAggregateOutputType | null;
    _min: AiConversationMessageMinAggregateOutputType | null;
    _max: AiConversationMessageMaxAggregateOutputType | null;
};
export type GetAiConversationMessageGroupByPayload<T extends AiConversationMessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AiConversationMessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AiConversationMessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AiConversationMessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AiConversationMessageGroupByOutputType[P]>;
}>>;
export type AiConversationMessageWhereInput = {
    AND?: Prisma.AiConversationMessageWhereInput | Prisma.AiConversationMessageWhereInput[];
    OR?: Prisma.AiConversationMessageWhereInput[];
    NOT?: Prisma.AiConversationMessageWhereInput | Prisma.AiConversationMessageWhereInput[];
    id?: Prisma.StringFilter<"AiConversationMessage"> | string;
    conversationId?: Prisma.StringFilter<"AiConversationMessage"> | string;
    role?: Prisma.EnumAiMessageRoleFilter<"AiConversationMessage"> | $Enums.AiMessageRole;
    content?: Prisma.StringFilter<"AiConversationMessage"> | string;
    status?: Prisma.EnumAiMessageStatusFilter<"AiConversationMessage"> | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFilter<"AiConversationMessage"> | Date | string;
    conversation?: Prisma.XOR<Prisma.AiConversationScalarRelationFilter, Prisma.AiConversationWhereInput>;
    attachments?: Prisma.AttachmentListRelationFilter;
};
export type AiConversationMessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    conversation?: Prisma.AiConversationOrderByWithRelationInput;
    attachments?: Prisma.AttachmentOrderByRelationAggregateInput;
};
export type AiConversationMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AiConversationMessageWhereInput | Prisma.AiConversationMessageWhereInput[];
    OR?: Prisma.AiConversationMessageWhereInput[];
    NOT?: Prisma.AiConversationMessageWhereInput | Prisma.AiConversationMessageWhereInput[];
    conversationId?: Prisma.StringFilter<"AiConversationMessage"> | string;
    role?: Prisma.EnumAiMessageRoleFilter<"AiConversationMessage"> | $Enums.AiMessageRole;
    content?: Prisma.StringFilter<"AiConversationMessage"> | string;
    status?: Prisma.EnumAiMessageStatusFilter<"AiConversationMessage"> | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFilter<"AiConversationMessage"> | Date | string;
    conversation?: Prisma.XOR<Prisma.AiConversationScalarRelationFilter, Prisma.AiConversationWhereInput>;
    attachments?: Prisma.AttachmentListRelationFilter;
}, "id">;
export type AiConversationMessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.AiConversationMessageCountOrderByAggregateInput;
    _max?: Prisma.AiConversationMessageMaxOrderByAggregateInput;
    _min?: Prisma.AiConversationMessageMinOrderByAggregateInput;
};
export type AiConversationMessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.AiConversationMessageScalarWhereWithAggregatesInput | Prisma.AiConversationMessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.AiConversationMessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AiConversationMessageScalarWhereWithAggregatesInput | Prisma.AiConversationMessageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"AiConversationMessage"> | string;
    conversationId?: Prisma.StringWithAggregatesFilter<"AiConversationMessage"> | string;
    role?: Prisma.EnumAiMessageRoleWithAggregatesFilter<"AiConversationMessage"> | $Enums.AiMessageRole;
    content?: Prisma.StringWithAggregatesFilter<"AiConversationMessage"> | string;
    status?: Prisma.EnumAiMessageStatusWithAggregatesFilter<"AiConversationMessage"> | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AiConversationMessage"> | Date | string;
};
export type AiConversationMessageCreateInput = {
    id?: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
    conversation: Prisma.AiConversationCreateNestedOneWithoutMessagesInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutAiConversationMessageInput;
};
export type AiConversationMessageUncheckedCreateInput = {
    id?: string;
    conversationId: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutAiConversationMessageInput;
};
export type AiConversationMessageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    conversation?: Prisma.AiConversationUpdateOneRequiredWithoutMessagesNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutAiConversationMessageNestedInput;
};
export type AiConversationMessageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutAiConversationMessageNestedInput;
};
export type AiConversationMessageCreateManyInput = {
    id?: string;
    conversationId: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
};
export type AiConversationMessageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiConversationMessageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiConversationMessageNullableScalarRelationFilter = {
    is?: Prisma.AiConversationMessageWhereInput | null;
    isNot?: Prisma.AiConversationMessageWhereInput | null;
};
export type AiConversationMessageListRelationFilter = {
    every?: Prisma.AiConversationMessageWhereInput;
    some?: Prisma.AiConversationMessageWhereInput;
    none?: Prisma.AiConversationMessageWhereInput;
};
export type AiConversationMessageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AiConversationMessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AiConversationMessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AiConversationMessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    conversationId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    content?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AiConversationMessageCreateNestedOneWithoutAttachmentsInput = {
    create?: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutAttachmentsInput, Prisma.AiConversationMessageUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.AiConversationMessageCreateOrConnectWithoutAttachmentsInput;
    connect?: Prisma.AiConversationMessageWhereUniqueInput;
};
export type AiConversationMessageUpdateOneWithoutAttachmentsNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutAttachmentsInput, Prisma.AiConversationMessageUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.AiConversationMessageCreateOrConnectWithoutAttachmentsInput;
    upsert?: Prisma.AiConversationMessageUpsertWithoutAttachmentsInput;
    disconnect?: Prisma.AiConversationMessageWhereInput | boolean;
    delete?: Prisma.AiConversationMessageWhereInput | boolean;
    connect?: Prisma.AiConversationMessageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AiConversationMessageUpdateToOneWithWhereWithoutAttachmentsInput, Prisma.AiConversationMessageUpdateWithoutAttachmentsInput>, Prisma.AiConversationMessageUncheckedUpdateWithoutAttachmentsInput>;
};
export type AiConversationMessageCreateNestedManyWithoutConversationInput = {
    create?: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutConversationInput, Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput> | Prisma.AiConversationMessageCreateWithoutConversationInput[] | Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput | Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput[];
    createMany?: Prisma.AiConversationMessageCreateManyConversationInputEnvelope;
    connect?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
};
export type AiConversationMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutConversationInput, Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput> | Prisma.AiConversationMessageCreateWithoutConversationInput[] | Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput | Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput[];
    createMany?: Prisma.AiConversationMessageCreateManyConversationInputEnvelope;
    connect?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
};
export type AiConversationMessageUpdateManyWithoutConversationNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutConversationInput, Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput> | Prisma.AiConversationMessageCreateWithoutConversationInput[] | Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput | Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput[];
    upsert?: Prisma.AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput | Prisma.AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput[];
    createMany?: Prisma.AiConversationMessageCreateManyConversationInputEnvelope;
    set?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    disconnect?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    delete?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    connect?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    update?: Prisma.AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput | Prisma.AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput[];
    updateMany?: Prisma.AiConversationMessageUpdateManyWithWhereWithoutConversationInput | Prisma.AiConversationMessageUpdateManyWithWhereWithoutConversationInput[];
    deleteMany?: Prisma.AiConversationMessageScalarWhereInput | Prisma.AiConversationMessageScalarWhereInput[];
};
export type AiConversationMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutConversationInput, Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput> | Prisma.AiConversationMessageCreateWithoutConversationInput[] | Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput[];
    connectOrCreate?: Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput | Prisma.AiConversationMessageCreateOrConnectWithoutConversationInput[];
    upsert?: Prisma.AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput | Prisma.AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput[];
    createMany?: Prisma.AiConversationMessageCreateManyConversationInputEnvelope;
    set?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    disconnect?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    delete?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    connect?: Prisma.AiConversationMessageWhereUniqueInput | Prisma.AiConversationMessageWhereUniqueInput[];
    update?: Prisma.AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput | Prisma.AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput[];
    updateMany?: Prisma.AiConversationMessageUpdateManyWithWhereWithoutConversationInput | Prisma.AiConversationMessageUpdateManyWithWhereWithoutConversationInput[];
    deleteMany?: Prisma.AiConversationMessageScalarWhereInput | Prisma.AiConversationMessageScalarWhereInput[];
};
export type EnumAiMessageRoleFieldUpdateOperationsInput = {
    set?: $Enums.AiMessageRole;
};
export type EnumAiMessageStatusFieldUpdateOperationsInput = {
    set?: $Enums.AiMessageStatus;
};
export type AiConversationMessageCreateWithoutAttachmentsInput = {
    id?: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
    conversation: Prisma.AiConversationCreateNestedOneWithoutMessagesInput;
};
export type AiConversationMessageUncheckedCreateWithoutAttachmentsInput = {
    id?: string;
    conversationId: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
};
export type AiConversationMessageCreateOrConnectWithoutAttachmentsInput = {
    where: Prisma.AiConversationMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutAttachmentsInput, Prisma.AiConversationMessageUncheckedCreateWithoutAttachmentsInput>;
};
export type AiConversationMessageUpsertWithoutAttachmentsInput = {
    update: Prisma.XOR<Prisma.AiConversationMessageUpdateWithoutAttachmentsInput, Prisma.AiConversationMessageUncheckedUpdateWithoutAttachmentsInput>;
    create: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutAttachmentsInput, Prisma.AiConversationMessageUncheckedCreateWithoutAttachmentsInput>;
    where?: Prisma.AiConversationMessageWhereInput;
};
export type AiConversationMessageUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: Prisma.AiConversationMessageWhereInput;
    data: Prisma.XOR<Prisma.AiConversationMessageUpdateWithoutAttachmentsInput, Prisma.AiConversationMessageUncheckedUpdateWithoutAttachmentsInput>;
};
export type AiConversationMessageUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    conversation?: Prisma.AiConversationUpdateOneRequiredWithoutMessagesNestedInput;
};
export type AiConversationMessageUncheckedUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    conversationId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiConversationMessageCreateWithoutConversationInput = {
    id?: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutAiConversationMessageInput;
};
export type AiConversationMessageUncheckedCreateWithoutConversationInput = {
    id?: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutAiConversationMessageInput;
};
export type AiConversationMessageCreateOrConnectWithoutConversationInput = {
    where: Prisma.AiConversationMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutConversationInput, Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput>;
};
export type AiConversationMessageCreateManyConversationInputEnvelope = {
    data: Prisma.AiConversationMessageCreateManyConversationInput | Prisma.AiConversationMessageCreateManyConversationInput[];
    skipDuplicates?: boolean;
};
export type AiConversationMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: Prisma.AiConversationMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.AiConversationMessageUpdateWithoutConversationInput, Prisma.AiConversationMessageUncheckedUpdateWithoutConversationInput>;
    create: Prisma.XOR<Prisma.AiConversationMessageCreateWithoutConversationInput, Prisma.AiConversationMessageUncheckedCreateWithoutConversationInput>;
};
export type AiConversationMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: Prisma.AiConversationMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.AiConversationMessageUpdateWithoutConversationInput, Prisma.AiConversationMessageUncheckedUpdateWithoutConversationInput>;
};
export type AiConversationMessageUpdateManyWithWhereWithoutConversationInput = {
    where: Prisma.AiConversationMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.AiConversationMessageUpdateManyMutationInput, Prisma.AiConversationMessageUncheckedUpdateManyWithoutConversationInput>;
};
export type AiConversationMessageScalarWhereInput = {
    AND?: Prisma.AiConversationMessageScalarWhereInput | Prisma.AiConversationMessageScalarWhereInput[];
    OR?: Prisma.AiConversationMessageScalarWhereInput[];
    NOT?: Prisma.AiConversationMessageScalarWhereInput | Prisma.AiConversationMessageScalarWhereInput[];
    id?: Prisma.StringFilter<"AiConversationMessage"> | string;
    conversationId?: Prisma.StringFilter<"AiConversationMessage"> | string;
    role?: Prisma.EnumAiMessageRoleFilter<"AiConversationMessage"> | $Enums.AiMessageRole;
    content?: Prisma.StringFilter<"AiConversationMessage"> | string;
    status?: Prisma.EnumAiMessageStatusFilter<"AiConversationMessage"> | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFilter<"AiConversationMessage"> | Date | string;
};
export type AiConversationMessageCreateManyConversationInput = {
    id?: string;
    role: $Enums.AiMessageRole;
    content: string;
    status?: $Enums.AiMessageStatus;
    createdAt?: Date | string;
};
export type AiConversationMessageUpdateWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attachments?: Prisma.AttachmentUpdateManyWithoutAiConversationMessageNestedInput;
};
export type AiConversationMessageUncheckedUpdateWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutAiConversationMessageNestedInput;
};
export type AiConversationMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumAiMessageRoleFieldUpdateOperationsInput | $Enums.AiMessageRole;
    content?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAiMessageStatusFieldUpdateOperationsInput | $Enums.AiMessageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AiConversationMessageCountOutputType = {
    attachments: number;
};
export type AiConversationMessageCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    attachments?: boolean | AiConversationMessageCountOutputTypeCountAttachmentsArgs;
};
export type AiConversationMessageCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageCountOutputTypeSelect<ExtArgs> | null;
};
export type AiConversationMessageCountOutputTypeCountAttachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AttachmentWhereInput;
};
export type AiConversationMessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    conversationId?: boolean;
    role?: boolean;
    content?: boolean;
    status?: boolean;
    createdAt?: boolean;
    conversation?: boolean | Prisma.AiConversationDefaultArgs<ExtArgs>;
    attachments?: boolean | Prisma.AiConversationMessage$attachmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.AiConversationMessageCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiConversationMessage"]>;
export type AiConversationMessageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    conversationId?: boolean;
    role?: boolean;
    content?: boolean;
    status?: boolean;
    createdAt?: boolean;
    conversation?: boolean | Prisma.AiConversationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiConversationMessage"]>;
export type AiConversationMessageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    conversationId?: boolean;
    role?: boolean;
    content?: boolean;
    status?: boolean;
    createdAt?: boolean;
    conversation?: boolean | Prisma.AiConversationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["aiConversationMessage"]>;
export type AiConversationMessageSelectScalar = {
    id?: boolean;
    conversationId?: boolean;
    role?: boolean;
    content?: boolean;
    status?: boolean;
    createdAt?: boolean;
};
export type AiConversationMessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "conversationId" | "role" | "content" | "status" | "createdAt", ExtArgs["result"]["aiConversationMessage"]>;
export type AiConversationMessageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    conversation?: boolean | Prisma.AiConversationDefaultArgs<ExtArgs>;
    attachments?: boolean | Prisma.AiConversationMessage$attachmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.AiConversationMessageCountOutputTypeDefaultArgs<ExtArgs>;
};
export type AiConversationMessageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    conversation?: boolean | Prisma.AiConversationDefaultArgs<ExtArgs>;
};
export type AiConversationMessageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    conversation?: boolean | Prisma.AiConversationDefaultArgs<ExtArgs>;
};
export type $AiConversationMessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AiConversationMessage";
    objects: {
        conversation: Prisma.$AiConversationPayload<ExtArgs>;
        attachments: Prisma.$AttachmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        conversationId: string;
        role: $Enums.AiMessageRole;
        content: string;
        status: $Enums.AiMessageStatus;
        createdAt: Date;
    }, ExtArgs["result"]["aiConversationMessage"]>;
    composites: {};
};
export type AiConversationMessageGetPayload<S extends boolean | null | undefined | AiConversationMessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload, S>;
export type AiConversationMessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AiConversationMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AiConversationMessageCountAggregateInputType | true;
};
export interface AiConversationMessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AiConversationMessage'];
        meta: {
            name: 'AiConversationMessage';
        };
    };
    findUnique<T extends AiConversationMessageFindUniqueArgs>(args: Prisma.SelectSubset<T, AiConversationMessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AiConversationMessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AiConversationMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AiConversationMessageFindFirstArgs>(args?: Prisma.SelectSubset<T, AiConversationMessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AiConversationMessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AiConversationMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AiConversationMessageFindManyArgs>(args?: Prisma.SelectSubset<T, AiConversationMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AiConversationMessageCreateArgs>(args: Prisma.SelectSubset<T, AiConversationMessageCreateArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AiConversationMessageCreateManyArgs>(args?: Prisma.SelectSubset<T, AiConversationMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AiConversationMessageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AiConversationMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AiConversationMessageDeleteArgs>(args: Prisma.SelectSubset<T, AiConversationMessageDeleteArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AiConversationMessageUpdateArgs>(args: Prisma.SelectSubset<T, AiConversationMessageUpdateArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AiConversationMessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, AiConversationMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AiConversationMessageUpdateManyArgs>(args: Prisma.SelectSubset<T, AiConversationMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AiConversationMessageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AiConversationMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AiConversationMessageUpsertArgs>(args: Prisma.SelectSubset<T, AiConversationMessageUpsertArgs<ExtArgs>>): Prisma.Prisma__AiConversationMessageClient<runtime.Types.Result.GetResult<Prisma.$AiConversationMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AiConversationMessageCountArgs>(args?: Prisma.Subset<T, AiConversationMessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AiConversationMessageCountAggregateOutputType> : number>;
    aggregate<T extends AiConversationMessageAggregateArgs>(args: Prisma.Subset<T, AiConversationMessageAggregateArgs>): Prisma.PrismaPromise<GetAiConversationMessageAggregateType<T>>;
    groupBy<T extends AiConversationMessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AiConversationMessageGroupByArgs['orderBy'];
    } : {
        orderBy?: AiConversationMessageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AiConversationMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiConversationMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AiConversationMessageFieldRefs;
}
export interface Prisma__AiConversationMessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    conversation<T extends Prisma.AiConversationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AiConversationDefaultArgs<ExtArgs>>): Prisma.Prisma__AiConversationClient<runtime.Types.Result.GetResult<Prisma.$AiConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    attachments<T extends Prisma.AiConversationMessage$attachmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AiConversationMessage$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AiConversationMessageFieldRefs {
    readonly id: Prisma.FieldRef<"AiConversationMessage", 'String'>;
    readonly conversationId: Prisma.FieldRef<"AiConversationMessage", 'String'>;
    readonly role: Prisma.FieldRef<"AiConversationMessage", 'AiMessageRole'>;
    readonly content: Prisma.FieldRef<"AiConversationMessage", 'String'>;
    readonly status: Prisma.FieldRef<"AiConversationMessage", 'AiMessageStatus'>;
    readonly createdAt: Prisma.FieldRef<"AiConversationMessage", 'DateTime'>;
}
export type AiConversationMessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
    where: Prisma.AiConversationMessageWhereUniqueInput;
};
export type AiConversationMessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
    where: Prisma.AiConversationMessageWhereUniqueInput;
};
export type AiConversationMessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AiConversationMessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AiConversationMessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AiConversationMessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiConversationMessageCreateInput, Prisma.AiConversationMessageUncheckedCreateInput>;
};
export type AiConversationMessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AiConversationMessageCreateManyInput | Prisma.AiConversationMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AiConversationMessageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    data: Prisma.AiConversationMessageCreateManyInput | Prisma.AiConversationMessageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AiConversationMessageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AiConversationMessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiConversationMessageUpdateInput, Prisma.AiConversationMessageUncheckedUpdateInput>;
    where: Prisma.AiConversationMessageWhereUniqueInput;
};
export type AiConversationMessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AiConversationMessageUpdateManyMutationInput, Prisma.AiConversationMessageUncheckedUpdateManyInput>;
    where?: Prisma.AiConversationMessageWhereInput;
    limit?: number;
};
export type AiConversationMessageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AiConversationMessageUpdateManyMutationInput, Prisma.AiConversationMessageUncheckedUpdateManyInput>;
    where?: Prisma.AiConversationMessageWhereInput;
    limit?: number;
    include?: Prisma.AiConversationMessageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AiConversationMessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
    where: Prisma.AiConversationMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.AiConversationMessageCreateInput, Prisma.AiConversationMessageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AiConversationMessageUpdateInput, Prisma.AiConversationMessageUncheckedUpdateInput>;
};
export type AiConversationMessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
    where: Prisma.AiConversationMessageWhereUniqueInput;
};
export type AiConversationMessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AiConversationMessageWhereInput;
    limit?: number;
};
export type AiConversationMessage$attachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AiConversationMessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AiConversationMessageSelect<ExtArgs> | null;
    omit?: Prisma.AiConversationMessageOmit<ExtArgs> | null;
    include?: Prisma.AiConversationMessageInclude<ExtArgs> | null;
};
