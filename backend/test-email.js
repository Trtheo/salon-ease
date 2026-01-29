const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function testEmail() {
  try {
    console.log('Testing email with:', {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'undefined'
    });
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'nitheophile10@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email'
    });
    
    console.log('✅ Email sent successfully:', result.messageId);
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
}

testEmail();