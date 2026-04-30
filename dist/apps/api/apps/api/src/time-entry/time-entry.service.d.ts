import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import { TIME_ENTRY_SELECT } from './time-entry.constants';
import type { ManualTimeEntryDto } from './dto/manual-time-entry.dto';
import type { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
export type TimeEntryData = Prisma.TimeEntryGetPayload<{
    select: typeof TIME_ENTRY_SELECT;
}>;
export type StartTimerResult = {
    stoppedEntry: TimeEntryData | null;
    activeEntry: TimeEntryData;
};
export declare class TimeEntryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addManual(workspaceId: string, userId: string, taskId: string, dto: ManualTimeEntryDto): Promise<TimeEntryData>;
    startTimer(workspaceId: string, userId: string, taskId: string): Promise<StartTimerResult>;
    stopTimer(workspaceId: string, userId: string, taskId: string): Promise<TimeEntryData>;
    findAllByTask(workspaceId: string, taskId: string): Promise<TimeEntryData[]>;
    findActiveTimer(workspaceId: string, userId: string): Promise<TimeEntryData | null>;
    update(workspaceId: string, userId: string, entryId: string, dto: UpdateTimeEntryDto): Promise<TimeEntryData>;
    remove(workspaceId: string, userId: string, entryId: string): Promise<void>;
    private findTaskOrThrow;
    private findEntryOrThrow;
    private findActiveTimerForUser;
    private stopActiveEntry;
}
