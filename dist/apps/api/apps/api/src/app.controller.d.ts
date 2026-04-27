import { AppService } from './app.service';
import { HealthResponseDto } from './health/health.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    checkHealth(): Promise<HealthResponseDto>;
}
