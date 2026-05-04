import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
export declare class SseJwtGuard extends JwtAuthGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
