import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DocModel = runtime.Types.Result.DefaultSelection<Prisma.$DocPayload>;
export type AggregateDoc = {
    _count: DocCountAggregateOutputType | null;
    _avg: DocAvgAggregateOutputType | null;
    _sum: DocSumAggregateOutputType | null;
    _min: DocMinAggregateOutputType | null;
    _max: DocMaxAggregateOutputType | null;
};
export type DocAvgAggregateOutputType = {
    version: number | null;
};
export type DocSumAggregateOutputType = {
    version: number | null;
};
export type DocMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    projectId: string | null;
    ownerId: string | null;
    scope: $Enums.DocScope | null;
    title: string | null;
    plaintext: string | null;
    version: number | null;
    lastCheckpointAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type DocMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    projectId: string | null;
    ownerId: string | null;
    scope: $Enums.DocScope | null;
    title: string | null;
    plaintext: string | null;
    version: number | null;
    lastCheckpointAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type DocCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    projectId: number;
    ownerId: number;
    scope: number;
    title: number;
    contentJson: number;
    plaintext: number;
    version: number;
    lastCheckpointAt: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type DocAvgAggregateInputType = {
    version?: true;
};
export type DocSumAggregateInputType = {
    version?: true;
};
export type DocMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    projectId?: true;
    ownerId?: true;
    scope?: true;
    title?: true;
    plaintext?: true;
    version?: true;
    lastCheckpointAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type DocMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    projectId?: true;
    ownerId?: true;
    scope?: true;
    title?: true;
    plaintext?: true;
    version?: true;
    lastCheckpointAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type DocCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    projectId?: true;
    ownerId?: true;
    scope?: true;
    title?: true;
    contentJson?: true;
    plaintext?: true;
    version?: true;
    lastCheckpointAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type DocAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocWhereInput;
    orderBy?: Prisma.DocOrderByWithRelationInput | Prisma.DocOrderByWithRelationInput[];
    cursor?: Prisma.DocWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocCountAggregateInputType;
    _avg?: DocAvgAggregateInputType;
    _sum?: DocSumAggregateInputType;
    _min?: DocMinAggregateInputType;
    _max?: DocMaxAggregateInputType;
};
export type GetDocAggregateType<T extends DocAggregateArgs> = {
    [P in keyof T & keyof AggregateDoc]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDoc[P]> : Prisma.GetScalarType<T[P], AggregateDoc[P]>;
};
export type DocGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocWhereInput;
    orderBy?: Prisma.DocOrderByWithAggregationInput | Prisma.DocOrderByWithAggregationInput[];
    by: Prisma.DocScalarFieldEnum[] | Prisma.DocScalarFieldEnum;
    having?: Prisma.DocScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocCountAggregateInputType | true;
    _avg?: DocAvgAggregateInputType;
    _sum?: DocSumAggregateInputType;
    _min?: DocMinAggregateInputType;
    _max?: DocMaxAggregateInputType;
};
export type DocGroupByOutputType = {
    id: string;
    workspaceId: string;
    projectId: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson: runtime.JsonValue;
    plaintext: string;
    version: number;
    lastCheckpointAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: DocCountAggregateOutputType | null;
    _avg: DocAvgAggregateOutputType | null;
    _sum: DocSumAggregateOutputType | null;
    _min: DocMinAggregateOutputType | null;
    _max: DocMaxAggregateOutputType | null;
};
export type GetDocGroupByPayload<T extends DocGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocGroupByOutputType[P]>;
}>>;
export type DocWhereInput = {
    AND?: Prisma.DocWhereInput | Prisma.DocWhereInput[];
    OR?: Prisma.DocWhereInput[];
    NOT?: Prisma.DocWhereInput | Prisma.DocWhereInput[];
    id?: Prisma.StringFilter<"Doc"> | string;
    workspaceId?: Prisma.StringFilter<"Doc"> | string;
    projectId?: Prisma.StringNullableFilter<"Doc"> | string | null;
    ownerId?: Prisma.StringFilter<"Doc"> | string;
    scope?: Prisma.EnumDocScopeFilter<"Doc"> | $Enums.DocScope;
    title?: Prisma.StringFilter<"Doc"> | string;
    contentJson?: Prisma.JsonFilter<"Doc">;
    plaintext?: Prisma.StringFilter<"Doc"> | string;
    version?: Prisma.IntFilter<"Doc"> | number;
    lastCheckpointAt?: Prisma.DateTimeNullableFilter<"Doc"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Doc"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Doc"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Doc"> | Date | string | null;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    project?: Prisma.XOR<Prisma.ProjectNullableScalarRelationFilter, Prisma.ProjectWhereInput> | null;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    versions?: Prisma.DocVersionListRelationFilter;
    permissions?: Prisma.DocPermissionListRelationFilter;
    threads?: Prisma.DocCommentThreadListRelationFilter;
    shareLinks?: Prisma.DocShareLinkListRelationFilter;
    attachments?: Prisma.AttachmentListRelationFilter;
};
export type DocOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    contentJson?: Prisma.SortOrder;
    plaintext?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    lastCheckpointAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    project?: Prisma.ProjectOrderByWithRelationInput;
    owner?: Prisma.UserOrderByWithRelationInput;
    versions?: Prisma.DocVersionOrderByRelationAggregateInput;
    permissions?: Prisma.DocPermissionOrderByRelationAggregateInput;
    threads?: Prisma.DocCommentThreadOrderByRelationAggregateInput;
    shareLinks?: Prisma.DocShareLinkOrderByRelationAggregateInput;
    attachments?: Prisma.AttachmentOrderByRelationAggregateInput;
};
export type DocWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.DocWhereInput | Prisma.DocWhereInput[];
    OR?: Prisma.DocWhereInput[];
    NOT?: Prisma.DocWhereInput | Prisma.DocWhereInput[];
    workspaceId?: Prisma.StringFilter<"Doc"> | string;
    projectId?: Prisma.StringNullableFilter<"Doc"> | string | null;
    ownerId?: Prisma.StringFilter<"Doc"> | string;
    scope?: Prisma.EnumDocScopeFilter<"Doc"> | $Enums.DocScope;
    title?: Prisma.StringFilter<"Doc"> | string;
    contentJson?: Prisma.JsonFilter<"Doc">;
    plaintext?: Prisma.StringFilter<"Doc"> | string;
    version?: Prisma.IntFilter<"Doc"> | number;
    lastCheckpointAt?: Prisma.DateTimeNullableFilter<"Doc"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Doc"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Doc"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Doc"> | Date | string | null;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    project?: Prisma.XOR<Prisma.ProjectNullableScalarRelationFilter, Prisma.ProjectWhereInput> | null;
    owner?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    versions?: Prisma.DocVersionListRelationFilter;
    permissions?: Prisma.DocPermissionListRelationFilter;
    threads?: Prisma.DocCommentThreadListRelationFilter;
    shareLinks?: Prisma.DocShareLinkListRelationFilter;
    attachments?: Prisma.AttachmentListRelationFilter;
}, "id">;
export type DocOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrderInput | Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    contentJson?: Prisma.SortOrder;
    plaintext?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    lastCheckpointAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.DocCountOrderByAggregateInput;
    _avg?: Prisma.DocAvgOrderByAggregateInput;
    _max?: Prisma.DocMaxOrderByAggregateInput;
    _min?: Prisma.DocMinOrderByAggregateInput;
    _sum?: Prisma.DocSumOrderByAggregateInput;
};
export type DocScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocScalarWhereWithAggregatesInput | Prisma.DocScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocScalarWhereWithAggregatesInput | Prisma.DocScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Doc"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"Doc"> | string;
    projectId?: Prisma.StringNullableWithAggregatesFilter<"Doc"> | string | null;
    ownerId?: Prisma.StringWithAggregatesFilter<"Doc"> | string;
    scope?: Prisma.EnumDocScopeWithAggregatesFilter<"Doc"> | $Enums.DocScope;
    title?: Prisma.StringWithAggregatesFilter<"Doc"> | string;
    contentJson?: Prisma.JsonWithAggregatesFilter<"Doc">;
    plaintext?: Prisma.StringWithAggregatesFilter<"Doc"> | string;
    version?: Prisma.IntWithAggregatesFilter<"Doc"> | number;
    lastCheckpointAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Doc"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Doc"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Doc"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Doc"> | Date | string | null;
};
export type DocCreateInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocCreateManyInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocListRelationFilter = {
    every?: Prisma.DocWhereInput;
    some?: Prisma.DocWhereInput;
    none?: Prisma.DocWhereInput;
};
export type DocOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocNullableScalarRelationFilter = {
    is?: Prisma.DocWhereInput | null;
    isNot?: Prisma.DocWhereInput | null;
};
export type DocCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    contentJson?: Prisma.SortOrder;
    plaintext?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    lastCheckpointAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type DocAvgOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type DocMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    plaintext?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    lastCheckpointAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type DocMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    projectId?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    plaintext?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    lastCheckpointAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type DocSumOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type DocScalarRelationFilter = {
    is?: Prisma.DocWhereInput;
    isNot?: Prisma.DocWhereInput;
};
export type DocCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutOwnerInput, Prisma.DocUncheckedCreateWithoutOwnerInput> | Prisma.DocCreateWithoutOwnerInput[] | Prisma.DocUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutOwnerInput | Prisma.DocCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.DocCreateManyOwnerInputEnvelope;
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
};
export type DocUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutOwnerInput, Prisma.DocUncheckedCreateWithoutOwnerInput> | Prisma.DocCreateWithoutOwnerInput[] | Prisma.DocUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutOwnerInput | Prisma.DocCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.DocCreateManyOwnerInputEnvelope;
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
};
export type DocUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutOwnerInput, Prisma.DocUncheckedCreateWithoutOwnerInput> | Prisma.DocCreateWithoutOwnerInput[] | Prisma.DocUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutOwnerInput | Prisma.DocCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.DocUpsertWithWhereUniqueWithoutOwnerInput | Prisma.DocUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.DocCreateManyOwnerInputEnvelope;
    set?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    disconnect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    delete?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    update?: Prisma.DocUpdateWithWhereUniqueWithoutOwnerInput | Prisma.DocUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.DocUpdateManyWithWhereWithoutOwnerInput | Prisma.DocUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
};
export type DocUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutOwnerInput, Prisma.DocUncheckedCreateWithoutOwnerInput> | Prisma.DocCreateWithoutOwnerInput[] | Prisma.DocUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutOwnerInput | Prisma.DocCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.DocUpsertWithWhereUniqueWithoutOwnerInput | Prisma.DocUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.DocCreateManyOwnerInputEnvelope;
    set?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    disconnect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    delete?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    update?: Prisma.DocUpdateWithWhereUniqueWithoutOwnerInput | Prisma.DocUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.DocUpdateManyWithWhereWithoutOwnerInput | Prisma.DocUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
};
export type DocCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutWorkspaceInput, Prisma.DocUncheckedCreateWithoutWorkspaceInput> | Prisma.DocCreateWithoutWorkspaceInput[] | Prisma.DocUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutWorkspaceInput | Prisma.DocCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.DocCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
};
export type DocUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutWorkspaceInput, Prisma.DocUncheckedCreateWithoutWorkspaceInput> | Prisma.DocCreateWithoutWorkspaceInput[] | Prisma.DocUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutWorkspaceInput | Prisma.DocCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.DocCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
};
export type DocUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutWorkspaceInput, Prisma.DocUncheckedCreateWithoutWorkspaceInput> | Prisma.DocCreateWithoutWorkspaceInput[] | Prisma.DocUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutWorkspaceInput | Prisma.DocCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.DocUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.DocUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.DocCreateManyWorkspaceInputEnvelope;
    set?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    disconnect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    delete?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    update?: Prisma.DocUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.DocUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.DocUpdateManyWithWhereWithoutWorkspaceInput | Prisma.DocUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
};
export type DocUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutWorkspaceInput, Prisma.DocUncheckedCreateWithoutWorkspaceInput> | Prisma.DocCreateWithoutWorkspaceInput[] | Prisma.DocUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutWorkspaceInput | Prisma.DocCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.DocUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.DocUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.DocCreateManyWorkspaceInputEnvelope;
    set?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    disconnect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    delete?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    update?: Prisma.DocUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.DocUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.DocUpdateManyWithWhereWithoutWorkspaceInput | Prisma.DocUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
};
export type DocCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutProjectInput, Prisma.DocUncheckedCreateWithoutProjectInput> | Prisma.DocCreateWithoutProjectInput[] | Prisma.DocUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutProjectInput | Prisma.DocCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.DocCreateManyProjectInputEnvelope;
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
};
export type DocUncheckedCreateNestedManyWithoutProjectInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutProjectInput, Prisma.DocUncheckedCreateWithoutProjectInput> | Prisma.DocCreateWithoutProjectInput[] | Prisma.DocUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutProjectInput | Prisma.DocCreateOrConnectWithoutProjectInput[];
    createMany?: Prisma.DocCreateManyProjectInputEnvelope;
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
};
export type DocUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutProjectInput, Prisma.DocUncheckedCreateWithoutProjectInput> | Prisma.DocCreateWithoutProjectInput[] | Prisma.DocUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutProjectInput | Prisma.DocCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.DocUpsertWithWhereUniqueWithoutProjectInput | Prisma.DocUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.DocCreateManyProjectInputEnvelope;
    set?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    disconnect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    delete?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    update?: Prisma.DocUpdateWithWhereUniqueWithoutProjectInput | Prisma.DocUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.DocUpdateManyWithWhereWithoutProjectInput | Prisma.DocUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
};
export type DocUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutProjectInput, Prisma.DocUncheckedCreateWithoutProjectInput> | Prisma.DocCreateWithoutProjectInput[] | Prisma.DocUncheckedCreateWithoutProjectInput[];
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutProjectInput | Prisma.DocCreateOrConnectWithoutProjectInput[];
    upsert?: Prisma.DocUpsertWithWhereUniqueWithoutProjectInput | Prisma.DocUpsertWithWhereUniqueWithoutProjectInput[];
    createMany?: Prisma.DocCreateManyProjectInputEnvelope;
    set?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    disconnect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    delete?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    connect?: Prisma.DocWhereUniqueInput | Prisma.DocWhereUniqueInput[];
    update?: Prisma.DocUpdateWithWhereUniqueWithoutProjectInput | Prisma.DocUpdateWithWhereUniqueWithoutProjectInput[];
    updateMany?: Prisma.DocUpdateManyWithWhereWithoutProjectInput | Prisma.DocUpdateManyWithWhereWithoutProjectInput[];
    deleteMany?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
};
export type DocCreateNestedOneWithoutAttachmentsInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutAttachmentsInput, Prisma.DocUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutAttachmentsInput;
    connect?: Prisma.DocWhereUniqueInput;
};
export type DocUpdateOneWithoutAttachmentsNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutAttachmentsInput, Prisma.DocUncheckedCreateWithoutAttachmentsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutAttachmentsInput;
    upsert?: Prisma.DocUpsertWithoutAttachmentsInput;
    disconnect?: Prisma.DocWhereInput | boolean;
    delete?: Prisma.DocWhereInput | boolean;
    connect?: Prisma.DocWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocUpdateToOneWithWhereWithoutAttachmentsInput, Prisma.DocUpdateWithoutAttachmentsInput>, Prisma.DocUncheckedUpdateWithoutAttachmentsInput>;
};
export type EnumDocScopeFieldUpdateOperationsInput = {
    set?: $Enums.DocScope;
};
export type DocCreateNestedOneWithoutVersionsInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutVersionsInput, Prisma.DocUncheckedCreateWithoutVersionsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutVersionsInput;
    connect?: Prisma.DocWhereUniqueInput;
};
export type DocUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutVersionsInput, Prisma.DocUncheckedCreateWithoutVersionsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutVersionsInput;
    upsert?: Prisma.DocUpsertWithoutVersionsInput;
    connect?: Prisma.DocWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocUpdateToOneWithWhereWithoutVersionsInput, Prisma.DocUpdateWithoutVersionsInput>, Prisma.DocUncheckedUpdateWithoutVersionsInput>;
};
export type DocCreateNestedOneWithoutPermissionsInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutPermissionsInput, Prisma.DocUncheckedCreateWithoutPermissionsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutPermissionsInput;
    connect?: Prisma.DocWhereUniqueInput;
};
export type DocUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutPermissionsInput, Prisma.DocUncheckedCreateWithoutPermissionsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutPermissionsInput;
    upsert?: Prisma.DocUpsertWithoutPermissionsInput;
    connect?: Prisma.DocWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocUpdateToOneWithWhereWithoutPermissionsInput, Prisma.DocUpdateWithoutPermissionsInput>, Prisma.DocUncheckedUpdateWithoutPermissionsInput>;
};
export type DocCreateNestedOneWithoutThreadsInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutThreadsInput, Prisma.DocUncheckedCreateWithoutThreadsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutThreadsInput;
    connect?: Prisma.DocWhereUniqueInput;
};
export type DocUpdateOneRequiredWithoutThreadsNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutThreadsInput, Prisma.DocUncheckedCreateWithoutThreadsInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutThreadsInput;
    upsert?: Prisma.DocUpsertWithoutThreadsInput;
    connect?: Prisma.DocWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocUpdateToOneWithWhereWithoutThreadsInput, Prisma.DocUpdateWithoutThreadsInput>, Prisma.DocUncheckedUpdateWithoutThreadsInput>;
};
export type DocCreateNestedOneWithoutShareLinksInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutShareLinksInput, Prisma.DocUncheckedCreateWithoutShareLinksInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutShareLinksInput;
    connect?: Prisma.DocWhereUniqueInput;
};
export type DocUpdateOneRequiredWithoutShareLinksNestedInput = {
    create?: Prisma.XOR<Prisma.DocCreateWithoutShareLinksInput, Prisma.DocUncheckedCreateWithoutShareLinksInput>;
    connectOrCreate?: Prisma.DocCreateOrConnectWithoutShareLinksInput;
    upsert?: Prisma.DocUpsertWithoutShareLinksInput;
    connect?: Prisma.DocWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocUpdateToOneWithWhereWithoutShareLinksInput, Prisma.DocUpdateWithoutShareLinksInput>, Prisma.DocUncheckedUpdateWithoutShareLinksInput>;
};
export type DocCreateWithoutOwnerInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutOwnerInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutOwnerInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutOwnerInput, Prisma.DocUncheckedCreateWithoutOwnerInput>;
};
export type DocCreateManyOwnerInputEnvelope = {
    data: Prisma.DocCreateManyOwnerInput | Prisma.DocCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type DocUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.DocWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocUpdateWithoutOwnerInput, Prisma.DocUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutOwnerInput, Prisma.DocUncheckedCreateWithoutOwnerInput>;
};
export type DocUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.DocWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutOwnerInput, Prisma.DocUncheckedUpdateWithoutOwnerInput>;
};
export type DocUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.DocScalarWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateManyMutationInput, Prisma.DocUncheckedUpdateManyWithoutOwnerInput>;
};
export type DocScalarWhereInput = {
    AND?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
    OR?: Prisma.DocScalarWhereInput[];
    NOT?: Prisma.DocScalarWhereInput | Prisma.DocScalarWhereInput[];
    id?: Prisma.StringFilter<"Doc"> | string;
    workspaceId?: Prisma.StringFilter<"Doc"> | string;
    projectId?: Prisma.StringNullableFilter<"Doc"> | string | null;
    ownerId?: Prisma.StringFilter<"Doc"> | string;
    scope?: Prisma.EnumDocScopeFilter<"Doc"> | $Enums.DocScope;
    title?: Prisma.StringFilter<"Doc"> | string;
    contentJson?: Prisma.JsonFilter<"Doc">;
    plaintext?: Prisma.StringFilter<"Doc"> | string;
    version?: Prisma.IntFilter<"Doc"> | number;
    lastCheckpointAt?: Prisma.DateTimeNullableFilter<"Doc"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Doc"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Doc"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Doc"> | Date | string | null;
};
export type DocCreateWithoutWorkspaceInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutWorkspaceInput, Prisma.DocUncheckedCreateWithoutWorkspaceInput>;
};
export type DocCreateManyWorkspaceInputEnvelope = {
    data: Prisma.DocCreateManyWorkspaceInput | Prisma.DocCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type DocUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.DocWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocUpdateWithoutWorkspaceInput, Prisma.DocUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutWorkspaceInput, Prisma.DocUncheckedCreateWithoutWorkspaceInput>;
};
export type DocUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.DocWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutWorkspaceInput, Prisma.DocUncheckedUpdateWithoutWorkspaceInput>;
};
export type DocUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.DocScalarWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateManyMutationInput, Prisma.DocUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type DocCreateWithoutProjectInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutProjectInput = {
    id?: string;
    workspaceId: string;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutProjectInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutProjectInput, Prisma.DocUncheckedCreateWithoutProjectInput>;
};
export type DocCreateManyProjectInputEnvelope = {
    data: Prisma.DocCreateManyProjectInput | Prisma.DocCreateManyProjectInput[];
    skipDuplicates?: boolean;
};
export type DocUpsertWithWhereUniqueWithoutProjectInput = {
    where: Prisma.DocWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocUpdateWithoutProjectInput, Prisma.DocUncheckedUpdateWithoutProjectInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutProjectInput, Prisma.DocUncheckedCreateWithoutProjectInput>;
};
export type DocUpdateWithWhereUniqueWithoutProjectInput = {
    where: Prisma.DocWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutProjectInput, Prisma.DocUncheckedUpdateWithoutProjectInput>;
};
export type DocUpdateManyWithWhereWithoutProjectInput = {
    where: Prisma.DocScalarWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateManyMutationInput, Prisma.DocUncheckedUpdateManyWithoutProjectInput>;
};
export type DocCreateWithoutAttachmentsInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutAttachmentsInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutAttachmentsInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutAttachmentsInput, Prisma.DocUncheckedCreateWithoutAttachmentsInput>;
};
export type DocUpsertWithoutAttachmentsInput = {
    update: Prisma.XOR<Prisma.DocUpdateWithoutAttachmentsInput, Prisma.DocUncheckedUpdateWithoutAttachmentsInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutAttachmentsInput, Prisma.DocUncheckedCreateWithoutAttachmentsInput>;
    where?: Prisma.DocWhereInput;
};
export type DocUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: Prisma.DocWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutAttachmentsInput, Prisma.DocUncheckedUpdateWithoutAttachmentsInput>;
};
export type DocUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutAttachmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocCreateWithoutVersionsInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutVersionsInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutVersionsInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutVersionsInput, Prisma.DocUncheckedCreateWithoutVersionsInput>;
};
export type DocUpsertWithoutVersionsInput = {
    update: Prisma.XOR<Prisma.DocUpdateWithoutVersionsInput, Prisma.DocUncheckedUpdateWithoutVersionsInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutVersionsInput, Prisma.DocUncheckedCreateWithoutVersionsInput>;
    where?: Prisma.DocWhereInput;
};
export type DocUpdateToOneWithWhereWithoutVersionsInput = {
    where?: Prisma.DocWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutVersionsInput, Prisma.DocUncheckedUpdateWithoutVersionsInput>;
};
export type DocUpdateWithoutVersionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutVersionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocCreateWithoutPermissionsInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutPermissionsInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutPermissionsInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutPermissionsInput, Prisma.DocUncheckedCreateWithoutPermissionsInput>;
};
export type DocUpsertWithoutPermissionsInput = {
    update: Prisma.XOR<Prisma.DocUpdateWithoutPermissionsInput, Prisma.DocUncheckedUpdateWithoutPermissionsInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutPermissionsInput, Prisma.DocUncheckedCreateWithoutPermissionsInput>;
    where?: Prisma.DocWhereInput;
};
export type DocUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: Prisma.DocWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutPermissionsInput, Prisma.DocUncheckedUpdateWithoutPermissionsInput>;
};
export type DocUpdateWithoutPermissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutPermissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocCreateWithoutThreadsInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutThreadsInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    shareLinks?: Prisma.DocShareLinkUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutThreadsInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutThreadsInput, Prisma.DocUncheckedCreateWithoutThreadsInput>;
};
export type DocUpsertWithoutThreadsInput = {
    update: Prisma.XOR<Prisma.DocUpdateWithoutThreadsInput, Prisma.DocUncheckedUpdateWithoutThreadsInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutThreadsInput, Prisma.DocUncheckedCreateWithoutThreadsInput>;
    where?: Prisma.DocWhereInput;
};
export type DocUpdateToOneWithWhereWithoutThreadsInput = {
    where?: Prisma.DocWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutThreadsInput, Prisma.DocUncheckedUpdateWithoutThreadsInput>;
};
export type DocUpdateWithoutThreadsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutThreadsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocCreateWithoutShareLinksInput = {
    id?: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutDocsInput;
    project?: Prisma.ProjectCreateNestedOneWithoutDocsInput;
    owner: Prisma.UserCreateNestedOneWithoutDocsOwnedInput;
    versions?: Prisma.DocVersionCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentCreateNestedManyWithoutDocInput;
};
export type DocUncheckedCreateWithoutShareLinksInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    versions?: Prisma.DocVersionUncheckedCreateNestedManyWithoutDocInput;
    permissions?: Prisma.DocPermissionUncheckedCreateNestedManyWithoutDocInput;
    threads?: Prisma.DocCommentThreadUncheckedCreateNestedManyWithoutDocInput;
    attachments?: Prisma.AttachmentUncheckedCreateNestedManyWithoutDocInput;
};
export type DocCreateOrConnectWithoutShareLinksInput = {
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateWithoutShareLinksInput, Prisma.DocUncheckedCreateWithoutShareLinksInput>;
};
export type DocUpsertWithoutShareLinksInput = {
    update: Prisma.XOR<Prisma.DocUpdateWithoutShareLinksInput, Prisma.DocUncheckedUpdateWithoutShareLinksInput>;
    create: Prisma.XOR<Prisma.DocCreateWithoutShareLinksInput, Prisma.DocUncheckedCreateWithoutShareLinksInput>;
    where?: Prisma.DocWhereInput;
};
export type DocUpdateToOneWithWhereWithoutShareLinksInput = {
    where?: Prisma.DocWhereInput;
    data: Prisma.XOR<Prisma.DocUpdateWithoutShareLinksInput, Prisma.DocUncheckedUpdateWithoutShareLinksInput>;
};
export type DocUpdateWithoutShareLinksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutShareLinksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocCreateManyOwnerInput = {
    id?: string;
    workspaceId: string;
    projectId?: string | null;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCreateManyWorkspaceInput = {
    id?: string;
    projectId?: string | null;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    project?: Prisma.ProjectUpdateOneWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    projectId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCreateManyProjectInput = {
    id?: string;
    workspaceId: string;
    ownerId: string;
    scope: $Enums.DocScope;
    title: string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: string;
    version?: number;
    lastCheckpointAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type DocUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutDocsNestedInput;
    owner?: Prisma.UserUpdateOneRequiredWithoutDocsOwnedNestedInput;
    versions?: Prisma.DocVersionUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    versions?: Prisma.DocVersionUncheckedUpdateManyWithoutDocNestedInput;
    permissions?: Prisma.DocPermissionUncheckedUpdateManyWithoutDocNestedInput;
    threads?: Prisma.DocCommentThreadUncheckedUpdateManyWithoutDocNestedInput;
    shareLinks?: Prisma.DocShareLinkUncheckedUpdateManyWithoutDocNestedInput;
    attachments?: Prisma.AttachmentUncheckedUpdateManyWithoutDocNestedInput;
};
export type DocUncheckedUpdateManyWithoutProjectInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumDocScopeFieldUpdateOperationsInput | $Enums.DocScope;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    contentJson?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    plaintext?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckpointAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type DocCountOutputType = {
    versions: number;
    permissions: number;
    threads: number;
    shareLinks: number;
    attachments: number;
};
export type DocCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    versions?: boolean | DocCountOutputTypeCountVersionsArgs;
    permissions?: boolean | DocCountOutputTypeCountPermissionsArgs;
    threads?: boolean | DocCountOutputTypeCountThreadsArgs;
    shareLinks?: boolean | DocCountOutputTypeCountShareLinksArgs;
    attachments?: boolean | DocCountOutputTypeCountAttachmentsArgs;
};
export type DocCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocCountOutputTypeSelect<ExtArgs> | null;
};
export type DocCountOutputTypeCountVersionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocVersionWhereInput;
};
export type DocCountOutputTypeCountPermissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocPermissionWhereInput;
};
export type DocCountOutputTypeCountThreadsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocCommentThreadWhereInput;
};
export type DocCountOutputTypeCountShareLinksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocShareLinkWhereInput;
};
export type DocCountOutputTypeCountAttachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AttachmentWhereInput;
};
export type DocSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    ownerId?: boolean;
    scope?: boolean;
    title?: boolean;
    contentJson?: boolean;
    plaintext?: boolean;
    version?: boolean;
    lastCheckpointAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Doc$projectArgs<ExtArgs>;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    versions?: boolean | Prisma.Doc$versionsArgs<ExtArgs>;
    permissions?: boolean | Prisma.Doc$permissionsArgs<ExtArgs>;
    threads?: boolean | Prisma.Doc$threadsArgs<ExtArgs>;
    shareLinks?: boolean | Prisma.Doc$shareLinksArgs<ExtArgs>;
    attachments?: boolean | Prisma.Doc$attachmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.DocCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["doc"]>;
export type DocSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    ownerId?: boolean;
    scope?: boolean;
    title?: boolean;
    contentJson?: boolean;
    plaintext?: boolean;
    version?: boolean;
    lastCheckpointAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Doc$projectArgs<ExtArgs>;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["doc"]>;
export type DocSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    ownerId?: boolean;
    scope?: boolean;
    title?: boolean;
    contentJson?: boolean;
    plaintext?: boolean;
    version?: boolean;
    lastCheckpointAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Doc$projectArgs<ExtArgs>;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["doc"]>;
export type DocSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    projectId?: boolean;
    ownerId?: boolean;
    scope?: boolean;
    title?: boolean;
    contentJson?: boolean;
    plaintext?: boolean;
    version?: boolean;
    lastCheckpointAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type DocOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "projectId" | "ownerId" | "scope" | "title" | "contentJson" | "plaintext" | "version" | "lastCheckpointAt" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["doc"]>;
export type DocInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Doc$projectArgs<ExtArgs>;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    versions?: boolean | Prisma.Doc$versionsArgs<ExtArgs>;
    permissions?: boolean | Prisma.Doc$permissionsArgs<ExtArgs>;
    threads?: boolean | Prisma.Doc$threadsArgs<ExtArgs>;
    shareLinks?: boolean | Prisma.Doc$shareLinksArgs<ExtArgs>;
    attachments?: boolean | Prisma.Doc$attachmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.DocCountOutputTypeDefaultArgs<ExtArgs>;
};
export type DocIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Doc$projectArgs<ExtArgs>;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DocIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    project?: boolean | Prisma.Doc$projectArgs<ExtArgs>;
    owner?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DocPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Doc";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        project: Prisma.$ProjectPayload<ExtArgs> | null;
        owner: Prisma.$UserPayload<ExtArgs>;
        versions: Prisma.$DocVersionPayload<ExtArgs>[];
        permissions: Prisma.$DocPermissionPayload<ExtArgs>[];
        threads: Prisma.$DocCommentThreadPayload<ExtArgs>[];
        shareLinks: Prisma.$DocShareLinkPayload<ExtArgs>[];
        attachments: Prisma.$AttachmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        projectId: string | null;
        ownerId: string;
        scope: $Enums.DocScope;
        title: string;
        contentJson: runtime.JsonValue;
        plaintext: string;
        version: number;
        lastCheckpointAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["doc"]>;
    composites: {};
};
export type DocGetPayload<S extends boolean | null | undefined | DocDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocPayload, S>;
export type DocCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocCountAggregateInputType | true;
};
export interface DocDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Doc'];
        meta: {
            name: 'Doc';
        };
    };
    findUnique<T extends DocFindUniqueArgs>(args: Prisma.SelectSubset<T, DocFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocFindFirstArgs>(args?: Prisma.SelectSubset<T, DocFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocFindManyArgs>(args?: Prisma.SelectSubset<T, DocFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocCreateArgs>(args: Prisma.SelectSubset<T, DocCreateArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocCreateManyArgs>(args?: Prisma.SelectSubset<T, DocCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocDeleteArgs>(args: Prisma.SelectSubset<T, DocDeleteArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocUpdateArgs>(args: Prisma.SelectSubset<T, DocUpdateArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocUpdateManyArgs>(args: Prisma.SelectSubset<T, DocUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocUpsertArgs>(args: Prisma.SelectSubset<T, DocUpsertArgs<ExtArgs>>): Prisma.Prisma__DocClient<runtime.Types.Result.GetResult<Prisma.$DocPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocCountArgs>(args?: Prisma.Subset<T, DocCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocCountAggregateOutputType> : number>;
    aggregate<T extends DocAggregateArgs>(args: Prisma.Subset<T, DocAggregateArgs>): Prisma.PrismaPromise<GetDocAggregateType<T>>;
    groupBy<T extends DocGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocGroupByArgs['orderBy'];
    } : {
        orderBy?: DocGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocFieldRefs;
}
export interface Prisma__DocClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    project<T extends Prisma.Doc$projectArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Doc$projectArgs<ExtArgs>>): Prisma.Prisma__ProjectClient<runtime.Types.Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    owner<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    versions<T extends Prisma.Doc$versionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Doc$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    permissions<T extends Prisma.Doc$permissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Doc$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    threads<T extends Prisma.Doc$threadsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Doc$threadsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocCommentThreadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    shareLinks<T extends Prisma.Doc$shareLinksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Doc$shareLinksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocShareLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    attachments<T extends Prisma.Doc$attachmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Doc$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocFieldRefs {
    readonly id: Prisma.FieldRef<"Doc", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"Doc", 'String'>;
    readonly projectId: Prisma.FieldRef<"Doc", 'String'>;
    readonly ownerId: Prisma.FieldRef<"Doc", 'String'>;
    readonly scope: Prisma.FieldRef<"Doc", 'DocScope'>;
    readonly title: Prisma.FieldRef<"Doc", 'String'>;
    readonly contentJson: Prisma.FieldRef<"Doc", 'Json'>;
    readonly plaintext: Prisma.FieldRef<"Doc", 'String'>;
    readonly version: Prisma.FieldRef<"Doc", 'Int'>;
    readonly lastCheckpointAt: Prisma.FieldRef<"Doc", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Doc", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Doc", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Doc", 'DateTime'>;
}
export type DocFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where: Prisma.DocWhereUniqueInput;
};
export type DocFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where: Prisma.DocWhereUniqueInput;
};
export type DocFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where?: Prisma.DocWhereInput;
    orderBy?: Prisma.DocOrderByWithRelationInput | Prisma.DocOrderByWithRelationInput[];
    cursor?: Prisma.DocWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocScalarFieldEnum | Prisma.DocScalarFieldEnum[];
};
export type DocFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where?: Prisma.DocWhereInput;
    orderBy?: Prisma.DocOrderByWithRelationInput | Prisma.DocOrderByWithRelationInput[];
    cursor?: Prisma.DocWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocScalarFieldEnum | Prisma.DocScalarFieldEnum[];
};
export type DocFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where?: Prisma.DocWhereInput;
    orderBy?: Prisma.DocOrderByWithRelationInput | Prisma.DocOrderByWithRelationInput[];
    cursor?: Prisma.DocWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocScalarFieldEnum | Prisma.DocScalarFieldEnum[];
};
export type DocCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocCreateInput, Prisma.DocUncheckedCreateInput>;
};
export type DocCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocCreateManyInput | Prisma.DocCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    data: Prisma.DocCreateManyInput | Prisma.DocCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DocIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DocUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocUpdateInput, Prisma.DocUncheckedUpdateInput>;
    where: Prisma.DocWhereUniqueInput;
};
export type DocUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocUpdateManyMutationInput, Prisma.DocUncheckedUpdateManyInput>;
    where?: Prisma.DocWhereInput;
    limit?: number;
};
export type DocUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocUpdateManyMutationInput, Prisma.DocUncheckedUpdateManyInput>;
    where?: Prisma.DocWhereInput;
    limit?: number;
    include?: Prisma.DocIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DocUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where: Prisma.DocWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocCreateInput, Prisma.DocUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocUpdateInput, Prisma.DocUncheckedUpdateInput>;
};
export type DocDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
    where: Prisma.DocWhereUniqueInput;
};
export type DocDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocWhereInput;
    limit?: number;
};
export type Doc$projectArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProjectSelect<ExtArgs> | null;
    omit?: Prisma.ProjectOmit<ExtArgs> | null;
    include?: Prisma.ProjectInclude<ExtArgs> | null;
    where?: Prisma.ProjectWhereInput;
};
export type Doc$versionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Doc$permissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Doc$threadsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Doc$shareLinksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Doc$attachmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DocDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocSelect<ExtArgs> | null;
    omit?: Prisma.DocOmit<ExtArgs> | null;
    include?: Prisma.DocInclude<ExtArgs> | null;
};
