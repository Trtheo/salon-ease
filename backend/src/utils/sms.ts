import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (phone: string, message: string): Promise<boolean> => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('SMS Error:', error);
    return false;
  }
};

export const sendOTPSMS = async (phone: string, code: string): Promise<boolean> => {
  try {
    console.log(`📱 SMS OTP for ${phone}: ${code}`);
    
    const message = `Your SalonEase verification code is: ${code}. Valid for 10 minutes.`;
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    
    console.log('✅ SMS sent successfully');
    return true;
  } catch (error) {
    console.error('❌ SMS Error:', error);
    return false;
  }
};