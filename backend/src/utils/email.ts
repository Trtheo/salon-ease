import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTPEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SalonEase - Verification Code',
      html: `
        <h2>Your Verification Code</h2>
        <p>Your SalonEase verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};