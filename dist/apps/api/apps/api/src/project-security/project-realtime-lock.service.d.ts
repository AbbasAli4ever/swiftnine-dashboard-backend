export type ProjectLockChangedEvent = {
    projectId: string;
    reason: 'password_changed' | 'password_removed' | 'password_reset';
};
export declare class ProjectRealtimeLockService {
    private readonly lockChangedSubject;
    readonly lockChanged$: import("rxjs").Observable<ProjectLockChangedEvent>;
    emitLockChanged(event: ProjectLockChangedEvent): void;
}
