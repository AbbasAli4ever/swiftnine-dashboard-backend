"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    resend;
    logger = new common_1.Logger(EmailService_1.name);
    constructor() {
        this.resend = new resend_1.Resend(process.env['RESEND_API_KEY']);
    }
    get fromAddress() {
        return process.env['EMAIL_FROM'] ?? 'Dashboard <noreply@swiftnine.com>';
    }
    async sendOtpEmail(to, fullName, otp) {
        const html = buildOtpEmail(fullName, otp);
        await this.send(to, 'Verify your Dashboard account', html);
    }
    async sendPasswordResetEmail(to, fullName, resetUrl) {
        const html = buildPasswordResetEmail(fullName, resetUrl);
        await this.send(to, 'Reset your Dashboard password', html);
    }
    async sendProjectPasswordResetEmail(to, fullName, projectName, resetUrl) {
        const html = buildProjectPasswordResetEmail(fullName, projectName, resetUrl);
        await this.send(to, `Reset password for ${projectName}`, html);
    }
    async sendWorkspaceInviteEmail(to, inviterName, workspaceName, inviteUrl) {
        const html = buildWorkspaceInviteEmail(inviterName, workspaceName, inviteUrl);
        await this.send(to, `${inviterName} invited you to ${workspaceName} on Dashboard`, html);
    }
    async send(to, subject, html) {
        const { error } = await this.resend.emails.send({
            from: this.fromAddress,
            to,
            subject,
            html,
        });
        if (error) {
            this.logger.error(`Failed to send email to ${to}: ${JSON.stringify(error)}`);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
function baseLayout(content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f6fa;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#7b68ee;border-radius:10px;padding:10px 16px;">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Dashboard</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#a0a3b1;">
                © ${new Date().getFullYear()} SwiftNine. All rights reserved.<br/>
                This is an automated message — please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function buildOtpEmail(fullName, otp) {
    const firstName = fullName.split(' ')[0] ?? fullName;
    const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1d27;">Verify your email</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b6f82;line-height:1.6;">
      Hey ${firstName}, welcome to FocusHub! Enter the code below to verify your account.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
      <tr>
        <td style="background-color:#f5f6fa;border:2px solid #e8e9f0;border-radius:10px;padding:18px 36px;text-align:center;">
          <span style="font-size:34px;font-weight:700;color:#1a1d27;letter-spacing:12px;font-family:'Courier New',Courier,monospace;">${otp}</span>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:#a0a3b1;text-align:center;">
      This code expires in <strong>15 minutes</strong>.
    </p>
    <p style="margin:0;font-size:13px;color:#a0a3b1;text-align:center;">
      If you didn't create a FocusHub account, you can safely ignore this email.
    </p>
  `;
    return baseLayout(content);
}
function buildPasswordResetEmail(fullName, resetUrl) {
    const firstName = fullName.split(' ')[0] ?? fullName;
    const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1d27;">Reset your password</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b6f82;line-height:1.6;">
      Hey ${firstName}, we received a request to reset your Dashboard password.
      Click the button below to choose a new one.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
      <tr>
        <td align="center" style="background-color:#7b68ee;border-radius:8px;">
          <a href="${resetUrl}"
             style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:#a0a3b1;text-align:center;">
      This link expires in <strong>1 hour</strong>.
    </p>
    <p style="margin:0 0 20px;font-size:13px;color:#a0a3b1;text-align:center;">
      If you didn't request a password reset, you can safely ignore this email.
    </p>

    <div style="border-top:1px solid #f0f1f5;padding-top:20px;">
      <p style="margin:0;font-size:12px;color:#a0a3b1;word-break:break-all;">
        Or copy this link into your browser:<br/>
        <a href="${resetUrl}" style="color:#7b68ee;">${resetUrl}</a>
      </p>
    </div>
  `;
    return baseLayout(content);
}
function buildProjectPasswordResetEmail(fullName, projectName, resetUrl) {
    const firstName = fullName.split(' ')[0] ?? fullName;
    const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1d27;">Reset project password</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b6f82;line-height:1.6;">
      Hey ${firstName}, we received a request to reset the password for
      <strong>${projectName}</strong>.
      Click the button below to choose a new project password.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
      <tr>
        <td align="center" style="background-color:#7b68ee;border-radius:8px;">
          <a href="${resetUrl}"
             style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
            Reset Project Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:#a0a3b1;text-align:center;">
      This link expires in <strong>1 hour</strong>.
    </p>
    <p style="margin:0 0 20px;font-size:13px;color:#a0a3b1;text-align:center;">
      If you didn't request this reset, you can safely ignore this email.
    </p>

    <div style="border-top:1px solid #f0f1f5;padding-top:20px;">
      <p style="margin:0;font-size:12px;color:#a0a3b1;word-break:break-all;">
        Or copy this link into your browser:<br/>
        <a href="${resetUrl}" style="color:#7b68ee;">${resetUrl}</a>
      </p>
    </div>
  `;
    return baseLayout(content);
}
function buildWorkspaceInviteEmail(inviterName, workspaceName, inviteUrl) {
    const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1d27;">
      You're invited to join <span style="color:#7b68ee;">${workspaceName}</span>
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b6f82;line-height:1.6;">
      <strong>${inviterName}</strong> has invited you to collaborate on Dashboard.
      Click below to accept the invitation and get started.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
      <tr>
        <td align="center" style="background-color:#7b68ee;border-radius:8px;">
          <a href="${inviteUrl}"
             style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
            Accept Invitation
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:#a0a3b1;text-align:center;">
      This invitation expires in <strong>7 days</strong>.
    </p>
    <p style="margin:0 0 20px;font-size:13px;color:#a0a3b1;text-align:center;">
      If you weren't expecting this invitation, you can safely ignore this email.
    </p>

    <div style="border-top:1px solid #f0f1f5;padding-top:20px;">
      <p style="margin:0;font-size:12px;color:#a0a3b1;word-break:break-all;">
        Or copy this link into your browser:<br/>
        <a href="${inviteUrl}" style="color:#7b68ee;">${inviteUrl}</a>
      </p>
    </div>
  `;
    return baseLayout(content);
}
//# sourceMappingURL=email.service.js.map