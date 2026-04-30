import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type NotificationModel = runtime.Types.Result.DefaultSelection<Prisma.$NotificationPayload>;
export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null;
    _min: NotificationMinAggregateOutputType | null;
    _max: NotificationMaxAggregateOutputType | null;
};
export type NotificationMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: string | null;
    title: string | null;
    message: string | null;
    referenceType: string | null;
    referenceId: string | null;
    actorId: string | null;
    isRead: boolean | null;
    readAt: Date | null;
    isCleared: boolean | null;
    isSnoozed: boolean | null;
    snoozedAt: Date | null;
    createdAt: Date | null;
};
export type NotificationMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: string | null;
    title: string | null;
    message: string | null;
    referenceType: string | null;
    referenceId: string | null;
    actorId: string | null;
    isRead: boolean | null;
    readAt: Date | null;
    isCleared: boolean | null;
    isSnoozed: boolean | null;
    snoozedAt: Date | null;
    createdAt: Date | null;
};
export type NotificationCountAggregateOutputType = {
    id: number;
    userId: number;
    type: number;
    title: number;
    message: number;
    referenceType: number;
    referenceId: number;
    actorId: number;
    isRead: number;
    readAt: number;
    isCleared: number;
    isSnoozed: number;
    snoozedAt: number;
    createdAt: number;
    _all: number;
};
export type NotificationMinAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    title?: true;
    message?: true;
    referenceType?: true;
    referenceId?: true;
    actorId?: true;
    isRead?: true;
    readAt?: true;
    isCleared?: true;
    isSnoozed?: true;
    snoozedAt?: true;
    createdAt?: true;
};
export type NotificationMaxAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    title?: true;
    message?: true;
    referenceType?: true;
    referenceId?: true;
    actorId?: true;
    isRead?: true;
    readAt?: true;
    isCleared?: true;
    isSnoozed?: true;
    snoozedAt?: true;
    createdAt?: true;
};
export type NotificationCountAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    title?: true;
    message?: true;
    referenceType?: true;
    referenceId?: true;
    actorId?: true;
    isRead?: true;
    readAt?: true;
    isCleared?: true;
    isSnoozed?: true;
    snoozedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type NotificationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | NotificationCountAggregateInputType;
    _min?: NotificationMinAggregateInputType;
    _max?: NotificationMaxAggregateInputType;
};
export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
    [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateNotification[P]> : Prisma.GetScalarType<T[P], AggregateNotification[P]>;
};
export type NotificationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithAggregationInput | Prisma.NotificationOrderByWithAggregationInput[];
    by: Prisma.NotificationScalarFieldEnum[] | Prisma.NotificationScalarFieldEnum;
    having?: Prisma.NotificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NotificationCountAggregateInputType | true;
    _min?: NotificationMinAggregateInputType;
    _max?: NotificationMaxAggregateInputType;
};
export type NotificationGroupByOutputType = {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string | null;
    referenceType: string;
    referenceId: string;
    actorId: string | null;
    isRead: boolean;
    readAt: Date | null;
    isCleared: boolean;
    isSnoozed: boolean;
    snoozedAt: Date | null;
    createdAt: Date;
    _count: NotificationCountAggregateOutputType | null;
    _min: NotificationMinAggregateOutputType | null;
    _max: NotificationMaxAggregateOutputType | null;
};
export type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<NotificationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], NotificationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], NotificationGroupByOutputType[P]>;
}>>;
export type NotificationWhereInput = {
    AND?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    OR?: Prisma.NotificationWhereInput[];
    NOT?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    id?: Prisma.StringFilter<"Notification"> | string;
    userId?: Prisma.StringFilter<"Notification"> | string;
    type?: Prisma.StringFilter<"Notification"> | string;
    title?: Prisma.StringFilter<"Notification"> | string;
    message?: Prisma.StringNullableFilter<"Notification"> | string | null;
    referenceType?: Prisma.StringFilter<"Notification"> | string;
    referenceId?: Prisma.StringFilter<"Notification"> | string;
    actorId?: Prisma.StringNullableFilter<"Notification"> | string | null;
    isRead?: Prisma.BoolFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    isCleared?: Prisma.BoolFilter<"Notification"> | boolean;
    isSnoozed?: Prisma.BoolFilter<"Notification"> | boolean;
    snoozedAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Notification"> | Date | string;
    recipient?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    actor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type NotificationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrderInput | Prisma.SortOrder;
    referenceType?: Prisma.SortOrder;
    referenceId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    isCleared?: Prisma.SortOrder;
    isSnoozed?: Prisma.SortOrder;
    snoozedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    recipient?: Prisma.UserOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    OR?: Prisma.NotificationWhereInput[];
    NOT?: Prisma.NotificationWhereInput | Prisma.NotificationWhereInput[];
    userId?: Prisma.StringFilter<"Notification"> | string;
    type?: Prisma.StringFilter<"Notification"> | string;
    title?: Prisma.StringFilter<"Notification"> | string;
    message?: Prisma.StringNullableFilter<"Notification"> | string | null;
    referenceType?: Prisma.StringFilter<"Notification"> | string;
    referenceId?: Prisma.StringFilter<"Notification"> | string;
    actorId?: Prisma.StringNullableFilter<"Notification"> | string | null;
    isRead?: Prisma.BoolFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    isCleared?: Prisma.BoolFilter<"Notification"> | boolean;
    isSnoozed?: Prisma.BoolFilter<"Notification"> | boolean;
    snoozedAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Notification"> | Date | string;
    recipient?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    actor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type NotificationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrderInput | Prisma.SortOrder;
    referenceType?: Prisma.SortOrder;
    referenceId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrderInput | Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    isCleared?: Prisma.SortOrder;
    isSnoozed?: Prisma.SortOrder;
    snoozedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.NotificationCountOrderByAggregateInput;
    _max?: Prisma.NotificationMaxOrderByAggregateInput;
    _min?: Prisma.NotificationMinOrderByAggregateInput;
};
export type NotificationScalarWhereWithAggregatesInput = {
    AND?: Prisma.NotificationScalarWhereWithAggregatesInput | Prisma.NotificationScalarWhereWithAggregatesInput[];
    OR?: Prisma.NotificationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.NotificationScalarWhereWithAggregatesInput | Prisma.NotificationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    type?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    message?: Prisma.StringNullableWithAggregatesFilter<"Notification"> | string | null;
    referenceType?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    referenceId?: Prisma.StringWithAggregatesFilter<"Notification"> | string;
    actorId?: Prisma.StringNullableWithAggregatesFilter<"Notification"> | string | null;
    isRead?: Prisma.BoolWithAggregatesFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null;
    isCleared?: Prisma.BoolWithAggregatesFilter<"Notification"> | boolean;
    isSnoozed?: Prisma.BoolWithAggregatesFilter<"Notification"> | boolean;
    snoozedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Notification"> | Date | string;
};
export type NotificationCreateInput = {
    id?: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
    recipient: Prisma.UserCreateNestedOneWithoutNotificationsReceivedInput;
    actor?: Prisma.UserCreateNestedOneWithoutNotificationsTriggeredInput;
};
export type NotificationUncheckedCreateInput = {
    id?: string;
    userId: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    actorId?: string | null;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recipient?: Prisma.UserUpdateOneRequiredWithoutNotificationsReceivedNestedInput;
    actor?: Prisma.UserUpdateOneWithoutNotificationsTriggeredNestedInput;
};
export type NotificationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationCreateManyInput = {
    id?: string;
    userId: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    actorId?: string | null;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationListRelationFilter = {
    every?: Prisma.NotificationWhereInput;
    some?: Prisma.NotificationWhereInput;
    none?: Prisma.NotificationWhereInput;
};
export type NotificationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NotificationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    referenceType?: Prisma.SortOrder;
    referenceId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    isCleared?: Prisma.SortOrder;
    isSnoozed?: Prisma.SortOrder;
    snoozedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type NotificationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    referenceType?: Prisma.SortOrder;
    referenceId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    isCleared?: Prisma.SortOrder;
    isSnoozed?: Prisma.SortOrder;
    snoozedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type NotificationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    referenceType?: Prisma.SortOrder;
    referenceId?: Prisma.SortOrder;
    actorId?: Prisma.SortOrder;
    isRead?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    isCleared?: Prisma.SortOrder;
    isSnoozed?: Prisma.SortOrder;
    snoozedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type NotificationCreateNestedManyWithoutRecipientInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutRecipientInput, Prisma.NotificationUncheckedCreateWithoutRecipientInput> | Prisma.NotificationCreateWithoutRecipientInput[] | Prisma.NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutRecipientInput | Prisma.NotificationCreateOrConnectWithoutRecipientInput[];
    createMany?: Prisma.NotificationCreateManyRecipientInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutActorInput, Prisma.NotificationUncheckedCreateWithoutActorInput> | Prisma.NotificationCreateWithoutActorInput[] | Prisma.NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutActorInput | Prisma.NotificationCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.NotificationCreateManyActorInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUncheckedCreateNestedManyWithoutRecipientInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutRecipientInput, Prisma.NotificationUncheckedCreateWithoutRecipientInput> | Prisma.NotificationCreateWithoutRecipientInput[] | Prisma.NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutRecipientInput | Prisma.NotificationCreateOrConnectWithoutRecipientInput[];
    createMany?: Prisma.NotificationCreateManyRecipientInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutActorInput, Prisma.NotificationUncheckedCreateWithoutActorInput> | Prisma.NotificationCreateWithoutActorInput[] | Prisma.NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutActorInput | Prisma.NotificationCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.NotificationCreateManyActorInputEnvelope;
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
};
export type NotificationUpdateManyWithoutRecipientNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutRecipientInput, Prisma.NotificationUncheckedCreateWithoutRecipientInput> | Prisma.NotificationCreateWithoutRecipientInput[] | Prisma.NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutRecipientInput | Prisma.NotificationCreateOrConnectWithoutRecipientInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutRecipientInput | Prisma.NotificationUpsertWithWhereUniqueWithoutRecipientInput[];
    createMany?: Prisma.NotificationCreateManyRecipientInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutRecipientInput | Prisma.NotificationUpdateWithWhereUniqueWithoutRecipientInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutRecipientInput | Prisma.NotificationUpdateManyWithWhereWithoutRecipientInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutActorInput, Prisma.NotificationUncheckedCreateWithoutActorInput> | Prisma.NotificationCreateWithoutActorInput[] | Prisma.NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutActorInput | Prisma.NotificationCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutActorInput | Prisma.NotificationUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.NotificationCreateManyActorInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutActorInput | Prisma.NotificationUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutActorInput | Prisma.NotificationUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationUncheckedUpdateManyWithoutRecipientNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutRecipientInput, Prisma.NotificationUncheckedCreateWithoutRecipientInput> | Prisma.NotificationCreateWithoutRecipientInput[] | Prisma.NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutRecipientInput | Prisma.NotificationCreateOrConnectWithoutRecipientInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutRecipientInput | Prisma.NotificationUpsertWithWhereUniqueWithoutRecipientInput[];
    createMany?: Prisma.NotificationCreateManyRecipientInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutRecipientInput | Prisma.NotificationUpdateWithWhereUniqueWithoutRecipientInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutRecipientInput | Prisma.NotificationUpdateManyWithWhereWithoutRecipientInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.NotificationCreateWithoutActorInput, Prisma.NotificationUncheckedCreateWithoutActorInput> | Prisma.NotificationCreateWithoutActorInput[] | Prisma.NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.NotificationCreateOrConnectWithoutActorInput | Prisma.NotificationCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.NotificationUpsertWithWhereUniqueWithoutActorInput | Prisma.NotificationUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.NotificationCreateManyActorInputEnvelope;
    set?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    disconnect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    delete?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    connect?: Prisma.NotificationWhereUniqueInput | Prisma.NotificationWhereUniqueInput[];
    update?: Prisma.NotificationUpdateWithWhereUniqueWithoutActorInput | Prisma.NotificationUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.NotificationUpdateManyWithWhereWithoutActorInput | Prisma.NotificationUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
};
export type NotificationCreateWithoutRecipientInput = {
    id?: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
    actor?: Prisma.UserCreateNestedOneWithoutNotificationsTriggeredInput;
};
export type NotificationUncheckedCreateWithoutRecipientInput = {
    id?: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    actorId?: string | null;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationCreateOrConnectWithoutRecipientInput = {
    where: Prisma.NotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutRecipientInput, Prisma.NotificationUncheckedCreateWithoutRecipientInput>;
};
export type NotificationCreateManyRecipientInputEnvelope = {
    data: Prisma.NotificationCreateManyRecipientInput | Prisma.NotificationCreateManyRecipientInput[];
    skipDuplicates?: boolean;
};
export type NotificationCreateWithoutActorInput = {
    id?: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
    recipient: Prisma.UserCreateNestedOneWithoutNotificationsReceivedInput;
};
export type NotificationUncheckedCreateWithoutActorInput = {
    id?: string;
    userId: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationCreateOrConnectWithoutActorInput = {
    where: Prisma.NotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutActorInput, Prisma.NotificationUncheckedCreateWithoutActorInput>;
};
export type NotificationCreateManyActorInputEnvelope = {
    data: Prisma.NotificationCreateManyActorInput | Prisma.NotificationCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type NotificationUpsertWithWhereUniqueWithoutRecipientInput = {
    where: Prisma.NotificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.NotificationUpdateWithoutRecipientInput, Prisma.NotificationUncheckedUpdateWithoutRecipientInput>;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutRecipientInput, Prisma.NotificationUncheckedCreateWithoutRecipientInput>;
};
export type NotificationUpdateWithWhereUniqueWithoutRecipientInput = {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.NotificationUpdateWithoutRecipientInput, Prisma.NotificationUncheckedUpdateWithoutRecipientInput>;
};
export type NotificationUpdateManyWithWhereWithoutRecipientInput = {
    where: Prisma.NotificationScalarWhereInput;
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyWithoutRecipientInput>;
};
export type NotificationScalarWhereInput = {
    AND?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
    OR?: Prisma.NotificationScalarWhereInput[];
    NOT?: Prisma.NotificationScalarWhereInput | Prisma.NotificationScalarWhereInput[];
    id?: Prisma.StringFilter<"Notification"> | string;
    userId?: Prisma.StringFilter<"Notification"> | string;
    type?: Prisma.StringFilter<"Notification"> | string;
    title?: Prisma.StringFilter<"Notification"> | string;
    message?: Prisma.StringNullableFilter<"Notification"> | string | null;
    referenceType?: Prisma.StringFilter<"Notification"> | string;
    referenceId?: Prisma.StringFilter<"Notification"> | string;
    actorId?: Prisma.StringNullableFilter<"Notification"> | string | null;
    isRead?: Prisma.BoolFilter<"Notification"> | boolean;
    readAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    isCleared?: Prisma.BoolFilter<"Notification"> | boolean;
    isSnoozed?: Prisma.BoolFilter<"Notification"> | boolean;
    snoozedAt?: Prisma.DateTimeNullableFilter<"Notification"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Notification"> | Date | string;
};
export type NotificationUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.NotificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.NotificationUpdateWithoutActorInput, Prisma.NotificationUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.NotificationCreateWithoutActorInput, Prisma.NotificationUncheckedCreateWithoutActorInput>;
};
export type NotificationUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.NotificationUpdateWithoutActorInput, Prisma.NotificationUncheckedUpdateWithoutActorInput>;
};
export type NotificationUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.NotificationScalarWhereInput;
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyWithoutActorInput>;
};
export type NotificationCreateManyRecipientInput = {
    id?: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    actorId?: string | null;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationCreateManyActorInput = {
    id?: string;
    userId: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType: string;
    referenceId: string;
    isRead?: boolean;
    readAt?: Date | string | null;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type NotificationUpdateWithoutRecipientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: Prisma.UserUpdateOneWithoutNotificationsTriggeredNestedInput;
};
export type NotificationUncheckedUpdateWithoutRecipientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUncheckedUpdateManyWithoutRecipientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    actorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recipient?: Prisma.UserUpdateOneRequiredWithoutNotificationsReceivedNestedInput;
};
export type NotificationUncheckedUpdateWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referenceType?: Prisma.StringFieldUpdateOperationsInput | string;
    referenceId?: Prisma.StringFieldUpdateOperationsInput | string;
    isRead?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    readAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isCleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isSnoozed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    snoozedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NotificationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    message?: boolean;
    referenceType?: boolean;
    referenceId?: boolean;
    actorId?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: boolean;
    createdAt?: boolean;
    recipient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.Notification$actorArgs<ExtArgs>;
}, ExtArgs["result"]["notification"]>;
export type NotificationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    message?: boolean;
    referenceType?: boolean;
    referenceId?: boolean;
    actorId?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: boolean;
    createdAt?: boolean;
    recipient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.Notification$actorArgs<ExtArgs>;
}, ExtArgs["result"]["notification"]>;
export type NotificationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    message?: boolean;
    referenceType?: boolean;
    referenceId?: boolean;
    actorId?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: boolean;
    createdAt?: boolean;
    recipient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.Notification$actorArgs<ExtArgs>;
}, ExtArgs["result"]["notification"]>;
export type NotificationSelectScalar = {
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    title?: boolean;
    message?: boolean;
    referenceType?: boolean;
    referenceId?: boolean;
    actorId?: boolean;
    isRead?: boolean;
    readAt?: boolean;
    isCleared?: boolean;
    isSnoozed?: boolean;
    snoozedAt?: boolean;
    createdAt?: boolean;
};
export type NotificationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "type" | "title" | "message" | "referenceType" | "referenceId" | "actorId" | "isRead" | "readAt" | "isCleared" | "isSnoozed" | "snoozedAt" | "createdAt", ExtArgs["result"]["notification"]>;
export type NotificationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    recipient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.Notification$actorArgs<ExtArgs>;
};
export type NotificationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    recipient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.Notification$actorArgs<ExtArgs>;
};
export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    recipient?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.Notification$actorArgs<ExtArgs>;
};
export type $NotificationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Notification";
    objects: {
        recipient: Prisma.$UserPayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        type: string;
        title: string;
        message: string | null;
        referenceType: string;
        referenceId: string;
        actorId: string | null;
        isRead: boolean;
        readAt: Date | null;
        isCleared: boolean;
        isSnoozed: boolean;
        snoozedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["notification"]>;
    composites: {};
};
export type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$NotificationPayload, S>;
export type NotificationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: NotificationCountAggregateInputType | true;
};
export interface NotificationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Notification'];
        meta: {
            name: 'Notification';
        };
    };
    findUnique<T extends NotificationFindUniqueArgs>(args: Prisma.SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends NotificationFindFirstArgs>(args?: Prisma.SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends NotificationFindManyArgs>(args?: Prisma.SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends NotificationCreateArgs>(args: Prisma.SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends NotificationCreateManyArgs>(args?: Prisma.SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends NotificationDeleteArgs>(args: Prisma.SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends NotificationUpdateArgs>(args: Prisma.SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends NotificationDeleteManyArgs>(args?: Prisma.SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends NotificationUpdateManyArgs>(args: Prisma.SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends NotificationUpsertArgs>(args: Prisma.SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma.Prisma__NotificationClient<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends NotificationCountArgs>(args?: Prisma.Subset<T, NotificationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], NotificationCountAggregateOutputType> : number>;
    aggregate<T extends NotificationAggregateArgs>(args: Prisma.Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>;
    groupBy<T extends NotificationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: NotificationGroupByArgs['orderBy'];
    } : {
        orderBy?: NotificationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: NotificationFieldRefs;
}
export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    recipient<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.Notification$actorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Notification$actorArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface NotificationFieldRefs {
    readonly id: Prisma.FieldRef<"Notification", 'String'>;
    readonly userId: Prisma.FieldRef<"Notification", 'String'>;
    readonly type: Prisma.FieldRef<"Notification", 'String'>;
    readonly title: Prisma.FieldRef<"Notification", 'String'>;
    readonly message: Prisma.FieldRef<"Notification", 'String'>;
    readonly referenceType: Prisma.FieldRef<"Notification", 'String'>;
    readonly referenceId: Prisma.FieldRef<"Notification", 'String'>;
    readonly actorId: Prisma.FieldRef<"Notification", 'String'>;
    readonly isRead: Prisma.FieldRef<"Notification", 'Boolean'>;
    readonly readAt: Prisma.FieldRef<"Notification", 'DateTime'>;
    readonly isCleared: Prisma.FieldRef<"Notification", 'Boolean'>;
    readonly isSnoozed: Prisma.FieldRef<"Notification", 'Boolean'>;
    readonly snoozedAt: Prisma.FieldRef<"Notification", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Notification", 'DateTime'>;
}
export type NotificationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
export type NotificationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
export type NotificationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
export type NotificationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NotificationCreateInput, Prisma.NotificationUncheckedCreateInput>;
};
export type NotificationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.NotificationCreateManyInput | Prisma.NotificationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type NotificationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    data: Prisma.NotificationCreateManyInput | Prisma.NotificationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.NotificationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type NotificationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NotificationUpdateInput, Prisma.NotificationUncheckedUpdateInput>;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyInput>;
    where?: Prisma.NotificationWhereInput;
    limit?: number;
};
export type NotificationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NotificationUpdateManyMutationInput, Prisma.NotificationUncheckedUpdateManyInput>;
    where?: Prisma.NotificationWhereInput;
    limit?: number;
    include?: Prisma.NotificationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type NotificationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.NotificationCreateInput, Prisma.NotificationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.NotificationUpdateInput, Prisma.NotificationUncheckedUpdateInput>;
};
export type NotificationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where: Prisma.NotificationWhereUniqueInput;
};
export type NotificationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
    limit?: number;
};
export type Notification$actorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type NotificationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    include?: Prisma.NotificationInclude<ExtArgs> | null;
};
