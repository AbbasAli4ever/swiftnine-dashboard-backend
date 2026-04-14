import type { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { Request } from 'express';
export declare function buildCorsOptions(env: NodeJS.ProcessEnv): CorsOptionsDelegate<Request>;
