import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums";
import type * as Prisma from "./internal/prismaNamespace";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type JsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>, Required<JsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
export type JsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type JsonWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type EnumWorkspaceUseFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceUse | Prisma.EnumWorkspaceUseFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceUseFilter<$PrismaModel> | $Enums.WorkspaceUse;
};
export type EnumWorkspaceManagementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceManagementType | Prisma.EnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceManagementTypeFilter<$PrismaModel> | $Enums.WorkspaceManagementType;
};
export type EnumWorkspaceUseWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceUse | Prisma.EnumWorkspaceUseFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceUseWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceUse;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceUseFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceUseFilter<$PrismaModel>;
};
export type EnumWorkspaceManagementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceManagementType | Prisma.EnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceManagementTypeWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceManagementType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceManagementTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceManagementTypeFilter<$PrismaModel>;
};
export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type EnumInviteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | Prisma.EnumInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInviteStatusFilter<$PrismaModel> | $Enums.InviteStatus;
};
export type EnumInviteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | Prisma.EnumInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInviteStatusWithAggregatesFilter<$PrismaModel> | $Enums.InviteStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumInviteStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumInviteStatusFilter<$PrismaModel>;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumPriorityNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPriorityNullableFilter<$PrismaModel> | $Enums.Priority | null;
};
export type EnumPriorityNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPriorityNullableWithAggregatesFilter<$PrismaModel> | $Enums.Priority | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPriorityNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPriorityNullableFilter<$PrismaModel>;
};
export type EnumStatusGroupFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusGroup | Prisma.EnumStatusGroupFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusGroupFilter<$PrismaModel> | $Enums.StatusGroup;
};
export type EnumStatusGroupWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusGroup | Prisma.EnumStatusGroupFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusGroupWithAggregatesFilter<$PrismaModel> | $Enums.StatusGroup;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStatusGroupFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStatusGroupFilter<$PrismaModel>;
};
export type EnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority;
};
export type EnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPriorityFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPriorityFilter<$PrismaModel>;
};
export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntFilter<$PrismaModel> | bigint | number;
};
export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _max?: Prisma.NestedBigIntFilter<$PrismaModel>;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type EnumChannelPrivacyFilter<$PrismaModel = never> = {
    equals?: $Enums.ChannelPrivacy | Prisma.EnumChannelPrivacyFieldRefInput<$PrismaModel>;
    in?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumChannelPrivacyFilter<$PrismaModel> | $Enums.ChannelPrivacy;
};
export type EnumChannelPrivacyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChannelPrivacy | Prisma.EnumChannelPrivacyFieldRefInput<$PrismaModel>;
    in?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumChannelPrivacyWithAggregatesFilter<$PrismaModel> | $Enums.ChannelPrivacy;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumChannelPrivacyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumChannelPrivacyFilter<$PrismaModel>;
};
export type EnumDocScopeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocScope | Prisma.EnumDocScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocScopeFilter<$PrismaModel> | $Enums.DocScope;
};
export type EnumDocScopeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocScope | Prisma.EnumDocScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocScopeWithAggregatesFilter<$PrismaModel> | $Enums.DocScope;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDocScopeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDocScopeFilter<$PrismaModel>;
};
export type EnumDocVersionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocVersionType | Prisma.EnumDocVersionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocVersionTypeFilter<$PrismaModel> | $Enums.DocVersionType;
};
export type EnumDocVersionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocVersionType | Prisma.EnumDocVersionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocVersionTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocVersionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDocVersionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDocVersionTypeFilter<$PrismaModel>;
};
export type EnumDocRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.DocRole | Prisma.EnumDocRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocRoleFilter<$PrismaModel> | $Enums.DocRole;
};
export type EnumDocRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocRole | Prisma.EnumDocRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocRoleWithAggregatesFilter<$PrismaModel> | $Enums.DocRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDocRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDocRoleFilter<$PrismaModel>;
};
export type JsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedJsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumWorkspaceUseFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceUse | Prisma.EnumWorkspaceUseFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceUseFilter<$PrismaModel> | $Enums.WorkspaceUse;
};
export type NestedEnumWorkspaceManagementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceManagementType | Prisma.EnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceManagementTypeFilter<$PrismaModel> | $Enums.WorkspaceManagementType;
};
export type NestedEnumWorkspaceUseWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceUse | Prisma.EnumWorkspaceUseFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceUse[] | Prisma.ListEnumWorkspaceUseFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceUseWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceUse;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceUseFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceUseFilter<$PrismaModel>;
};
export type NestedEnumWorkspaceManagementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceManagementType | Prisma.EnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceManagementType[] | Prisma.ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceManagementTypeWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceManagementType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceManagementTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceManagementTypeFilter<$PrismaModel>;
};
export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type NestedEnumInviteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | Prisma.EnumInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInviteStatusFilter<$PrismaModel> | $Enums.InviteStatus;
};
export type NestedEnumInviteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | Prisma.EnumInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InviteStatus[] | Prisma.ListEnumInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInviteStatusWithAggregatesFilter<$PrismaModel> | $Enums.InviteStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumInviteStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumInviteStatusFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumPriorityNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPriorityNullableFilter<$PrismaModel> | $Enums.Priority | null;
};
export type NestedEnumPriorityNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel> | null;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPriorityNullableWithAggregatesFilter<$PrismaModel> | $Enums.Priority | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPriorityNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPriorityNullableFilter<$PrismaModel>;
};
export type NestedEnumStatusGroupFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusGroup | Prisma.EnumStatusGroupFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusGroupFilter<$PrismaModel> | $Enums.StatusGroup;
};
export type NestedEnumStatusGroupWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusGroup | Prisma.EnumStatusGroupFieldRefInput<$PrismaModel>;
    in?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StatusGroup[] | Prisma.ListEnumStatusGroupFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStatusGroupWithAggregatesFilter<$PrismaModel> | $Enums.StatusGroup;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStatusGroupFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStatusGroupFilter<$PrismaModel>;
};
export type NestedEnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority;
};
export type NestedEnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | Prisma.EnumPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Priority[] | Prisma.ListEnumPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPriorityFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPriorityFilter<$PrismaModel>;
};
export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntFilter<$PrismaModel> | bigint | number;
};
export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _max?: Prisma.NestedBigIntFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumChannelPrivacyFilter<$PrismaModel = never> = {
    equals?: $Enums.ChannelPrivacy | Prisma.EnumChannelPrivacyFieldRefInput<$PrismaModel>;
    in?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumChannelPrivacyFilter<$PrismaModel> | $Enums.ChannelPrivacy;
};
export type NestedEnumChannelPrivacyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChannelPrivacy | Prisma.EnumChannelPrivacyFieldRefInput<$PrismaModel>;
    in?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChannelPrivacy[] | Prisma.ListEnumChannelPrivacyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumChannelPrivacyWithAggregatesFilter<$PrismaModel> | $Enums.ChannelPrivacy;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumChannelPrivacyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumChannelPrivacyFilter<$PrismaModel>;
};
export type NestedEnumDocScopeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocScope | Prisma.EnumDocScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocScopeFilter<$PrismaModel> | $Enums.DocScope;
};
export type NestedEnumDocScopeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocScope | Prisma.EnumDocScopeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocScope[] | Prisma.ListEnumDocScopeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocScopeWithAggregatesFilter<$PrismaModel> | $Enums.DocScope;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDocScopeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDocScopeFilter<$PrismaModel>;
};
export type NestedEnumDocVersionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocVersionType | Prisma.EnumDocVersionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocVersionTypeFilter<$PrismaModel> | $Enums.DocVersionType;
};
export type NestedEnumDocVersionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocVersionType | Prisma.EnumDocVersionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocVersionType[] | Prisma.ListEnumDocVersionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocVersionTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocVersionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDocVersionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDocVersionTypeFilter<$PrismaModel>;
};
export type NestedEnumDocRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.DocRole | Prisma.EnumDocRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocRoleFilter<$PrismaModel> | $Enums.DocRole;
};
export type NestedEnumDocRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocRole | Prisma.EnumDocRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DocRole[] | Prisma.ListEnumDocRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDocRoleWithAggregatesFilter<$PrismaModel> | $Enums.DocRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDocRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDocRoleFilter<$PrismaModel>;
};
export type NestedJsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
