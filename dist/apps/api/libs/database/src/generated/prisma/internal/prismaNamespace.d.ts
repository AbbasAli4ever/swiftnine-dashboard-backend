import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly RefreshToken: "RefreshToken";
    readonly PasswordResetToken: "PasswordResetToken";
    readonly EmailVerificationToken: "EmailVerificationToken";
    readonly Workspace: "Workspace";
    readonly WorkspaceMember: "WorkspaceMember";
    readonly WorkspaceInvite: "WorkspaceInvite";
    readonly Project: "Project";
    readonly TaskList: "TaskList";
    readonly Status: "Status";
    readonly Tag: "Tag";
    readonly Task: "Task";
    readonly ProjectFavorite: "ProjectFavorite";
    readonly TaskFavorite: "TaskFavorite";
    readonly TaskAssignee: "TaskAssignee";
    readonly TaskTag: "TaskTag";
    readonly Comment: "Comment";
    readonly Reaction: "Reaction";
    readonly Mention: "Mention";
    readonly Notification: "Notification";
    readonly Attachment: "Attachment";
    readonly TimeEntry: "TimeEntry";
    readonly ActivityLog: "ActivityLog";
    readonly Channel: "Channel";
    readonly ChannelMember: "ChannelMember";
    readonly ChannelMessage: "ChannelMessage";
    readonly ChannelMessageMention: "ChannelMessageMention";
    readonly ChannelMessageReaction: "ChannelMessageReaction";
    readonly ChannelJoinRequest: "ChannelJoinRequest";
    readonly Doc: "Doc";
    readonly DocVersion: "DocVersion";
    readonly DocPermission: "DocPermission";
    readonly DocCommentThread: "DocCommentThread";
    readonly DocComment: "DocComment";
    readonly DocShareLink: "DocShareLink";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "refreshToken" | "passwordResetToken" | "emailVerificationToken" | "workspace" | "workspaceMember" | "workspaceInvite" | "project" | "taskList" | "status" | "tag" | "task" | "projectFavorite" | "taskFavorite" | "taskAssignee" | "taskTag" | "comment" | "reaction" | "mention" | "notification" | "attachment" | "timeEntry" | "activityLog" | "channel" | "channelMember" | "channelMessage" | "channelMessageMention" | "channelMessageReaction" | "channelJoinRequest" | "doc" | "docVersion" | "docPermission" | "docCommentThread" | "docComment" | "docShareLink";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        RefreshToken: {
            payload: Prisma.$RefreshTokenPayload<ExtArgs>;
            fields: Prisma.RefreshTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findFirst: {
                    args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findMany: {
                    args: Prisma.RefreshTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                create: {
                    args: Prisma.RefreshTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                createMany: {
                    args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                delete: {
                    args: Prisma.RefreshTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                update: {
                    args: Prisma.RefreshTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                upsert: {
                    args: Prisma.RefreshTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                aggregate: {
                    args: Prisma.RefreshTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefreshToken>;
                };
                groupBy: {
                    args: Prisma.RefreshTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RefreshTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenCountAggregateOutputType> | number;
                };
            };
        };
        PasswordResetToken: {
            payload: Prisma.$PasswordResetTokenPayload<ExtArgs>;
            fields: Prisma.PasswordResetTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                findFirst: {
                    args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                findMany: {
                    args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
                };
                create: {
                    args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                createMany: {
                    args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
                };
                delete: {
                    args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                update: {
                    args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
                };
                upsert: {
                    args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
                };
                aggregate: {
                    args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePasswordResetToken>;
                };
                groupBy: {
                    args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PasswordResetTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PasswordResetTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PasswordResetTokenCountAggregateOutputType> | number;
                };
            };
        };
        EmailVerificationToken: {
            payload: Prisma.$EmailVerificationTokenPayload<ExtArgs>;
            fields: Prisma.EmailVerificationTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EmailVerificationTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                findFirst: {
                    args: Prisma.EmailVerificationTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                findMany: {
                    args: Prisma.EmailVerificationTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[];
                };
                create: {
                    args: Prisma.EmailVerificationTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                createMany: {
                    args: Prisma.EmailVerificationTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[];
                };
                delete: {
                    args: Prisma.EmailVerificationTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                update: {
                    args: Prisma.EmailVerificationTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.EmailVerificationTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EmailVerificationTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[];
                };
                upsert: {
                    args: Prisma.EmailVerificationTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>;
                };
                aggregate: {
                    args: Prisma.EmailVerificationTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEmailVerificationToken>;
                };
                groupBy: {
                    args: Prisma.EmailVerificationTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailVerificationTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EmailVerificationTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailVerificationTokenCountAggregateOutputType> | number;
                };
            };
        };
        Workspace: {
            payload: Prisma.$WorkspacePayload<ExtArgs>;
            fields: Prisma.WorkspaceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                create: {
                    args: Prisma.WorkspaceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                update: {
                    args: Prisma.WorkspaceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspace>;
                };
                groupBy: {
                    args: Prisma.WorkspaceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceCountAggregateOutputType> | number;
                };
            };
        };
        WorkspaceMember: {
            payload: Prisma.$WorkspaceMemberPayload<ExtArgs>;
            fields: Prisma.WorkspaceMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[];
                };
                create: {
                    args: Prisma.WorkspaceMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceMemberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                update: {
                    args: Prisma.WorkspaceMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceMemberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspaceMember>;
                };
                groupBy: {
                    args: Prisma.WorkspaceMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceMemberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceMemberCountAggregateOutputType> | number;
                };
            };
        };
        WorkspaceInvite: {
            payload: Prisma.$WorkspaceInvitePayload<ExtArgs>;
            fields: Prisma.WorkspaceInviteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceInviteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceInviteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceInviteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceInviteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceInviteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>[];
                };
                create: {
                    args: Prisma.WorkspaceInviteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceInviteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceInviteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceInviteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                update: {
                    args: Prisma.WorkspaceInviteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceInviteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceInviteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceInviteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceInviteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceInviteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspaceInvite>;
                };
                groupBy: {
                    args: Prisma.WorkspaceInviteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceInviteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceInviteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceInviteCountAggregateOutputType> | number;
                };
            };
        };
        Project: {
            payload: Prisma.$ProjectPayload<ExtArgs>;
            fields: Prisma.ProjectFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProjectFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                findFirst: {
                    args: Prisma.ProjectFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                findMany: {
                    args: Prisma.ProjectFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>[];
                };
                create: {
                    args: Prisma.ProjectCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                createMany: {
                    args: Prisma.ProjectCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>[];
                };
                delete: {
                    args: Prisma.ProjectDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                update: {
                    args: Prisma.ProjectUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                deleteMany: {
                    args: Prisma.ProjectDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProjectUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>[];
                };
                upsert: {
                    args: Prisma.ProjectUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectPayload>;
                };
                aggregate: {
                    args: Prisma.ProjectAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProject>;
                };
                groupBy: {
                    args: Prisma.ProjectGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProjectCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectCountAggregateOutputType> | number;
                };
            };
        };
        TaskList: {
            payload: Prisma.$TaskListPayload<ExtArgs>;
            fields: Prisma.TaskListFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskListFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskListFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>;
                };
                findFirst: {
                    args: Prisma.TaskListFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskListFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>;
                };
                findMany: {
                    args: Prisma.TaskListFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>[];
                };
                create: {
                    args: Prisma.TaskListCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>;
                };
                createMany: {
                    args: Prisma.TaskListCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TaskListCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>[];
                };
                delete: {
                    args: Prisma.TaskListDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>;
                };
                update: {
                    args: Prisma.TaskListUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>;
                };
                deleteMany: {
                    args: Prisma.TaskListDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskListUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TaskListUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>[];
                };
                upsert: {
                    args: Prisma.TaskListUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskListPayload>;
                };
                aggregate: {
                    args: Prisma.TaskListAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaskList>;
                };
                groupBy: {
                    args: Prisma.TaskListGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskListGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskListCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskListCountAggregateOutputType> | number;
                };
            };
        };
        Status: {
            payload: Prisma.$StatusPayload<ExtArgs>;
            fields: Prisma.StatusFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StatusFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StatusFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>;
                };
                findFirst: {
                    args: Prisma.StatusFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StatusFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>;
                };
                findMany: {
                    args: Prisma.StatusFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>[];
                };
                create: {
                    args: Prisma.StatusCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>;
                };
                createMany: {
                    args: Prisma.StatusCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StatusCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>[];
                };
                delete: {
                    args: Prisma.StatusDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>;
                };
                update: {
                    args: Prisma.StatusUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>;
                };
                deleteMany: {
                    args: Prisma.StatusDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StatusUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StatusUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>[];
                };
                upsert: {
                    args: Prisma.StatusUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StatusPayload>;
                };
                aggregate: {
                    args: Prisma.StatusAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStatus>;
                };
                groupBy: {
                    args: Prisma.StatusGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StatusGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StatusCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StatusCountAggregateOutputType> | number;
                };
            };
        };
        Tag: {
            payload: Prisma.$TagPayload<ExtArgs>;
            fields: Prisma.TagFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TagFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                findFirst: {
                    args: Prisma.TagFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                findMany: {
                    args: Prisma.TagFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>[];
                };
                create: {
                    args: Prisma.TagCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                createMany: {
                    args: Prisma.TagCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>[];
                };
                delete: {
                    args: Prisma.TagDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                update: {
                    args: Prisma.TagUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                deleteMany: {
                    args: Prisma.TagDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TagUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>[];
                };
                upsert: {
                    args: Prisma.TagUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TagPayload>;
                };
                aggregate: {
                    args: Prisma.TagAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTag>;
                };
                groupBy: {
                    args: Prisma.TagGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TagGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TagCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TagCountAggregateOutputType> | number;
                };
            };
        };
        Task: {
            payload: Prisma.$TaskPayload<ExtArgs>;
            fields: Prisma.TaskFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                findFirst: {
                    args: Prisma.TaskFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                findMany: {
                    args: Prisma.TaskFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>[];
                };
                create: {
                    args: Prisma.TaskCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                createMany: {
                    args: Prisma.TaskCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>[];
                };
                delete: {
                    args: Prisma.TaskDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                update: {
                    args: Prisma.TaskUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                deleteMany: {
                    args: Prisma.TaskDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>[];
                };
                upsert: {
                    args: Prisma.TaskUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                aggregate: {
                    args: Prisma.TaskAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTask>;
                };
                groupBy: {
                    args: Prisma.TaskGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskCountAggregateOutputType> | number;
                };
            };
        };
        ProjectFavorite: {
            payload: Prisma.$ProjectFavoritePayload<ExtArgs>;
            fields: Prisma.ProjectFavoriteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProjectFavoriteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProjectFavoriteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>;
                };
                findFirst: {
                    args: Prisma.ProjectFavoriteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProjectFavoriteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>;
                };
                findMany: {
                    args: Prisma.ProjectFavoriteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>[];
                };
                create: {
                    args: Prisma.ProjectFavoriteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>;
                };
                createMany: {
                    args: Prisma.ProjectFavoriteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProjectFavoriteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>[];
                };
                delete: {
                    args: Prisma.ProjectFavoriteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>;
                };
                update: {
                    args: Prisma.ProjectFavoriteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>;
                };
                deleteMany: {
                    args: Prisma.ProjectFavoriteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProjectFavoriteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProjectFavoriteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>[];
                };
                upsert: {
                    args: Prisma.ProjectFavoriteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProjectFavoritePayload>;
                };
                aggregate: {
                    args: Prisma.ProjectFavoriteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProjectFavorite>;
                };
                groupBy: {
                    args: Prisma.ProjectFavoriteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectFavoriteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProjectFavoriteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProjectFavoriteCountAggregateOutputType> | number;
                };
            };
        };
        TaskFavorite: {
            payload: Prisma.$TaskFavoritePayload<ExtArgs>;
            fields: Prisma.TaskFavoriteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskFavoriteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskFavoriteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>;
                };
                findFirst: {
                    args: Prisma.TaskFavoriteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskFavoriteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>;
                };
                findMany: {
                    args: Prisma.TaskFavoriteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>[];
                };
                create: {
                    args: Prisma.TaskFavoriteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>;
                };
                createMany: {
                    args: Prisma.TaskFavoriteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TaskFavoriteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>[];
                };
                delete: {
                    args: Prisma.TaskFavoriteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>;
                };
                update: {
                    args: Prisma.TaskFavoriteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>;
                };
                deleteMany: {
                    args: Prisma.TaskFavoriteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskFavoriteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TaskFavoriteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>[];
                };
                upsert: {
                    args: Prisma.TaskFavoriteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskFavoritePayload>;
                };
                aggregate: {
                    args: Prisma.TaskFavoriteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaskFavorite>;
                };
                groupBy: {
                    args: Prisma.TaskFavoriteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskFavoriteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskFavoriteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskFavoriteCountAggregateOutputType> | number;
                };
            };
        };
        TaskAssignee: {
            payload: Prisma.$TaskAssigneePayload<ExtArgs>;
            fields: Prisma.TaskAssigneeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskAssigneeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskAssigneeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>;
                };
                findFirst: {
                    args: Prisma.TaskAssigneeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskAssigneeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>;
                };
                findMany: {
                    args: Prisma.TaskAssigneeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>[];
                };
                create: {
                    args: Prisma.TaskAssigneeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>;
                };
                createMany: {
                    args: Prisma.TaskAssigneeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TaskAssigneeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>[];
                };
                delete: {
                    args: Prisma.TaskAssigneeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>;
                };
                update: {
                    args: Prisma.TaskAssigneeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>;
                };
                deleteMany: {
                    args: Prisma.TaskAssigneeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskAssigneeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TaskAssigneeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>[];
                };
                upsert: {
                    args: Prisma.TaskAssigneeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskAssigneePayload>;
                };
                aggregate: {
                    args: Prisma.TaskAssigneeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaskAssignee>;
                };
                groupBy: {
                    args: Prisma.TaskAssigneeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskAssigneeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskAssigneeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskAssigneeCountAggregateOutputType> | number;
                };
            };
        };
        TaskTag: {
            payload: Prisma.$TaskTagPayload<ExtArgs>;
            fields: Prisma.TaskTagFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskTagFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskTagFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>;
                };
                findFirst: {
                    args: Prisma.TaskTagFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskTagFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>;
                };
                findMany: {
                    args: Prisma.TaskTagFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>[];
                };
                create: {
                    args: Prisma.TaskTagCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>;
                };
                createMany: {
                    args: Prisma.TaskTagCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TaskTagCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>[];
                };
                delete: {
                    args: Prisma.TaskTagDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>;
                };
                update: {
                    args: Prisma.TaskTagUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>;
                };
                deleteMany: {
                    args: Prisma.TaskTagDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskTagUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TaskTagUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>[];
                };
                upsert: {
                    args: Prisma.TaskTagUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskTagPayload>;
                };
                aggregate: {
                    args: Prisma.TaskTagAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaskTag>;
                };
                groupBy: {
                    args: Prisma.TaskTagGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskTagGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskTagCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskTagCountAggregateOutputType> | number;
                };
            };
        };
        Comment: {
            payload: Prisma.$CommentPayload<ExtArgs>;
            fields: Prisma.CommentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CommentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findFirst: {
                    args: Prisma.CommentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findMany: {
                    args: Prisma.CommentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                create: {
                    args: Prisma.CommentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                createMany: {
                    args: Prisma.CommentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                delete: {
                    args: Prisma.CommentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                update: {
                    args: Prisma.CommentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                deleteMany: {
                    args: Prisma.CommentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CommentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                upsert: {
                    args: Prisma.CommentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                aggregate: {
                    args: Prisma.CommentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateComment>;
                };
                groupBy: {
                    args: Prisma.CommentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CommentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentCountAggregateOutputType> | number;
                };
            };
        };
        Reaction: {
            payload: Prisma.$ReactionPayload<ExtArgs>;
            fields: Prisma.ReactionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReactionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReactionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>;
                };
                findFirst: {
                    args: Prisma.ReactionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReactionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>;
                };
                findMany: {
                    args: Prisma.ReactionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>[];
                };
                create: {
                    args: Prisma.ReactionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>;
                };
                createMany: {
                    args: Prisma.ReactionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ReactionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>[];
                };
                delete: {
                    args: Prisma.ReactionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>;
                };
                update: {
                    args: Prisma.ReactionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>;
                };
                deleteMany: {
                    args: Prisma.ReactionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReactionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ReactionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>[];
                };
                upsert: {
                    args: Prisma.ReactionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReactionPayload>;
                };
                aggregate: {
                    args: Prisma.ReactionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReaction>;
                };
                groupBy: {
                    args: Prisma.ReactionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReactionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReactionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReactionCountAggregateOutputType> | number;
                };
            };
        };
        Mention: {
            payload: Prisma.$MentionPayload<ExtArgs>;
            fields: Prisma.MentionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MentionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MentionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>;
                };
                findFirst: {
                    args: Prisma.MentionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MentionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>;
                };
                findMany: {
                    args: Prisma.MentionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>[];
                };
                create: {
                    args: Prisma.MentionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>;
                };
                createMany: {
                    args: Prisma.MentionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MentionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>[];
                };
                delete: {
                    args: Prisma.MentionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>;
                };
                update: {
                    args: Prisma.MentionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>;
                };
                deleteMany: {
                    args: Prisma.MentionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MentionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MentionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>[];
                };
                upsert: {
                    args: Prisma.MentionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentionPayload>;
                };
                aggregate: {
                    args: Prisma.MentionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMention>;
                };
                groupBy: {
                    args: Prisma.MentionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MentionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentionCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
        Attachment: {
            payload: Prisma.$AttachmentPayload<ExtArgs>;
            fields: Prisma.AttachmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AttachmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AttachmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>;
                };
                findFirst: {
                    args: Prisma.AttachmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AttachmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>;
                };
                findMany: {
                    args: Prisma.AttachmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>[];
                };
                create: {
                    args: Prisma.AttachmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>;
                };
                createMany: {
                    args: Prisma.AttachmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AttachmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>[];
                };
                delete: {
                    args: Prisma.AttachmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>;
                };
                update: {
                    args: Prisma.AttachmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>;
                };
                deleteMany: {
                    args: Prisma.AttachmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AttachmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AttachmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>[];
                };
                upsert: {
                    args: Prisma.AttachmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AttachmentPayload>;
                };
                aggregate: {
                    args: Prisma.AttachmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAttachment>;
                };
                groupBy: {
                    args: Prisma.AttachmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AttachmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AttachmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AttachmentCountAggregateOutputType> | number;
                };
            };
        };
        TimeEntry: {
            payload: Prisma.$TimeEntryPayload<ExtArgs>;
            fields: Prisma.TimeEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TimeEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TimeEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>;
                };
                findFirst: {
                    args: Prisma.TimeEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TimeEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>;
                };
                findMany: {
                    args: Prisma.TimeEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>[];
                };
                create: {
                    args: Prisma.TimeEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>;
                };
                createMany: {
                    args: Prisma.TimeEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TimeEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>[];
                };
                delete: {
                    args: Prisma.TimeEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>;
                };
                update: {
                    args: Prisma.TimeEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.TimeEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TimeEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TimeEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>[];
                };
                upsert: {
                    args: Prisma.TimeEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TimeEntryPayload>;
                };
                aggregate: {
                    args: Prisma.TimeEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTimeEntry>;
                };
                groupBy: {
                    args: Prisma.TimeEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TimeEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TimeEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TimeEntryCountAggregateOutputType> | number;
                };
            };
        };
        ActivityLog: {
            payload: Prisma.$ActivityLogPayload<ExtArgs>;
            fields: Prisma.ActivityLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ActivityLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ActivityLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                findFirst: {
                    args: Prisma.ActivityLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ActivityLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                findMany: {
                    args: Prisma.ActivityLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>[];
                };
                create: {
                    args: Prisma.ActivityLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                createMany: {
                    args: Prisma.ActivityLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ActivityLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>[];
                };
                delete: {
                    args: Prisma.ActivityLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                update: {
                    args: Prisma.ActivityLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                deleteMany: {
                    args: Prisma.ActivityLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ActivityLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ActivityLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>[];
                };
                upsert: {
                    args: Prisma.ActivityLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ActivityLogPayload>;
                };
                aggregate: {
                    args: Prisma.ActivityLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateActivityLog>;
                };
                groupBy: {
                    args: Prisma.ActivityLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ActivityLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ActivityLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ActivityLogCountAggregateOutputType> | number;
                };
            };
        };
        Channel: {
            payload: Prisma.$ChannelPayload<ExtArgs>;
            fields: Prisma.ChannelFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChannelFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChannelFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>;
                };
                findFirst: {
                    args: Prisma.ChannelFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChannelFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>;
                };
                findMany: {
                    args: Prisma.ChannelFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>[];
                };
                create: {
                    args: Prisma.ChannelCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>;
                };
                createMany: {
                    args: Prisma.ChannelCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ChannelCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>[];
                };
                delete: {
                    args: Prisma.ChannelDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>;
                };
                update: {
                    args: Prisma.ChannelUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>;
                };
                deleteMany: {
                    args: Prisma.ChannelDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChannelUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ChannelUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>[];
                };
                upsert: {
                    args: Prisma.ChannelUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelPayload>;
                };
                aggregate: {
                    args: Prisma.ChannelAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChannel>;
                };
                groupBy: {
                    args: Prisma.ChannelGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChannelCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelCountAggregateOutputType> | number;
                };
            };
        };
        ChannelMember: {
            payload: Prisma.$ChannelMemberPayload<ExtArgs>;
            fields: Prisma.ChannelMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChannelMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChannelMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>;
                };
                findFirst: {
                    args: Prisma.ChannelMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChannelMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>;
                };
                findMany: {
                    args: Prisma.ChannelMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>[];
                };
                create: {
                    args: Prisma.ChannelMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>;
                };
                createMany: {
                    args: Prisma.ChannelMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ChannelMemberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>[];
                };
                delete: {
                    args: Prisma.ChannelMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>;
                };
                update: {
                    args: Prisma.ChannelMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.ChannelMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChannelMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ChannelMemberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>[];
                };
                upsert: {
                    args: Prisma.ChannelMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMemberPayload>;
                };
                aggregate: {
                    args: Prisma.ChannelMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChannelMember>;
                };
                groupBy: {
                    args: Prisma.ChannelMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMemberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChannelMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMemberCountAggregateOutputType> | number;
                };
            };
        };
        ChannelMessage: {
            payload: Prisma.$ChannelMessagePayload<ExtArgs>;
            fields: Prisma.ChannelMessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChannelMessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChannelMessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>;
                };
                findFirst: {
                    args: Prisma.ChannelMessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChannelMessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>;
                };
                findMany: {
                    args: Prisma.ChannelMessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>[];
                };
                create: {
                    args: Prisma.ChannelMessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>;
                };
                createMany: {
                    args: Prisma.ChannelMessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ChannelMessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>[];
                };
                delete: {
                    args: Prisma.ChannelMessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>;
                };
                update: {
                    args: Prisma.ChannelMessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>;
                };
                deleteMany: {
                    args: Prisma.ChannelMessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChannelMessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ChannelMessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>[];
                };
                upsert: {
                    args: Prisma.ChannelMessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessagePayload>;
                };
                aggregate: {
                    args: Prisma.ChannelMessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChannelMessage>;
                };
                groupBy: {
                    args: Prisma.ChannelMessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChannelMessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMessageCountAggregateOutputType> | number;
                };
            };
        };
        ChannelMessageMention: {
            payload: Prisma.$ChannelMessageMentionPayload<ExtArgs>;
            fields: Prisma.ChannelMessageMentionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChannelMessageMentionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChannelMessageMentionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>;
                };
                findFirst: {
                    args: Prisma.ChannelMessageMentionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChannelMessageMentionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>;
                };
                findMany: {
                    args: Prisma.ChannelMessageMentionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>[];
                };
                create: {
                    args: Prisma.ChannelMessageMentionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>;
                };
                createMany: {
                    args: Prisma.ChannelMessageMentionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ChannelMessageMentionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>[];
                };
                delete: {
                    args: Prisma.ChannelMessageMentionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>;
                };
                update: {
                    args: Prisma.ChannelMessageMentionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>;
                };
                deleteMany: {
                    args: Prisma.ChannelMessageMentionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChannelMessageMentionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ChannelMessageMentionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>[];
                };
                upsert: {
                    args: Prisma.ChannelMessageMentionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageMentionPayload>;
                };
                aggregate: {
                    args: Prisma.ChannelMessageMentionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChannelMessageMention>;
                };
                groupBy: {
                    args: Prisma.ChannelMessageMentionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMessageMentionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChannelMessageMentionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMessageMentionCountAggregateOutputType> | number;
                };
            };
        };
        ChannelMessageReaction: {
            payload: Prisma.$ChannelMessageReactionPayload<ExtArgs>;
            fields: Prisma.ChannelMessageReactionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChannelMessageReactionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChannelMessageReactionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>;
                };
                findFirst: {
                    args: Prisma.ChannelMessageReactionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChannelMessageReactionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>;
                };
                findMany: {
                    args: Prisma.ChannelMessageReactionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>[];
                };
                create: {
                    args: Prisma.ChannelMessageReactionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>;
                };
                createMany: {
                    args: Prisma.ChannelMessageReactionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ChannelMessageReactionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>[];
                };
                delete: {
                    args: Prisma.ChannelMessageReactionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>;
                };
                update: {
                    args: Prisma.ChannelMessageReactionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>;
                };
                deleteMany: {
                    args: Prisma.ChannelMessageReactionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChannelMessageReactionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ChannelMessageReactionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>[];
                };
                upsert: {
                    args: Prisma.ChannelMessageReactionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelMessageReactionPayload>;
                };
                aggregate: {
                    args: Prisma.ChannelMessageReactionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChannelMessageReaction>;
                };
                groupBy: {
                    args: Prisma.ChannelMessageReactionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMessageReactionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChannelMessageReactionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelMessageReactionCountAggregateOutputType> | number;
                };
            };
        };
        ChannelJoinRequest: {
            payload: Prisma.$ChannelJoinRequestPayload<ExtArgs>;
            fields: Prisma.ChannelJoinRequestFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChannelJoinRequestFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChannelJoinRequestFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>;
                };
                findFirst: {
                    args: Prisma.ChannelJoinRequestFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChannelJoinRequestFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>;
                };
                findMany: {
                    args: Prisma.ChannelJoinRequestFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>[];
                };
                create: {
                    args: Prisma.ChannelJoinRequestCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>;
                };
                createMany: {
                    args: Prisma.ChannelJoinRequestCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ChannelJoinRequestCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>[];
                };
                delete: {
                    args: Prisma.ChannelJoinRequestDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>;
                };
                update: {
                    args: Prisma.ChannelJoinRequestUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>;
                };
                deleteMany: {
                    args: Prisma.ChannelJoinRequestDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChannelJoinRequestUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ChannelJoinRequestUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>[];
                };
                upsert: {
                    args: Prisma.ChannelJoinRequestUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelJoinRequestPayload>;
                };
                aggregate: {
                    args: Prisma.ChannelJoinRequestAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChannelJoinRequest>;
                };
                groupBy: {
                    args: Prisma.ChannelJoinRequestGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelJoinRequestGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChannelJoinRequestCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelJoinRequestCountAggregateOutputType> | number;
                };
            };
        };
        Doc: {
            payload: Prisma.$DocPayload<ExtArgs>;
            fields: Prisma.DocFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DocFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DocFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>;
                };
                findFirst: {
                    args: Prisma.DocFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DocFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>;
                };
                findMany: {
                    args: Prisma.DocFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>[];
                };
                create: {
                    args: Prisma.DocCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>;
                };
                createMany: {
                    args: Prisma.DocCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DocCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>[];
                };
                delete: {
                    args: Prisma.DocDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>;
                };
                update: {
                    args: Prisma.DocUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>;
                };
                deleteMany: {
                    args: Prisma.DocDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DocUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DocUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>[];
                };
                upsert: {
                    args: Prisma.DocUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPayload>;
                };
                aggregate: {
                    args: Prisma.DocAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDoc>;
                };
                groupBy: {
                    args: Prisma.DocGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DocCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocCountAggregateOutputType> | number;
                };
            };
        };
        DocVersion: {
            payload: Prisma.$DocVersionPayload<ExtArgs>;
            fields: Prisma.DocVersionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DocVersionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DocVersionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>;
                };
                findFirst: {
                    args: Prisma.DocVersionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DocVersionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>;
                };
                findMany: {
                    args: Prisma.DocVersionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>[];
                };
                create: {
                    args: Prisma.DocVersionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>;
                };
                createMany: {
                    args: Prisma.DocVersionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DocVersionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>[];
                };
                delete: {
                    args: Prisma.DocVersionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>;
                };
                update: {
                    args: Prisma.DocVersionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>;
                };
                deleteMany: {
                    args: Prisma.DocVersionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DocVersionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DocVersionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>[];
                };
                upsert: {
                    args: Prisma.DocVersionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocVersionPayload>;
                };
                aggregate: {
                    args: Prisma.DocVersionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocVersion>;
                };
                groupBy: {
                    args: Prisma.DocVersionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocVersionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DocVersionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocVersionCountAggregateOutputType> | number;
                };
            };
        };
        DocPermission: {
            payload: Prisma.$DocPermissionPayload<ExtArgs>;
            fields: Prisma.DocPermissionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DocPermissionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DocPermissionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>;
                };
                findFirst: {
                    args: Prisma.DocPermissionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DocPermissionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>;
                };
                findMany: {
                    args: Prisma.DocPermissionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>[];
                };
                create: {
                    args: Prisma.DocPermissionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>;
                };
                createMany: {
                    args: Prisma.DocPermissionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DocPermissionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>[];
                };
                delete: {
                    args: Prisma.DocPermissionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>;
                };
                update: {
                    args: Prisma.DocPermissionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>;
                };
                deleteMany: {
                    args: Prisma.DocPermissionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DocPermissionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DocPermissionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>[];
                };
                upsert: {
                    args: Prisma.DocPermissionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocPermissionPayload>;
                };
                aggregate: {
                    args: Prisma.DocPermissionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocPermission>;
                };
                groupBy: {
                    args: Prisma.DocPermissionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocPermissionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DocPermissionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocPermissionCountAggregateOutputType> | number;
                };
            };
        };
        DocCommentThread: {
            payload: Prisma.$DocCommentThreadPayload<ExtArgs>;
            fields: Prisma.DocCommentThreadFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DocCommentThreadFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DocCommentThreadFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>;
                };
                findFirst: {
                    args: Prisma.DocCommentThreadFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DocCommentThreadFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>;
                };
                findMany: {
                    args: Prisma.DocCommentThreadFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>[];
                };
                create: {
                    args: Prisma.DocCommentThreadCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>;
                };
                createMany: {
                    args: Prisma.DocCommentThreadCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DocCommentThreadCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>[];
                };
                delete: {
                    args: Prisma.DocCommentThreadDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>;
                };
                update: {
                    args: Prisma.DocCommentThreadUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>;
                };
                deleteMany: {
                    args: Prisma.DocCommentThreadDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DocCommentThreadUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DocCommentThreadUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>[];
                };
                upsert: {
                    args: Prisma.DocCommentThreadUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentThreadPayload>;
                };
                aggregate: {
                    args: Prisma.DocCommentThreadAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocCommentThread>;
                };
                groupBy: {
                    args: Prisma.DocCommentThreadGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocCommentThreadGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DocCommentThreadCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocCommentThreadCountAggregateOutputType> | number;
                };
            };
        };
        DocComment: {
            payload: Prisma.$DocCommentPayload<ExtArgs>;
            fields: Prisma.DocCommentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DocCommentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DocCommentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>;
                };
                findFirst: {
                    args: Prisma.DocCommentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DocCommentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>;
                };
                findMany: {
                    args: Prisma.DocCommentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>[];
                };
                create: {
                    args: Prisma.DocCommentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>;
                };
                createMany: {
                    args: Prisma.DocCommentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DocCommentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>[];
                };
                delete: {
                    args: Prisma.DocCommentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>;
                };
                update: {
                    args: Prisma.DocCommentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>;
                };
                deleteMany: {
                    args: Prisma.DocCommentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DocCommentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DocCommentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>[];
                };
                upsert: {
                    args: Prisma.DocCommentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocCommentPayload>;
                };
                aggregate: {
                    args: Prisma.DocCommentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocComment>;
                };
                groupBy: {
                    args: Prisma.DocCommentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocCommentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DocCommentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocCommentCountAggregateOutputType> | number;
                };
            };
        };
        DocShareLink: {
            payload: Prisma.$DocShareLinkPayload<ExtArgs>;
            fields: Prisma.DocShareLinkFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DocShareLinkFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DocShareLinkFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>;
                };
                findFirst: {
                    args: Prisma.DocShareLinkFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DocShareLinkFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>;
                };
                findMany: {
                    args: Prisma.DocShareLinkFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>[];
                };
                create: {
                    args: Prisma.DocShareLinkCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>;
                };
                createMany: {
                    args: Prisma.DocShareLinkCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DocShareLinkCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>[];
                };
                delete: {
                    args: Prisma.DocShareLinkDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>;
                };
                update: {
                    args: Prisma.DocShareLinkUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>;
                };
                deleteMany: {
                    args: Prisma.DocShareLinkDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DocShareLinkUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DocShareLinkUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>[];
                };
                upsert: {
                    args: Prisma.DocShareLinkUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DocShareLinkPayload>;
                };
                aggregate: {
                    args: Prisma.DocShareLinkAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocShareLink>;
                };
                groupBy: {
                    args: Prisma.DocShareLinkGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocShareLinkGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DocShareLinkCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocShareLinkCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly fullName: "fullName";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly googleId: "googleId";
    readonly avatarUrl: "avatarUrl";
    readonly avatarColor: "avatarColor";
    readonly designation: "designation";
    readonly bio: "bio";
    readonly isOnline: "isOnline";
    readonly lastSeenAt: "lastSeenAt";
    readonly timezone: "timezone";
    readonly notificationPreferences: "notificationPreferences";
    readonly isEmailVerified: "isEmailVerified";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tokenHash: "tokenHash";
    readonly deviceInfo: "deviceInfo";
    readonly ipAddress: "ipAddress";
    readonly expiresAt: "expiresAt";
    readonly isRevoked: "isRevoked";
    readonly createdAt: "createdAt";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const PasswordResetTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tokenHash: "tokenHash";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type PasswordResetTokenScalarFieldEnum = (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum];
export declare const EmailVerificationTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly otpHash: "otpHash";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type EmailVerificationTokenScalarFieldEnum = (typeof EmailVerificationTokenScalarFieldEnum)[keyof typeof EmailVerificationTokenScalarFieldEnum];
export declare const WorkspaceScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly logoUrl: "logoUrl";
    readonly workspaceUse: "workspaceUse";
    readonly managementType: "managementType";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum];
export declare const WorkspaceMemberScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly userId: "userId";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type WorkspaceMemberScalarFieldEnum = (typeof WorkspaceMemberScalarFieldEnum)[keyof typeof WorkspaceMemberScalarFieldEnum];
export declare const WorkspaceInviteScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly email: "email";
    readonly role: "role";
    readonly inviteToken: "inviteToken";
    readonly invitedBy: "invitedBy";
    readonly status: "status";
    readonly expiresAt: "expiresAt";
    readonly acceptedAt: "acceptedAt";
    readonly createdAt: "createdAt";
};
export type WorkspaceInviteScalarFieldEnum = (typeof WorkspaceInviteScalarFieldEnum)[keyof typeof WorkspaceInviteScalarFieldEnum];
export declare const ProjectScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly name: "name";
    readonly description: "description";
    readonly color: "color";
    readonly icon: "icon";
    readonly taskIdPrefix: "taskIdPrefix";
    readonly taskCounter: "taskCounter";
    readonly isArchived: "isArchived";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum];
export declare const TaskListScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly name: "name";
    readonly position: "position";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly ownerUserId: "ownerUserId";
    readonly priority: "priority";
    readonly isArchived: "isArchived";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type TaskListScalarFieldEnum = (typeof TaskListScalarFieldEnum)[keyof typeof TaskListScalarFieldEnum];
export declare const StatusScalarFieldEnum: {
    readonly id: "id";
    readonly projectId: "projectId";
    readonly name: "name";
    readonly color: "color";
    readonly position: "position";
    readonly group: "group";
    readonly isDefault: "isDefault";
    readonly isProtected: "isProtected";
    readonly isClosed: "isClosed";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type StatusScalarFieldEnum = (typeof StatusScalarFieldEnum)[keyof typeof StatusScalarFieldEnum];
export declare const TagScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly name: "name";
    readonly color: "color";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum];
export declare const TaskScalarFieldEnum: {
    readonly id: "id";
    readonly listId: "listId";
    readonly parentId: "parentId";
    readonly depth: "depth";
    readonly title: "title";
    readonly description: "description";
    readonly descriptionJson: "descriptionJson";
    readonly descriptionPlaintext: "descriptionPlaintext";
    readonly statusId: "statusId";
    readonly priority: "priority";
    readonly taskNumber: "taskNumber";
    readonly startDate: "startDate";
    readonly dueDate: "dueDate";
    readonly position: "position";
    readonly boardPosition: "boardPosition";
    readonly isCompleted: "isCompleted";
    readonly completedAt: "completedAt";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum];
export declare const ProjectFavoriteScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly workspaceId: "workspaceId";
    readonly projectId: "projectId";
    readonly createdAt: "createdAt";
};
export type ProjectFavoriteScalarFieldEnum = (typeof ProjectFavoriteScalarFieldEnum)[keyof typeof ProjectFavoriteScalarFieldEnum];
export declare const TaskFavoriteScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly workspaceId: "workspaceId";
    readonly taskId: "taskId";
    readonly createdAt: "createdAt";
};
export type TaskFavoriteScalarFieldEnum = (typeof TaskFavoriteScalarFieldEnum)[keyof typeof TaskFavoriteScalarFieldEnum];
export declare const TaskAssigneeScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly assignedBy: "assignedBy";
    readonly createdAt: "createdAt";
};
export type TaskAssigneeScalarFieldEnum = (typeof TaskAssigneeScalarFieldEnum)[keyof typeof TaskAssigneeScalarFieldEnum];
export declare const TaskTagScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly tagId: "tagId";
    readonly createdAt: "createdAt";
};
export type TaskTagScalarFieldEnum = (typeof TaskTagScalarFieldEnum)[keyof typeof TaskTagScalarFieldEnum];
export declare const CommentScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly parentId: "parentId";
    readonly content: "content";
    readonly isEdited: "isEdited";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];
export declare const ReactionScalarFieldEnum: {
    readonly id: "id";
    readonly commentId: "commentId";
    readonly memberId: "memberId";
    readonly reactFace: "reactFace";
    readonly createdAt: "createdAt";
};
export type ReactionScalarFieldEnum = (typeof ReactionScalarFieldEnum)[keyof typeof ReactionScalarFieldEnum];
export declare const MentionScalarFieldEnum: {
    readonly id: "id";
    readonly commentId: "commentId";
    readonly mentionedUserId: "mentionedUserId";
    readonly createdAt: "createdAt";
};
export type MentionScalarFieldEnum = (typeof MentionScalarFieldEnum)[keyof typeof MentionScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly title: "title";
    readonly message: "message";
    readonly referenceType: "referenceType";
    readonly referenceId: "referenceId";
    readonly actorId: "actorId";
    readonly isRead: "isRead";
    readonly readAt: "readAt";
    readonly isCleared: "isCleared";
    readonly isSnoozed: "isSnoozed";
    readonly snoozedAt: "snoozedAt";
    readonly createdAt: "createdAt";
    readonly isCommented: "isCommented";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const AttachmentScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly docId: "docId";
    readonly channelMessageId: "channelMessageId";
    readonly uploadedBy: "uploadedBy";
    readonly fileName: "fileName";
    readonly s3Key: "s3Key";
    readonly mimeType: "mimeType";
    readonly fileSize: "fileSize";
    readonly createdAt: "createdAt";
    readonly deletedAt: "deletedAt";
};
export type AttachmentScalarFieldEnum = (typeof AttachmentScalarFieldEnum)[keyof typeof AttachmentScalarFieldEnum];
export declare const TimeEntryScalarFieldEnum: {
    readonly id: "id";
    readonly taskId: "taskId";
    readonly userId: "userId";
    readonly description: "description";
    readonly startTime: "startTime";
    readonly endTime: "endTime";
    readonly duration: "duration";
    readonly isManual: "isManual";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type TimeEntryScalarFieldEnum = (typeof TimeEntryScalarFieldEnum)[keyof typeof TimeEntryScalarFieldEnum];
export declare const ActivityLogScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly entityType: "entityType";
    readonly entityId: "entityId";
    readonly action: "action";
    readonly fieldName: "fieldName";
    readonly oldValue: "oldValue";
    readonly newValue: "newValue";
    readonly metadata: "metadata";
    readonly performedBy: "performedBy";
    readonly createdAt: "createdAt";
};
export type ActivityLogScalarFieldEnum = (typeof ActivityLogScalarFieldEnum)[keyof typeof ActivityLogScalarFieldEnum];
export declare const ChannelScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly projectId: "projectId";
    readonly name: "name";
    readonly description: "description";
    readonly kind: "kind";
    readonly privacy: "privacy";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ChannelScalarFieldEnum = (typeof ChannelScalarFieldEnum)[keyof typeof ChannelScalarFieldEnum];
export declare const ChannelMemberScalarFieldEnum: {
    readonly id: "id";
    readonly channelId: "channelId";
    readonly userId: "userId";
    readonly role: "role";
    readonly isMuted: "isMuted";
    readonly lastReadMessageId: "lastReadMessageId";
    readonly unreadCount: "unreadCount";
    readonly joinedAt: "joinedAt";
    readonly createdAt: "createdAt";
};
export type ChannelMemberScalarFieldEnum = (typeof ChannelMemberScalarFieldEnum)[keyof typeof ChannelMemberScalarFieldEnum];
export declare const ChannelMessageScalarFieldEnum: {
    readonly id: "id";
    readonly channelId: "channelId";
    readonly senderId: "senderId";
    readonly kind: "kind";
    readonly contentJson: "contentJson";
    readonly plaintext: "plaintext";
    readonly replyToMessageId: "replyToMessageId";
    readonly isEdited: "isEdited";
    readonly editedAt: "editedAt";
    readonly isPinned: "isPinned";
    readonly pinnedAt: "pinnedAt";
    readonly pinnedById: "pinnedById";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type ChannelMessageScalarFieldEnum = (typeof ChannelMessageScalarFieldEnum)[keyof typeof ChannelMessageScalarFieldEnum];
export declare const ChannelMessageMentionScalarFieldEnum: {
    readonly id: "id";
    readonly messageId: "messageId";
    readonly mentionedUserId: "mentionedUserId";
    readonly createdAt: "createdAt";
};
export type ChannelMessageMentionScalarFieldEnum = (typeof ChannelMessageMentionScalarFieldEnum)[keyof typeof ChannelMessageMentionScalarFieldEnum];
export declare const ChannelMessageReactionScalarFieldEnum: {
    readonly id: "id";
    readonly messageId: "messageId";
    readonly userId: "userId";
    readonly emoji: "emoji";
    readonly createdAt: "createdAt";
};
export type ChannelMessageReactionScalarFieldEnum = (typeof ChannelMessageReactionScalarFieldEnum)[keyof typeof ChannelMessageReactionScalarFieldEnum];
export declare const ChannelJoinRequestScalarFieldEnum: {
    readonly id: "id";
    readonly channelId: "channelId";
    readonly userId: "userId";
    readonly status: "status";
    readonly requestedAt: "requestedAt";
    readonly decidedById: "decidedById";
    readonly decidedAt: "decidedAt";
};
export type ChannelJoinRequestScalarFieldEnum = (typeof ChannelJoinRequestScalarFieldEnum)[keyof typeof ChannelJoinRequestScalarFieldEnum];
export declare const DocScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly projectId: "projectId";
    readonly ownerId: "ownerId";
    readonly scope: "scope";
    readonly title: "title";
    readonly contentJson: "contentJson";
    readonly plaintext: "plaintext";
    readonly version: "version";
    readonly lastCheckpointAt: "lastCheckpointAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type DocScalarFieldEnum = (typeof DocScalarFieldEnum)[keyof typeof DocScalarFieldEnum];
export declare const DocVersionScalarFieldEnum: {
    readonly id: "id";
    readonly docId: "docId";
    readonly contentJson: "contentJson";
    readonly type: "type";
    readonly label: "label";
    readonly createdAt: "createdAt";
    readonly createdById: "createdById";
};
export type DocVersionScalarFieldEnum = (typeof DocVersionScalarFieldEnum)[keyof typeof DocVersionScalarFieldEnum];
export declare const DocPermissionScalarFieldEnum: {
    readonly id: "id";
    readonly docId: "docId";
    readonly userId: "userId";
    readonly role: "role";
    readonly grantedById: "grantedById";
    readonly createdAt: "createdAt";
};
export type DocPermissionScalarFieldEnum = (typeof DocPermissionScalarFieldEnum)[keyof typeof DocPermissionScalarFieldEnum];
export declare const DocCommentThreadScalarFieldEnum: {
    readonly id: "id";
    readonly docId: "docId";
    readonly anchorBlockId: "anchorBlockId";
    readonly anchorMeta: "anchorMeta";
    readonly resolved: "resolved";
    readonly isOrphan: "isOrphan";
    readonly createdById: "createdById";
    readonly createdAt: "createdAt";
};
export type DocCommentThreadScalarFieldEnum = (typeof DocCommentThreadScalarFieldEnum)[keyof typeof DocCommentThreadScalarFieldEnum];
export declare const DocCommentScalarFieldEnum: {
    readonly id: "id";
    readonly threadId: "threadId";
    readonly authorId: "authorId";
    readonly body: "body";
    readonly editedAt: "editedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly deletedAt: "deletedAt";
};
export type DocCommentScalarFieldEnum = (typeof DocCommentScalarFieldEnum)[keyof typeof DocCommentScalarFieldEnum];
export declare const DocShareLinkScalarFieldEnum: {
    readonly id: "id";
    readonly docId: "docId";
    readonly token: "token";
    readonly role: "role";
    readonly expiresAt: "expiresAt";
    readonly createdById: "createdById";
    readonly revokedAt: "revokedAt";
    readonly createdAt: "createdAt";
};
export type DocShareLinkScalarFieldEnum = (typeof DocShareLinkScalarFieldEnum)[keyof typeof DocShareLinkScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumWorkspaceUseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceUse'>;
export type ListEnumWorkspaceUseFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceUse[]'>;
export type EnumWorkspaceManagementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceManagementType'>;
export type ListEnumWorkspaceManagementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceManagementType[]'>;
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>;
export type EnumInviteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InviteStatus'>;
export type ListEnumInviteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InviteStatus[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority'>;
export type ListEnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority[]'>;
export type EnumStatusGroupFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusGroup'>;
export type ListEnumStatusGroupFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusGroup[]'>;
export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;
export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>;
export type EnumChannelKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelKind'>;
export type ListEnumChannelKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelKind[]'>;
export type EnumChannelPrivacyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelPrivacy'>;
export type ListEnumChannelPrivacyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelPrivacy[]'>;
export type EnumChannelMessageKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelMessageKind'>;
export type ListEnumChannelMessageKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelMessageKind[]'>;
export type EnumChannelJoinRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelJoinRequestStatus'>;
export type ListEnumChannelJoinRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChannelJoinRequestStatus[]'>;
export type EnumDocScopeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocScope'>;
export type ListEnumDocScopeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocScope[]'>;
export type EnumDocVersionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocVersionType'>;
export type ListEnumDocVersionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocVersionType[]'>;
export type EnumDocRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocRole'>;
export type ListEnumDocRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocRole[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    refreshToken?: Prisma.RefreshTokenOmit;
    passwordResetToken?: Prisma.PasswordResetTokenOmit;
    emailVerificationToken?: Prisma.EmailVerificationTokenOmit;
    workspace?: Prisma.WorkspaceOmit;
    workspaceMember?: Prisma.WorkspaceMemberOmit;
    workspaceInvite?: Prisma.WorkspaceInviteOmit;
    project?: Prisma.ProjectOmit;
    taskList?: Prisma.TaskListOmit;
    status?: Prisma.StatusOmit;
    tag?: Prisma.TagOmit;
    task?: Prisma.TaskOmit;
    projectFavorite?: Prisma.ProjectFavoriteOmit;
    taskFavorite?: Prisma.TaskFavoriteOmit;
    taskAssignee?: Prisma.TaskAssigneeOmit;
    taskTag?: Prisma.TaskTagOmit;
    comment?: Prisma.CommentOmit;
    reaction?: Prisma.ReactionOmit;
    mention?: Prisma.MentionOmit;
    notification?: Prisma.NotificationOmit;
    attachment?: Prisma.AttachmentOmit;
    timeEntry?: Prisma.TimeEntryOmit;
    activityLog?: Prisma.ActivityLogOmit;
    channel?: Prisma.ChannelOmit;
    channelMember?: Prisma.ChannelMemberOmit;
    channelMessage?: Prisma.ChannelMessageOmit;
    channelMessageMention?: Prisma.ChannelMessageMentionOmit;
    channelMessageReaction?: Prisma.ChannelMessageReactionOmit;
    channelJoinRequest?: Prisma.ChannelJoinRequestOmit;
    doc?: Prisma.DocOmit;
    docVersion?: Prisma.DocVersionOmit;
    docPermission?: Prisma.DocPermissionOmit;
    docCommentThread?: Prisma.DocCommentThreadOmit;
    docComment?: Prisma.DocCommentOmit;
    docShareLink?: Prisma.DocShareLinkOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
