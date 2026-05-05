export declare class ChatRateLimitService {
    private readonly buckets;
    assertMessageSend(userId: string, channelId: string): void;
    assertReactionToggle(userId: string, channelId: string): void;
    assertTypingEvent(userId: string, channelId: string): void;
    private assertHttp;
    private assertWs;
    private consume;
}
