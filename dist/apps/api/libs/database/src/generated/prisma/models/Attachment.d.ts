import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type AttachmentModel = runtime.Types.Result.DefaultSelection<Prisma.$AttachmentPayload>;
export type AggregateAttachment = {
    _count: AttachmentCountAggregateOutputType | null;
    _avg: AttachmentAvgAggregateOutputType | null;
    _sum: AttachmentSumAggregateOutputType | null;
    _min: AttachmentMinAggregateOutputType | null;
    _max: AttachmentMaxAggregateOutputType | null;
};
export type AttachmentAvgAggregateOutputType = {
    fileSize: number | null;
};
export type AttachmentSumAggregateOutputType = {
    fileSize: bigint | null;
};
export type AttachmentMinAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    uploadedBy: string | null;
    fileName: string | null;
    s3Key: string | null;
    mimeType: string | null;
    fileSize: bigint | null;
    createdAt: Date | null;
    deletedAt: Date | null;
};
export type AttachmentMaxAggregateOutputType = {
    id: string | null;
    taskId: string | null;
    uploadedBy: string | null;
    fileName: string | null;
    s3Key: string | null;
    mimeType: string | null;
    fileSize: bigint | null;
    createdAt: Date | null;
    deletedAt: Date | null;
};
export type AttachmentCountAggregateOutputType = {
    id: number;
    taskId: number;
    uploadedBy: number;
    fileName: number;
    s3Key: number;
    mimeType: number;
    fileSize: number;
    createdAt: number;
    deletedAt: number;
    _all: number;
};
export type AttachmentAvgAggregateInputType = {
    fileSize?: true;
};
export type AttachmentSumAggregateInputType = {
    fileSize?: true;
};
export type AttachmentMinAggregateInputType = {
    id?: true;
    taskId?: true;
    uploadedBy?: true;
    fileName?: true;
    s3Key?: true;
    mimeType?: true;
    fileSize?: true;
    createdAt?: true;
    deletedAt?: true;
};
export type AttachmentMaxAggregateInputType = {
    id?: true;
    taskId?: true;
    uploadedBy?: true;
    fileName?: true;
    s3Key?: true;
    mimeType?: true;
    fileSize?: true;
    createdAt?: true;
    deletedAt?: true;
};
export type AttachmentCountAggregateInputType = {
    id?: true;
    taskId?: true;
    uploadedBy?: true;
    fileName?: true;
    s3Key?: true;
    mimeType?: true;
    fileSize?: true;
    createdAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type AttachmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AttachmentWhereInput;
    orderBy?: Prisma.AttachmentOrderByWithRelationInput | Prisma.AttachmentOrderByWithRelationInput[];
    cursor?: Prisma.AttachmentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AttachmentCountAggregateInputType;
    _avg?: AttachmentAvgAggregateInputType;
    _sum?: AttachmentSumAggregateInputType;
    _min?: AttachmentMinAggregateInputType;
    _max?: AttachmentMaxAggregateInputType;
};
export type GetAttachmentAggregateType<T extends AttachmentAggregateArgs> = {
    [P in keyof T & keyof AggregateAttachment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAttachment[P]> : Prisma.GetScalarType<T[P], AggregateAttachment[P]>;
};
export type AttachmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AttachmentWhereInput;
    orderBy?: Prisma.AttachmentOrderByWithAggregationInput | Prisma.AttachmentOrderByWithAggregationInput[];
    by: Prisma.AttachmentScalarFieldEnum[] | Prisma.AttachmentScalarFieldEnum;
    having?: Prisma.AttachmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AttachmentCountAggregateInputType | true;
    _avg?: AttachmentAvgAggregateInputType;
    _sum?: AttachmentSumAggregateInputType;
    _min?: AttachmentMinAggregateInputType;
    _max?: AttachmentMaxAggregateInputType;
};
export type AttachmentGroupByOutputType = {
    id: string;
    taskId: string;
    uploadedBy: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint;
    createdAt: Date;
    deletedAt: Date | null;
    _count: AttachmentCountAggregateOutputType | null;
    _avg: AttachmentAvgAggregateOutputType | null;
    _sum: AttachmentSumAggregateOutputType | null;
    _min: AttachmentMinAggregateOutputType | null;
    _max: AttachmentMaxAggregateOutputType | null;
};
export type GetAttachmentGroupByPayload<T extends AttachmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AttachmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AttachmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AttachmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AttachmentGroupByOutputType[P]>;
}>>;
export type AttachmentWhereInput = {
    AND?: Prisma.AttachmentWhereInput | Prisma.AttachmentWhereInput[];
    OR?: Prisma.AttachmentWhereInput[];
    NOT?: Prisma.AttachmentWhereInput | Prisma.AttachmentWhereInput[];
    id?: Prisma.StringFilter<"Attachment"> | string;
    taskId?: Prisma.StringFilter<"Attachment"> | string;
    uploadedBy?: Prisma.StringFilter<"Attachment"> | string;
    fileName?: Prisma.StringFilter<"Attachment"> | string;
    s3Key?: Prisma.StringFilter<"Attachment"> | string;
    mimeType?: Prisma.StringFilter<"Attachment"> | string;
    fileSize?: Prisma.BigIntFilter<"Attachment"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"Attachment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Attachment"> | Date | string | null;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    uploader?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type AttachmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    uploadedBy?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    s3Key?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    fileSize?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    task?: Prisma.TaskOrderByWithRelationInput;
    uploader?: Prisma.UserOrderByWithRelationInput;
};
export type AttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    s3Key?: string;
    AND?: Prisma.AttachmentWhereInput | Prisma.AttachmentWhereInput[];
    OR?: Prisma.AttachmentWhereInput[];
    NOT?: Prisma.AttachmentWhereInput | Prisma.AttachmentWhereInput[];
    taskId?: Prisma.StringFilter<"Attachment"> | string;
    uploadedBy?: Prisma.StringFilter<"Attachment"> | string;
    fileName?: Prisma.StringFilter<"Attachment"> | string;
    mimeType?: Prisma.StringFilter<"Attachment"> | string;
    fileSize?: Prisma.BigIntFilter<"Attachment"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"Attachment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Attachment"> | Date | string | null;
    task?: Prisma.XOR<Prisma.TaskScalarRelationFilter, Prisma.TaskWhereInput>;
    uploader?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "s3Key">;
export type AttachmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    uploadedBy?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    s3Key?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    fileSize?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.AttachmentCountOrderByAggregateInput;
    _avg?: Prisma.AttachmentAvgOrderByAggregateInput;
    _max?: Prisma.AttachmentMaxOrderByAggregateInput;
    _min?: Prisma.AttachmentMinOrderByAggregateInput;
    _sum?: Prisma.AttachmentSumOrderByAggregateInput;
};
export type AttachmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.AttachmentScalarWhereWithAggregatesInput | Prisma.AttachmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.AttachmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AttachmentScalarWhereWithAggregatesInput | Prisma.AttachmentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Attachment"> | string;
    taskId?: Prisma.StringWithAggregatesFilter<"Attachment"> | string;
    uploadedBy?: Prisma.StringWithAggregatesFilter<"Attachment"> | string;
    fileName?: Prisma.StringWithAggregatesFilter<"Attachment"> | string;
    s3Key?: Prisma.StringWithAggregatesFilter<"Attachment"> | string;
    mimeType?: Prisma.StringWithAggregatesFilter<"Attachment"> | string;
    fileSize?: Prisma.BigIntWithAggregatesFilter<"Attachment"> | bigint | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Attachment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Attachment"> | Date | string | null;
};
export type AttachmentCreateInput = {
    id?: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutAttachmentsInput;
    uploader: Prisma.UserCreateNestedOneWithoutAttachmentsUploadedInput;
};
export type AttachmentUncheckedCreateInput = {
    id?: string;
    taskId: string;
    uploadedBy: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AttachmentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutAttachmentsNestedInput;
    uploader?: Prisma.UserUpdateOneRequiredWithoutAttachmentsUploadedNestedInput;
};
export type AttachmentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    uploadedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AttachmentCreateManyInput = {
    id?: string;
    taskId: string;
    uploadedBy: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AttachmentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AttachmentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    uploadedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AttachmentListRelationFilter = {
    every?: Prisma.AttachmentWhereInput;
    some?: Prisma.AttachmentWhereInput;
    none?: Prisma.AttachmentWhereInput;
};
export type AttachmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AttachmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    uploadedBy?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    s3Key?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    fileSize?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type AttachmentAvgOrderByAggregateInput = {
    fileSize?: Prisma.SortOrder;
};
export type AttachmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    uploadedBy?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    s3Key?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    fileSize?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type AttachmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    taskId?: Prisma.SortOrder;
    uploadedBy?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    s3Key?: Prisma.SortOrder;
    mimeType?: Prisma.SortOrder;
    fileSize?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type AttachmentSumOrderByAggregateInput = {
    fileSize?: Prisma.SortOrder;
};
export type AttachmentCreateNestedManyWithoutUploaderInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutUploaderInput, Prisma.AttachmentUncheckedCreateWithoutUploaderInput> | Prisma.AttachmentCreateWithoutUploaderInput[] | Prisma.AttachmentUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutUploaderInput | Prisma.AttachmentCreateOrConnectWithoutUploaderInput[];
    createMany?: Prisma.AttachmentCreateManyUploaderInputEnvelope;
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
};
export type AttachmentUncheckedCreateNestedManyWithoutUploaderInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutUploaderInput, Prisma.AttachmentUncheckedCreateWithoutUploaderInput> | Prisma.AttachmentCreateWithoutUploaderInput[] | Prisma.AttachmentUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutUploaderInput | Prisma.AttachmentCreateOrConnectWithoutUploaderInput[];
    createMany?: Prisma.AttachmentCreateManyUploaderInputEnvelope;
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
};
export type AttachmentUpdateManyWithoutUploaderNestedInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutUploaderInput, Prisma.AttachmentUncheckedCreateWithoutUploaderInput> | Prisma.AttachmentCreateWithoutUploaderInput[] | Prisma.AttachmentUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutUploaderInput | Prisma.AttachmentCreateOrConnectWithoutUploaderInput[];
    upsert?: Prisma.AttachmentUpsertWithWhereUniqueWithoutUploaderInput | Prisma.AttachmentUpsertWithWhereUniqueWithoutUploaderInput[];
    createMany?: Prisma.AttachmentCreateManyUploaderInputEnvelope;
    set?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    disconnect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    delete?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    update?: Prisma.AttachmentUpdateWithWhereUniqueWithoutUploaderInput | Prisma.AttachmentUpdateWithWhereUniqueWithoutUploaderInput[];
    updateMany?: Prisma.AttachmentUpdateManyWithWhereWithoutUploaderInput | Prisma.AttachmentUpdateManyWithWhereWithoutUploaderInput[];
    deleteMany?: Prisma.AttachmentScalarWhereInput | Prisma.AttachmentScalarWhereInput[];
};
export type AttachmentUncheckedUpdateManyWithoutUploaderNestedInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutUploaderInput, Prisma.AttachmentUncheckedCreateWithoutUploaderInput> | Prisma.AttachmentCreateWithoutUploaderInput[] | Prisma.AttachmentUncheckedCreateWithoutUploaderInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutUploaderInput | Prisma.AttachmentCreateOrConnectWithoutUploaderInput[];
    upsert?: Prisma.AttachmentUpsertWithWhereUniqueWithoutUploaderInput | Prisma.AttachmentUpsertWithWhereUniqueWithoutUploaderInput[];
    createMany?: Prisma.AttachmentCreateManyUploaderInputEnvelope;
    set?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    disconnect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    delete?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    update?: Prisma.AttachmentUpdateWithWhereUniqueWithoutUploaderInput | Prisma.AttachmentUpdateWithWhereUniqueWithoutUploaderInput[];
    updateMany?: Prisma.AttachmentUpdateManyWithWhereWithoutUploaderInput | Prisma.AttachmentUpdateManyWithWhereWithoutUploaderInput[];
    deleteMany?: Prisma.AttachmentScalarWhereInput | Prisma.AttachmentScalarWhereInput[];
};
export type AttachmentCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutTaskInput, Prisma.AttachmentUncheckedCreateWithoutTaskInput> | Prisma.AttachmentCreateWithoutTaskInput[] | Prisma.AttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutTaskInput | Prisma.AttachmentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.AttachmentCreateManyTaskInputEnvelope;
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
};
export type AttachmentUncheckedCreateNestedManyWithoutTaskInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutTaskInput, Prisma.AttachmentUncheckedCreateWithoutTaskInput> | Prisma.AttachmentCreateWithoutTaskInput[] | Prisma.AttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutTaskInput | Prisma.AttachmentCreateOrConnectWithoutTaskInput[];
    createMany?: Prisma.AttachmentCreateManyTaskInputEnvelope;
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
};
export type AttachmentUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutTaskInput, Prisma.AttachmentUncheckedCreateWithoutTaskInput> | Prisma.AttachmentCreateWithoutTaskInput[] | Prisma.AttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutTaskInput | Prisma.AttachmentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.AttachmentUpsertWithWhereUniqueWithoutTaskInput | Prisma.AttachmentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.AttachmentCreateManyTaskInputEnvelope;
    set?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    disconnect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    delete?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    update?: Prisma.AttachmentUpdateWithWhereUniqueWithoutTaskInput | Prisma.AttachmentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.AttachmentUpdateManyWithWhereWithoutTaskInput | Prisma.AttachmentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.AttachmentScalarWhereInput | Prisma.AttachmentScalarWhereInput[];
};
export type AttachmentUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: Prisma.XOR<Prisma.AttachmentCreateWithoutTaskInput, Prisma.AttachmentUncheckedCreateWithoutTaskInput> | Prisma.AttachmentCreateWithoutTaskInput[] | Prisma.AttachmentUncheckedCreateWithoutTaskInput[];
    connectOrCreate?: Prisma.AttachmentCreateOrConnectWithoutTaskInput | Prisma.AttachmentCreateOrConnectWithoutTaskInput[];
    upsert?: Prisma.AttachmentUpsertWithWhereUniqueWithoutTaskInput | Prisma.AttachmentUpsertWithWhereUniqueWithoutTaskInput[];
    createMany?: Prisma.AttachmentCreateManyTaskInputEnvelope;
    set?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    disconnect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    delete?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    connect?: Prisma.AttachmentWhereUniqueInput | Prisma.AttachmentWhereUniqueInput[];
    update?: Prisma.AttachmentUpdateWithWhereUniqueWithoutTaskInput | Prisma.AttachmentUpdateWithWhereUniqueWithoutTaskInput[];
    updateMany?: Prisma.AttachmentUpdateManyWithWhereWithoutTaskInput | Prisma.AttachmentUpdateManyWithWhereWithoutTaskInput[];
    deleteMany?: Prisma.AttachmentScalarWhereInput | Prisma.AttachmentScalarWhereInput[];
};
export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type AttachmentCreateWithoutUploaderInput = {
    id?: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    task: Prisma.TaskCreateNestedOneWithoutAttachmentsInput;
};
export type AttachmentUncheckedCreateWithoutUploaderInput = {
    id?: string;
    taskId: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AttachmentCreateOrConnectWithoutUploaderInput = {
    where: Prisma.AttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AttachmentCreateWithoutUploaderInput, Prisma.AttachmentUncheckedCreateWithoutUploaderInput>;
};
export type AttachmentCreateManyUploaderInputEnvelope = {
    data: Prisma.AttachmentCreateManyUploaderInput | Prisma.AttachmentCreateManyUploaderInput[];
    skipDuplicates?: boolean;
};
export type AttachmentUpsertWithWhereUniqueWithoutUploaderInput = {
    where: Prisma.AttachmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.AttachmentUpdateWithoutUploaderInput, Prisma.AttachmentUncheckedUpdateWithoutUploaderInput>;
    create: Prisma.XOR<Prisma.AttachmentCreateWithoutUploaderInput, Prisma.AttachmentUncheckedCreateWithoutUploaderInput>;
};
export type AttachmentUpdateWithWhereUniqueWithoutUploaderInput = {
    where: Prisma.AttachmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.AttachmentUpdateWithoutUploaderInput, Prisma.AttachmentUncheckedUpdateWithoutUploaderInput>;
};
export type AttachmentUpdateManyWithWhereWithoutUploaderInput = {
    where: Prisma.AttachmentScalarWhereInput;
    data: Prisma.XOR<Prisma.AttachmentUpdateManyMutationInput, Prisma.AttachmentUncheckedUpdateManyWithoutUploaderInput>;
};
export type AttachmentScalarWhereInput = {
    AND?: Prisma.AttachmentScalarWhereInput | Prisma.AttachmentScalarWhereInput[];
    OR?: Prisma.AttachmentScalarWhereInput[];
    NOT?: Prisma.AttachmentScalarWhereInput | Prisma.AttachmentScalarWhereInput[];
    id?: Prisma.StringFilter<"Attachment"> | string;
    taskId?: Prisma.StringFilter<"Attachment"> | string;
    uploadedBy?: Prisma.StringFilter<"Attachment"> | string;
    fileName?: Prisma.StringFilter<"Attachment"> | string;
    s3Key?: Prisma.StringFilter<"Attachment"> | string;
    mimeType?: Prisma.StringFilter<"Attachment"> | string;
    fileSize?: Prisma.BigIntFilter<"Attachment"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"Attachment"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Attachment"> | Date | string | null;
};
export type AttachmentCreateWithoutTaskInput = {
    id?: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    uploader: Prisma.UserCreateNestedOneWithoutAttachmentsUploadedInput;
};
export type AttachmentUncheckedCreateWithoutTaskInput = {
    id?: string;
    uploadedBy: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AttachmentCreateOrConnectWithoutTaskInput = {
    where: Prisma.AttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AttachmentCreateWithoutTaskInput, Prisma.AttachmentUncheckedCreateWithoutTaskInput>;
};
export type AttachmentCreateManyTaskInputEnvelope = {
    data: Prisma.AttachmentCreateManyTaskInput | Prisma.AttachmentCreateManyTaskInput[];
    skipDuplicates?: boolean;
};
export type AttachmentUpsertWithWhereUniqueWithoutTaskInput = {
    where: Prisma.AttachmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.AttachmentUpdateWithoutTaskInput, Prisma.AttachmentUncheckedUpdateWithoutTaskInput>;
    create: Prisma.XOR<Prisma.AttachmentCreateWithoutTaskInput, Prisma.AttachmentUncheckedCreateWithoutTaskInput>;
};
export type AttachmentUpdateWithWhereUniqueWithoutTaskInput = {
    where: Prisma.AttachmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.AttachmentUpdateWithoutTaskInput, Prisma.AttachmentUncheckedUpdateWithoutTaskInput>;
};
export type AttachmentUpdateManyWithWhereWithoutTaskInput = {
    where: Prisma.AttachmentScalarWhereInput;
    data: Prisma.XOR<Prisma.AttachmentUpdateManyMutationInput, Prisma.AttachmentUncheckedUpdateManyWithoutTaskInput>;
};
export type AttachmentCreateManyUploaderInput = {
    id?: string;
    taskId: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AttachmentUpdateWithoutUploaderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    task?: Prisma.TaskUpdateOneRequiredWithoutAttachmentsNestedInput;
};
export type AttachmentUncheckedUpdateWithoutUploaderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AttachmentUncheckedUpdateManyWithoutUploaderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    taskId?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AttachmentCreateManyTaskInput = {
    id?: string;
    uploadedBy: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint | number;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type AttachmentUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    uploader?: Prisma.UserUpdateOneRequiredWithoutAttachmentsUploadedNestedInput;
};
export type AttachmentUncheckedUpdateWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    uploadedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AttachmentUncheckedUpdateManyWithoutTaskInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    uploadedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    s3Key?: Prisma.StringFieldUpdateOperationsInput | string;
    mimeType?: Prisma.StringFieldUpdateOperationsInput | string;
    fileSize?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AttachmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    uploadedBy?: boolean;
    fileName?: boolean;
    s3Key?: boolean;
    mimeType?: boolean;
    fileSize?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    uploader?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["attachment"]>;
export type AttachmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    uploadedBy?: boolean;
    fileName?: boolean;
    s3Key?: boolean;
    mimeType?: boolean;
    fileSize?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    uploader?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["attachment"]>;
export type AttachmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    taskId?: boolean;
    uploadedBy?: boolean;
    fileName?: boolean;
    s3Key?: boolean;
    mimeType?: boolean;
    fileSize?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    uploader?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["attachment"]>;
export type AttachmentSelectScalar = {
    id?: boolean;
    taskId?: boolean;
    uploadedBy?: boolean;
    fileName?: boolean;
    s3Key?: boolean;
    mimeType?: boolean;
    fileSize?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
};
export type AttachmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "taskId" | "uploadedBy" | "fileName" | "s3Key" | "mimeType" | "fileSize" | "createdAt" | "deletedAt", ExtArgs["result"]["attachment"]>;
export type AttachmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    uploader?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AttachmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    uploader?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AttachmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    task?: boolean | Prisma.TaskDefaultArgs<ExtArgs>;
    uploader?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AttachmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Attachment";
    objects: {
        task: Prisma.$TaskPayload<ExtArgs>;
        uploader: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        taskId: string;
        uploadedBy: string;
        fileName: string;
        s3Key: string;
        mimeType: string;
        fileSize: bigint;
        createdAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["attachment"]>;
    composites: {};
};
export type AttachmentGetPayload<S extends boolean | null | undefined | AttachmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AttachmentPayload, S>;
export type AttachmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AttachmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AttachmentCountAggregateInputType | true;
};
export interface AttachmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Attachment'];
        meta: {
            name: 'Attachment';
        };
    };
    findUnique<T extends AttachmentFindUniqueArgs>(args: Prisma.SelectSubset<T, AttachmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AttachmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AttachmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AttachmentFindFirstArgs>(args?: Prisma.SelectSubset<T, AttachmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AttachmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AttachmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AttachmentFindManyArgs>(args?: Prisma.SelectSubset<T, AttachmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AttachmentCreateArgs>(args: Prisma.SelectSubset<T, AttachmentCreateArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AttachmentCreateManyArgs>(args?: Prisma.SelectSubset<T, AttachmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AttachmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AttachmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AttachmentDeleteArgs>(args: Prisma.SelectSubset<T, AttachmentDeleteArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AttachmentUpdateArgs>(args: Prisma.SelectSubset<T, AttachmentUpdateArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AttachmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, AttachmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AttachmentUpdateManyArgs>(args: Prisma.SelectSubset<T, AttachmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AttachmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AttachmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AttachmentUpsertArgs>(args: Prisma.SelectSubset<T, AttachmentUpsertArgs<ExtArgs>>): Prisma.Prisma__AttachmentClient<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AttachmentCountArgs>(args?: Prisma.Subset<T, AttachmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AttachmentCountAggregateOutputType> : number>;
    aggregate<T extends AttachmentAggregateArgs>(args: Prisma.Subset<T, AttachmentAggregateArgs>): Prisma.PrismaPromise<GetAttachmentAggregateType<T>>;
    groupBy<T extends AttachmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AttachmentGroupByArgs['orderBy'];
    } : {
        orderBy?: AttachmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AttachmentFieldRefs;
}
export interface Prisma__AttachmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    task<T extends Prisma.TaskDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TaskDefaultArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    uploader<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AttachmentFieldRefs {
    readonly id: Prisma.FieldRef<"Attachment", 'String'>;
    readonly taskId: Prisma.FieldRef<"Attachment", 'String'>;
    readonly uploadedBy: Prisma.FieldRef<"Attachment", 'String'>;
    readonly fileName: Prisma.FieldRef<"Attachment", 'String'>;
    readonly s3Key: Prisma.FieldRef<"Attachment", 'String'>;
    readonly mimeType: Prisma.FieldRef<"Attachment", 'String'>;
    readonly fileSize: Prisma.FieldRef<"Attachment", 'BigInt'>;
    readonly createdAt: Prisma.FieldRef<"Attachment", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Attachment", 'DateTime'>;
}
export type AttachmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
    where: Prisma.AttachmentWhereUniqueInput;
};
export type AttachmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
    where: Prisma.AttachmentWhereUniqueInput;
};
export type AttachmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AttachmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AttachmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type AttachmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AttachmentCreateInput, Prisma.AttachmentUncheckedCreateInput>;
};
export type AttachmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AttachmentCreateManyInput | Prisma.AttachmentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AttachmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    data: Prisma.AttachmentCreateManyInput | Prisma.AttachmentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AttachmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AttachmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AttachmentUpdateInput, Prisma.AttachmentUncheckedUpdateInput>;
    where: Prisma.AttachmentWhereUniqueInput;
};
export type AttachmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AttachmentUpdateManyMutationInput, Prisma.AttachmentUncheckedUpdateManyInput>;
    where?: Prisma.AttachmentWhereInput;
    limit?: number;
};
export type AttachmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AttachmentUpdateManyMutationInput, Prisma.AttachmentUncheckedUpdateManyInput>;
    where?: Prisma.AttachmentWhereInput;
    limit?: number;
    include?: Prisma.AttachmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AttachmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
    where: Prisma.AttachmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.AttachmentCreateInput, Prisma.AttachmentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AttachmentUpdateInput, Prisma.AttachmentUncheckedUpdateInput>;
};
export type AttachmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
    where: Prisma.AttachmentWhereUniqueInput;
};
export type AttachmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AttachmentWhereInput;
    limit?: number;
};
export type AttachmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AttachmentSelect<ExtArgs> | null;
    omit?: Prisma.AttachmentOmit<ExtArgs> | null;
    include?: Prisma.AttachmentInclude<ExtArgs> | null;
};
