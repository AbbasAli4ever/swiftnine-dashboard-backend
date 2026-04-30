import type { Prisma } from '@app/database/generated/prisma/client';
export declare const TAG_NOT_FOUND = "Tag not found";
export declare const TAG_NAME_TAKEN = "A tag with this name already exists in this workspace";
export declare const TAG_SELECT: runtime.Types.Extensions.GetSelect<{
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
