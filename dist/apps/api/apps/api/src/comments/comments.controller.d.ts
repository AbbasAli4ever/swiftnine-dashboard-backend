import { CommentsService } from './comments.service';
import { SseService } from './sse.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import type { Response } from 'express';
export declare class CommentsController {
    private readonly commentsService;
    private readonly sse;
    constructor(commentsService: CommentsService, sse: SseService);
    stream(req: WorkspaceRequest, taskId: string, res: Response): Promise<void>;
    create(req: WorkspaceRequest, taskId: string, dto: CreateCommentDto): Promise<ApiRes<any>>;
    update(req: WorkspaceRequest, commentId: string, dto: UpdateCommentDto): Promise<ApiRes<any>>;
    remove(req: WorkspaceRequest, commentId: string): Promise<ApiRes<null>>;
    addReaction(req: WorkspaceRequest, commentId: string, dto: CreateReactionDto): Promise<ApiRes<{
        member: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            role: import("@app/database/generated/prisma/enums").Role;
            workspaceId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        commentId: string;
        memberId: string;
        reactFace: string;
    }>>;
    deleteReaction(req: WorkspaceRequest, reactionId: string): Promise<ApiRes<null>>;
}
