export declare class EmailService {
    private readonly resend;
    private readonly logger;
    constructor();
    private get fromAddress();
    sendOtpEmail(to: string, fullName: string, otp: string): Promise<void>;
    sendPasswordResetEmail(to: string, fullName: string, resetUrl: string): Promise<void>;
    sendWorkspaceInviteEmail(to: string, inviterName: string, workspaceName: string, inviteUrl: string): Promise<void>;
    private send;
}
