export declare class RealtimeMetricsService {
    private readonly logger;
    private readonly socketsByNamespace;
    private messagesSent;
    trackSocketConnected(namespace: string, socketId: string): void;
    trackSocketDisconnected(namespace: string, socketId: string): void;
    recordMessageSent(channelId: string, userId: string): void;
    snapshot(): {
        messagesSent: number;
        activeSockets: {
            [k: string]: number;
        };
    };
}
