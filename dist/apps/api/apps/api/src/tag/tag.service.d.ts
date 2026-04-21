import { PrismaService } from "../../../../libs/database/src";
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
import { TAG_SELECT } from './tag.constants';
import type { CreateTagDto } from './dto/create-tag.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';
export type TagData = Prisma.TagGetPayload<{
    select: typeof TAG_SELECT;
}>;
export declare class TagService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, userId: string, dto: CreateTagDto): Promise<TagData>;
    findAll(workspaceId: string): Promise<TagData[]>;
    update(workspaceId: string, userId: string, tagId: string, dto: UpdateTagDto): Promise<TagData>;
    remove(workspaceId: string, userId: string, tagId: string): Promise<void>;
    private findTagOrThrow;
}
