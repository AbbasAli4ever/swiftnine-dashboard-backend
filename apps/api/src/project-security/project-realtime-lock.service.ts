import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export type ProjectLockChangedEvent = {
  projectId: string;
  reason: 'password_changed' | 'password_removed' | 'password_reset';
};

@Injectable()
export class ProjectRealtimeLockService {
  private readonly lockChangedSubject = new Subject<ProjectLockChangedEvent>();

  readonly lockChanged$ = this.lockChangedSubject.asObservable();

  emitLockChanged(event: ProjectLockChangedEvent): void {
    this.lockChangedSubject.next(event);
  }
}
