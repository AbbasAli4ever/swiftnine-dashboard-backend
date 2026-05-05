import type { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { Request } from 'express';
export declare function buildCorsOptions(env: NodeJS.ProcessEnv): CorsOptionsDelegate<Request>;
export declare function buildWebsocketCorsOptions(env: NodeJS.ProcessEnv): {
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void;
};
