import nodemailer from 'nodemailer';

// Free SMS via Email-to-SMS gateways
const carrierGateways: { [key: string]: string } = {
  'verizon': 'vtext.com',
  'att': 'txt.att.net',
  'tmobile': 'tmomail.net',
  'sprint': 'messaging.sprintpcs.com'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmailToSMS = async (phone: string, carrier: string, message: string): Promise<boolean> => {
  try {
    const gateway = carrierGateways[carrier.toLowerCase()];
    if (!gateway) return false;

    const phoneNumber = phone.replace(/\D/g, ''); // Remove non-digits
    const smsEmail = `${phoneNumber}@${gateway}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: smsEmail,
      subject: '',
      text: message
    });

    return true;
  } catch (error) {
    console.error('Email-to-SMS Error:', error);
    return false;
  }
};

// Fallback: Console log for development
export const sendDevOTP = (phone: string, code: string): boolean => {
  console.log(`📱 OTP for ${phone}: ${code}`);
  return true;
};