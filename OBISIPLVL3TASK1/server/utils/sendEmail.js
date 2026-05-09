/**
 * Email Utility — Nodemailer
 * Sends emails using Gmail SMTP for verification, password reset, and stock alerts.
 */
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"PizzaHub 🍕" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    // Don't throw — email failure shouldn't crash the app
    return null;
  }
};

/**
 * Send verification OTP email
 */
const sendVerificationEmail = async (email, otp) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 30px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 28px;">🍕 PizzaHub</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Verify Your Email</p>
      </div>
      <div style="padding: 30px; color: #e2e8f0;">
        <p style="font-size: 16px;">Your verification code is:</p>
        <div style="background: rgba(245, 158, 11, 0.15); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f59e0b;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    </div>
  `;
  return sendEmail(email, '🍕 PizzaHub — Verify Your Email', html);
};

/**
 * Send password reset email
 */
const sendResetPasswordEmail = async (email, resetUrl) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 30px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 28px;">🍕 PizzaHub</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Password Reset</p>
      </div>
      <div style="padding: 30px; color: #e2e8f0;">
        <p style="font-size: 16px;">Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.</p>
      </div>
    </div>
  `;
  return sendEmail(email, '🍕 PizzaHub — Reset Your Password', html);
};

/**
 * Send low stock alert email to admin
 */
const sendLowStockAlert = async (adminEmail, lowStockItems) => {
  const itemRows = lowStockItems.map(item => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
      <td style="padding: 10px; color: #e2e8f0;">${item.name}</td>
      <td style="padding: 10px; color: #e2e8f0; text-transform: capitalize;">${item.category}</td>
      <td style="padding: 10px; color: #ef4444; font-weight: bold;">${item.quantity}</td>
      <td style="padding: 10px; color: #94a3b8;">${item.threshold}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 28px;">⚠️ Low Stock Alert</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">PizzaHub Inventory Warning</p>
      </div>
      <div style="padding: 30px;">
        <p style="color: #e2e8f0; font-size: 16px;">The following items are running low:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="border-bottom: 2px solid #f59e0b;">
              <th style="padding: 10px; text-align: left; color: #f59e0b;">Item</th>
              <th style="padding: 10px; text-align: left; color: #f59e0b;">Category</th>
              <th style="padding: 10px; text-align: left; color: #f59e0b;">Stock</th>
              <th style="padding: 10px; text-align: left; color: #f59e0b;">Threshold</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">Please restock these items as soon as possible.</p>
      </div>
    </div>
  `;
  return sendEmail(adminEmail, '⚠️ PizzaHub — Low Stock Alert', html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendLowStockAlert
};
