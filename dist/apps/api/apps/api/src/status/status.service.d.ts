import { PrismaService } from '@app/database';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
import { STATUS_SELECT } from './status.constants';
import type { CreateStatusDto } from './dto/create-status.dto';
import type { UpdateStatusDto } from './dto/update-status.dto';
import type { DeleteStatusDto } from './dto/delete-status.dto';
import type { ReorderStatusesDto } from './dto/reorder-statuses.dto';
import type { DefaultStatusesDto } from './dto/default-statuses.dto';
export type StatusData = Prisma.StatusGetPayload<{
    select: typeof STATUS_SELECT;
}>;
export type GroupedStatuses = {
    projectId: string;
    groups: {
        notStarted: StatusData[];
        active: StatusData[];
        done: StatusData[];
        closed: StatusData[];
    };
};
export declare class StatusService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, userId: string, role: Role, dto: CreateStatusDto): Promise<StatusData>;
    findAll(workspaceId: string, projectId: string): Promise<GroupedStatuses>;
    findOne(workspaceId: string, statusId: string): Promise<StatusData>;
    update(workspaceId: string, statusId: string, userId: string, role: Role, dto: UpdateStatusDto): Promise<StatusData>;
    remove(workspaceId: string, statusId: string, userId: string, role: Role, dto: DeleteStatusDto): Promise<void>;
    reorder(workspaceId: string, userId: string, role: Role, dto: ReorderStatusesDto): Promise<GroupedStatuses>;
    applyDefaultTemplate(workspaceId: string, userId: string, role: Role, dto: DefaultStatusesDto): Promise<GroupedStatuses>;
    private assertOwner;
    private findProjectOrThrow;
    private findStatusOrThrow;
    private listProjectStatuses;
    private groupStatuses;
    private getNextPosition;
    private assertUniqueStatusName;
}
