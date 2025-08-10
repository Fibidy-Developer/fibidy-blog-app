// src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<boolean> {
    try {
      this.logger.log(`Sending reset password email to: ${email}`);

      const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${token}`;
      const appName = this.configService.get('APP_NAME') || 'Your App';

      const emailResponse = await this.resend.emails.send({
        from: this.configService.get('FROM_EMAIL') || 'noreply@fibidy.com',
        to: email,
        subject: `Reset Your ${appName} Password`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0; font-size: 24px;">Password Reset Request</h2>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(220, 53, 69, 0.3); transition: all 0.3s ease;">
                  Reset Your Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 25px;">
                Or copy and paste this link in your browser:
              </p>
              
              <div style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 14px; margin: 15px 0;">
                ${resetUrl}
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> This link will expire in 15 minutes for security reasons.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center; margin-bottom: 0;">
                If you're having trouble with the button above, copy and paste the URL into your web browser.
                <br><br>
                This email was sent to ${email}. If you didn't request this password reset, please ignore this email.
                <br><br>
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </div>
          </div>
        `,
        text: `
Password Reset Request

Hi there,

We received a request to reset your password for ${appName}. 

To reset your password, please visit: ${resetUrl}

This link will expire in 15 minutes for security reasons.

If you didn't request this password reset, you can safely ignore this email.

Best regards,
The ${appName} Team
        `,
      });

      if (emailResponse.error) {
        this.logger.error(
          `Failed to send reset password email to ${email}:`,
          emailResponse.error,
        );
        return false;
      }

      this.logger.log(
        `Reset password email sent successfully to: ${email}, ID: ${emailResponse.data?.id}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error sending reset password email to ${email}:`,
        error.message,
      );
      throw error;
    }
  }

  async sendPasswordChangedNotification(email: string): Promise<boolean> {
    try {
      this.logger.log(`Sending password changed notification to: ${email}`);

      const appName = this.configService.get('APP_NAME') || 'Your App';
      const supportEmail =
        this.configService.get('SUPPORT_EMAIL') || 'support@fibidy.com';

      const emailResponse = await this.resend.emails.send({
        from: this.configService.get('FROM_EMAIL') || 'noreply@fibidy.com',
        to: email,
        subject: `Your ${appName} Password Has Been Changed`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0; font-size: 24px;">Password Successfully Changed</h2>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #155724; font-size: 16px;">
                  <strong>✅ Success!</strong> Your password has been successfully changed.
                </p>
              </div>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                Your ${appName} account password was changed on ${new Date().toLocaleString()}.
              </p>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>🔒 Security Tip:</strong> If you didn't make this change, please contact our support team immediately at <a href="mailto:${supportEmail}" style="color: #dc3545;">${supportEmail}</a>
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center; margin-bottom: 0;">
                This email was sent to ${email} for security purposes.
                <br><br>
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </div>
          </div>
        `,
        text: `
Password Successfully Changed

Hi there,

Your ${appName} account password was successfully changed on ${new Date().toLocaleString()}.

If you didn't make this change, please contact our support team immediately at ${supportEmail}.

Best regards,
The ${appName} Team
        `,
      });

      if (emailResponse.error) {
        this.logger.error(
          `Failed to send password changed notification to ${email}:`,
          emailResponse.error,
        );
        return false;
      }

      this.logger.log(
        `Password changed notification sent successfully to: ${email}, ID: ${emailResponse.data?.id}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error sending password changed notification to ${email}:`,
        error.message,
      );
      return false; // Don't throw error for notification emails
    }
  }
}
