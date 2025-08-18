const nodemailer = require('nodemailer');
require('dotenv').config();



class EmailService {
  async sendEmail(to, subject, text) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: text
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, text) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: text
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }
  async sendPasswordResetEmail(to, resetToken, userName) {
    const resetUrl = `${process.env.REACT_APP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Password Reset Request - CRUD App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>We received a request to reset your password for your CRUD App account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link in your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2025 CRUD App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendNewPasswordEmail(to, newPassword, userName) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Password Reset - New Password - CRUD App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .password { 
              background-color: #e9ecef; 
              padding: 15px; 
              font-family: monospace; 
              font-size: 18px; 
              text-align: center; 
              border-radius: 5px; 
              margin: 20px 0;
              letter-spacing: 2px;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { color: #dc3545; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Your password has been successfully reset. Here is your new password:</p>
              <div class="password">${newPassword}</div>
              <p class="warning">⚠️ Important Security Notice:</p>
              <ul>
                <li>Please login immediately and change this password</li>
                <li>Do not share this password with anyone</li>
                <li>Delete this email after changing your password</li>
              </ul>
              <p>Login at: <a href="http://localhost:${process.env.PORT}">http://localhost:${process.env.PORT}</a></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2025 CRUD App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('New password email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendOTPEmail(to, otp, userName) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: 'Password Reset OTP - CRUD App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .otp { 
              background-color: #007bff; 
              color: white; 
              padding: 20px; 
              font-family: monospace; 
              font-size: 32px; 
              text-align: center; 
              border-radius: 10px; 
              margin: 20px 0;
              letter-spacing: 8px;
              font-weight: bold;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { color: #dc3545; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset OTP</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>You have requested to reset your password. Please use the following OTP to verify your identity:</p>
              <div class="otp">${otp}</div>
              <p><strong>⏰ This OTP will expire in 10 minutes.</strong></p>
              <p class="warning">🔒 Security Tips:</p>
              <ul>
                <li>Do not share this OTP with anyone</li>
                <li>Our team will never ask for your OTP</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
              <p>After entering this OTP, you will receive a password reset link in your email.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2025 CRUD App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
