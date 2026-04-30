import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type TagModel = runtime.Types.Result.DefaultSelection<Prisma.$TagPayload>;
export type AggregateTag = {
    _count: TagCountAggregateOutputType | null;
    _min: TagMinAggregateOutputType | null;
    _max: TagMaxAggregateOutputType | null;
};
export type TagMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    name: string | null;
    color: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TagMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    name: string | null;
    color: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TagCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    name: number;
    color: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type TagMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    name?: true;
    color?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TagMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    name?: true;
    color?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TagCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    name?: true;
    color?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type TagAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TagCountAggregateInputType;
    _min?: TagMinAggregateInputType;
    _max?: TagMaxAggregateInputType;
};
export type GetTagAggregateType<T extends TagAggregateArgs> = {
    [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTag[P]> : Prisma.GetScalarType<T[P], AggregateTag[P]>;
};
export type TagGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithAggregationInput | Prisma.TagOrderByWithAggregationInput[];
    by: Prisma.TagScalarFieldEnum[] | Prisma.TagScalarFieldEnum;
    having?: Prisma.TagScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TagCountAggregateInputType | true;
    _min?: TagMinAggregateInputType;
    _max?: TagMaxAggregateInputType;
};
export type TagGroupByOutputType = {
    id: string;
    workspaceId: string;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: TagCountAggregateOutputType | null;
    _min: TagMinAggregateOutputType | null;
    _max: TagMaxAggregateOutputType | null;
};
export type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TagGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TagGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TagGroupByOutputType[P]>;
}>>;
export type TagWhereInput = {
    AND?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    OR?: Prisma.TagWhereInput[];
    NOT?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    id?: Prisma.StringFilter<"Tag"> | string;
    workspaceId?: Prisma.StringFilter<"Tag"> | string;
    name?: Prisma.StringFilter<"Tag"> | string;
    color?: Prisma.StringFilter<"Tag"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tag"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tag"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Tag"> | Date | string | null;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    taskTags?: Prisma.TaskTagListRelationFilter;
};
export type TagOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    taskTags?: Prisma.TaskTagOrderByRelationAggregateInput;
};
export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    workspaceId_name?: Prisma.TagWorkspaceIdNameCompoundUniqueInput;
    AND?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    OR?: Prisma.TagWhereInput[];
    NOT?: Prisma.TagWhereInput | Prisma.TagWhereInput[];
    workspaceId?: Prisma.StringFilter<"Tag"> | string;
    name?: Prisma.StringFilter<"Tag"> | string;
    color?: Prisma.StringFilter<"Tag"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tag"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tag"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Tag"> | Date | string | null;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    taskTags?: Prisma.TaskTagListRelationFilter;
}, "id" | "workspaceId_name">;
export type TagOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TagCountOrderByAggregateInput;
    _max?: Prisma.TagMaxOrderByAggregateInput;
    _min?: Prisma.TagMinOrderByAggregateInput;
};
export type TagScalarWhereWithAggregatesInput = {
    AND?: Prisma.TagScalarWhereWithAggregatesInput | Prisma.TagScalarWhereWithAggregatesInput[];
    OR?: Prisma.TagScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TagScalarWhereWithAggregatesInput | Prisma.TagScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
    color?: Prisma.StringWithAggregatesFilter<"Tag"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Tag"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Tag"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Tag"> | Date | string | null;
};
export type TagCreateInput = {
    id?: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutTagsInput;
    taskTags?: Prisma.TaskTagCreateNestedManyWithoutTagInput;
};
export type TagUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    taskTags?: Prisma.TaskTagUncheckedCreateNestedManyWithoutTagInput;
};
export type TagUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutTagsNestedInput;
    taskTags?: Prisma.TaskTagUpdateManyWithoutTagNestedInput;
};
export type TagUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    taskTags?: Prisma.TaskTagUncheckedUpdateManyWithoutTagNestedInput;
};
export type TagCreateManyInput = {
    id?: string;
    workspaceId: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TagUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TagUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TagListRelationFilter = {
    every?: Prisma.TagWhereInput;
    some?: Prisma.TagWhereInput;
    none?: Prisma.TagWhereInput;
};
export type TagOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TagWorkspaceIdNameCompoundUniqueInput = {
    workspaceId: string;
    name: string;
};
export type TagCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TagMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TagMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    color?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TagScalarRelationFilter = {
    is?: Prisma.TagWhereInput;
    isNot?: Prisma.TagWhereInput;
};
export type TagCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutWorkspaceInput, Prisma.TagUncheckedCreateWithoutWorkspaceInput> | Prisma.TagCreateWithoutWorkspaceInput[] | Prisma.TagUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutWorkspaceInput | Prisma.TagCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.TagCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
};
export type TagUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutWorkspaceInput, Prisma.TagUncheckedCreateWithoutWorkspaceInput> | Prisma.TagCreateWithoutWorkspaceInput[] | Prisma.TagUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutWorkspaceInput | Prisma.TagCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.TagCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
};
export type TagUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutWorkspaceInput, Prisma.TagUncheckedCreateWithoutWorkspaceInput> | Prisma.TagCreateWithoutWorkspaceInput[] | Prisma.TagUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutWorkspaceInput | Prisma.TagCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.TagUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.TagUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.TagCreateManyWorkspaceInputEnvelope;
    set?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    disconnect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    delete?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    update?: Prisma.TagUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.TagUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.TagUpdateManyWithWhereWithoutWorkspaceInput | Prisma.TagUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
};
export type TagUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutWorkspaceInput, Prisma.TagUncheckedCreateWithoutWorkspaceInput> | Prisma.TagCreateWithoutWorkspaceInput[] | Prisma.TagUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutWorkspaceInput | Prisma.TagCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.TagUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.TagUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.TagCreateManyWorkspaceInputEnvelope;
    set?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    disconnect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    delete?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    connect?: Prisma.TagWhereUniqueInput | Prisma.TagWhereUniqueInput[];
    update?: Prisma.TagUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.TagUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.TagUpdateManyWithWhereWithoutWorkspaceInput | Prisma.TagUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
};
export type TagCreateNestedOneWithoutTaskTagsInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutTaskTagsInput, Prisma.TagUncheckedCreateWithoutTaskTagsInput>;
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutTaskTagsInput;
    connect?: Prisma.TagWhereUniqueInput;
};
export type TagUpdateOneRequiredWithoutTaskTagsNestedInput = {
    create?: Prisma.XOR<Prisma.TagCreateWithoutTaskTagsInput, Prisma.TagUncheckedCreateWithoutTaskTagsInput>;
    connectOrCreate?: Prisma.TagCreateOrConnectWithoutTaskTagsInput;
    upsert?: Prisma.TagUpsertWithoutTaskTagsInput;
    connect?: Prisma.TagWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TagUpdateToOneWithWhereWithoutTaskTagsInput, Prisma.TagUpdateWithoutTaskTagsInput>, Prisma.TagUncheckedUpdateWithoutTaskTagsInput>;
};
export type TagCreateWithoutWorkspaceInput = {
    id?: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    taskTags?: Prisma.TaskTagCreateNestedManyWithoutTagInput;
};
export type TagUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    taskTags?: Prisma.TaskTagUncheckedCreateNestedManyWithoutTagInput;
};
export type TagCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.TagWhereUniqueInput;
    create: Prisma.XOR<Prisma.TagCreateWithoutWorkspaceInput, Prisma.TagUncheckedCreateWithoutWorkspaceInput>;
};
export type TagCreateManyWorkspaceInputEnvelope = {
    data: Prisma.TagCreateManyWorkspaceInput | Prisma.TagCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type TagUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.TagWhereUniqueInput;
    update: Prisma.XOR<Prisma.TagUpdateWithoutWorkspaceInput, Prisma.TagUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.TagCreateWithoutWorkspaceInput, Prisma.TagUncheckedCreateWithoutWorkspaceInput>;
};
export type TagUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.TagWhereUniqueInput;
    data: Prisma.XOR<Prisma.TagUpdateWithoutWorkspaceInput, Prisma.TagUncheckedUpdateWithoutWorkspaceInput>;
};
export type TagUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.TagScalarWhereInput;
    data: Prisma.XOR<Prisma.TagUpdateManyMutationInput, Prisma.TagUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type TagScalarWhereInput = {
    AND?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
    OR?: Prisma.TagScalarWhereInput[];
    NOT?: Prisma.TagScalarWhereInput | Prisma.TagScalarWhereInput[];
    id?: Prisma.StringFilter<"Tag"> | string;
    workspaceId?: Prisma.StringFilter<"Tag"> | string;
    name?: Prisma.StringFilter<"Tag"> | string;
    color?: Prisma.StringFilter<"Tag"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tag"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tag"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Tag"> | Date | string | null;
};
export type TagCreateWithoutTaskTagsInput = {
    id?: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutTagsInput;
};
export type TagUncheckedCreateWithoutTaskTagsInput = {
    id?: string;
    workspaceId: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TagCreateOrConnectWithoutTaskTagsInput = {
    where: Prisma.TagWhereUniqueInput;
    create: Prisma.XOR<Prisma.TagCreateWithoutTaskTagsInput, Prisma.TagUncheckedCreateWithoutTaskTagsInput>;
};
export type TagUpsertWithoutTaskTagsInput = {
    update: Prisma.XOR<Prisma.TagUpdateWithoutTaskTagsInput, Prisma.TagUncheckedUpdateWithoutTaskTagsInput>;
    create: Prisma.XOR<Prisma.TagCreateWithoutTaskTagsInput, Prisma.TagUncheckedCreateWithoutTaskTagsInput>;
    where?: Prisma.TagWhereInput;
};
export type TagUpdateToOneWithWhereWithoutTaskTagsInput = {
    where?: Prisma.TagWhereInput;
    data: Prisma.XOR<Prisma.TagUpdateWithoutTaskTagsInput, Prisma.TagUncheckedUpdateWithoutTaskTagsInput>;
};
export type TagUpdateWithoutTaskTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutTagsNestedInput;
};
export type TagUncheckedUpdateWithoutTaskTagsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TagCreateManyWorkspaceInput = {
    id?: string;
    name: string;
    color?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TagUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    taskTags?: Prisma.TaskTagUpdateManyWithoutTagNestedInput;
};
export type TagUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    taskTags?: Prisma.TaskTagUncheckedUpdateManyWithoutTagNestedInput;
};
export type TagUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    color?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TagCountOutputType = {
    taskTags: number;
};
export type TagCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    taskTags?: boolean | TagCountOutputTypeCountTaskTagsArgs;
};
export type TagCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagCountOutputTypeSelect<ExtArgs> | null;
};
export type TagCountOutputTypeCountTaskTagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskTagWhereInput;
};
export type TagSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    color?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    taskTags?: boolean | Prisma.Tag$taskTagsArgs<ExtArgs>;
    _count?: boolean | Prisma.TagCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tag"]>;
export type TagSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    color?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tag"]>;
export type TagSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    color?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tag"]>;
export type TagSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    color?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type TagOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "name" | "color" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["tag"]>;
export type TagInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    taskTags?: boolean | Prisma.Tag$taskTagsArgs<ExtArgs>;
    _count?: boolean | Prisma.TagCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TagIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type TagIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type $TagPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Tag";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        taskTags: Prisma.$TaskTagPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        name: string;
        color: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["tag"]>;
    composites: {};
};
export type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TagPayload, S>;
export type TagCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TagCountAggregateInputType | true;
};
export interface TagDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Tag'];
        meta: {
            name: 'Tag';
        };
    };
    findUnique<T extends TagFindUniqueArgs>(args: Prisma.SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TagFindFirstArgs>(args?: Prisma.SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TagFindManyArgs>(args?: Prisma.SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TagCreateArgs>(args: Prisma.SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TagCreateManyArgs>(args?: Prisma.SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TagDeleteArgs>(args: Prisma.SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TagUpdateArgs>(args: Prisma.SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TagDeleteManyArgs>(args?: Prisma.SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TagUpdateManyArgs>(args: Prisma.SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TagUpsertArgs>(args: Prisma.SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma.Prisma__TagClient<runtime.Types.Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TagCountArgs>(args?: Prisma.Subset<T, TagCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TagCountAggregateOutputType> : number>;
    aggregate<T extends TagAggregateArgs>(args: Prisma.Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>;
    groupBy<T extends TagGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TagGroupByArgs['orderBy'];
    } : {
        orderBy?: TagGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TagFieldRefs;
}
export interface Prisma__TagClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    taskTags<T extends Prisma.Tag$taskTagsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Tag$taskTagsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TagFieldRefs {
    readonly id: Prisma.FieldRef<"Tag", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"Tag", 'String'>;
    readonly name: Prisma.FieldRef<"Tag", 'String'>;
    readonly color: Prisma.FieldRef<"Tag", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Tag", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Tag", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Tag", 'DateTime'>;
}
export type TagFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
};
export type TagFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
};
export type TagFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type TagFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type TagFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[];
    cursor?: Prisma.TagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TagScalarFieldEnum | Prisma.TagScalarFieldEnum[];
};
export type TagCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TagCreateInput, Prisma.TagUncheckedCreateInput>;
};
export type TagCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TagCreateManyInput | Prisma.TagCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TagCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    data: Prisma.TagCreateManyInput | Prisma.TagCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TagIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TagUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TagUpdateInput, Prisma.TagUncheckedUpdateInput>;
    where: Prisma.TagWhereUniqueInput;
};
export type TagUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TagUpdateManyMutationInput, Prisma.TagUncheckedUpdateManyInput>;
    where?: Prisma.TagWhereInput;
    limit?: number;
};
export type TagUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TagUpdateManyMutationInput, Prisma.TagUncheckedUpdateManyInput>;
    where?: Prisma.TagWhereInput;
    limit?: number;
    include?: Prisma.TagIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TagUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
    create: Prisma.XOR<Prisma.TagCreateInput, Prisma.TagUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TagUpdateInput, Prisma.TagUncheckedUpdateInput>;
};
export type TagDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
    where: Prisma.TagWhereUniqueInput;
};
export type TagDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TagWhereInput;
    limit?: number;
};
export type Tag$taskTagsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskTagSelect<ExtArgs> | null;
    omit?: Prisma.TaskTagOmit<ExtArgs> | null;
    include?: Prisma.TaskTagInclude<ExtArgs> | null;
    where?: Prisma.TaskTagWhereInput;
    orderBy?: Prisma.TaskTagOrderByWithRelationInput | Prisma.TaskTagOrderByWithRelationInput[];
    cursor?: Prisma.TaskTagWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskTagScalarFieldEnum | Prisma.TaskTagScalarFieldEnum[];
};
export type TagDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TagSelect<ExtArgs> | null;
    omit?: Prisma.TagOmit<ExtArgs> | null;
    include?: Prisma.TagInclude<ExtArgs> | null;
};
