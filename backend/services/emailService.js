const nodemailer = require('nodemailer');

// Create transporter once at module load
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send OTP verification email.
 * The OTP is only present in the email body — never in any API response.
 */
const sendOTPEmail = async (toEmail, otp, name) => {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
  const displayName = name || toEmail;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"KindSwap" <noreply@kindswap.in>',
    to: toEmail,
    subject: 'Verify your KindSwap account',
    text: `
Hi ${displayName},

Welcome to KindSwap! 

Your email verification code is: ${otp}

This code expires in ${expiryMinutes} minutes.
Do not share this code with anyone.

If you did not register for KindSwap, you can safely ignore this email.

— The KindSwap Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#FCE181,#D4C4FB);padding:40px 40px 30px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">💬🔄</div>
      <h1 style="margin:0;font-size:26px;color:#332F2A;font-weight:700;">Kind<span style="color:#B5975A;">Swap</span></h1>
      <p style="margin:8px 0 0;color:#6B6358;font-size:14px;">Connect & Share</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 12px;font-size:20px;color:#332F2A;">Verify your email address</h2>
      <p style="margin:0 0 24px;color:#6B6358;line-height:1.6;">
        Hi <strong>${displayName}</strong>, welcome to KindSwap!<br>
        Use the code below to verify your email address.
      </p>

      <!-- OTP Box -->
      <div style="background:#F5F5F5;border-radius:16px;padding:30px;text-align:center;margin:0 0 24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#6B6358;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Your verification code</p>
        <div style="font-size:42px;font-weight:700;letter-spacing:16px;color:#332F2A;font-family:'Courier New',monospace;">${otp}</div>
        <p style="margin:12px 0 0;font-size:13px;color:#6B6358;">Expires in <strong>${expiryMinutes} minutes</strong></p>
      </div>

      <p style="margin:0 0 24px;color:#6B6358;font-size:14px;line-height:1.6;">
        For your security, never share this code with anyone. KindSwap will never ask for your verification code.
      </p>

      <div style="border-top:1px solid #DEDAD1;padding-top:24px;color:#6B6358;font-size:13px;line-height:1.6;">
        If you did not create a KindSwap account, you can safely ignore this email.
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#F5F5F5;padding:20px 40px;text-align:center;">
      <p style="margin:0;color:#6B6358;font-size:12px;">© 2025 KindSwap. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Verify the transporter connection (used at startup to catch misconfig early)
 */
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email service connected successfully.');
  } catch (err) {
    console.warn('Email service not connected:', err.message);
    console.warn('Set EMAIL_HOST/USER/PASSWORD in .env to enable email sending.');
  }
};

module.exports = { sendOTPEmail, verifyConnection };
