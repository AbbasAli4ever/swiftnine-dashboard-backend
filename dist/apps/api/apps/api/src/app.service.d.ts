import { PrismaService } from '@app/database';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkDbConnection(): Promise<{
        status: string;
        database: string;
        message?: undefined;
    } | {
        status: string;
        database: string;
        message: any;
    }>;
}
