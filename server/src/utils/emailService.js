const nodemailer = require('nodemailer');

/**
 * Service để gửi email
 * Trong môi trường phát triển, chúng ta sử dụng Ethereal để test email
 * Trong môi trường production, nên sử dụng SendGrid, Mailgun, etc.
 */

// Tạo transporter
const getTransporter = async () => {
  // Nếu đang ở môi trường development, sử dụng Ethereal
  if (process.env.NODE_ENV !== 'production') {
    // Tạo test account
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  // Production - Sử dụng SMTP server hoặc services như SendGrid, Mailgun
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Gửi email
 * @param {Object} options
 * @param {string} options.to - Địa chỉ email người nhận
 * @param {string} options.subject - Tiêu đề email
 * @param {string} options.text - Nội dung text (plain)
 * @param {string} options.html - Nội dung HTML
 */
exports.sendMail = async (options) => {
  try {
    const { to, subject, text, html } = options;

    if (!to) {
      throw new Error('Recipient email address is required');
    }

    if (!subject) {
      throw new Error('Email subject is required');
    }

    if (!text && !html) {
      throw new Error('Email content (text or html) is required');
    }

    const transporter = await getTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Tarot Spirit" <noreply@tarotspirit.com>',
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    // In môi trường development, log URL để kiểm tra email trên Ethereal
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}; 