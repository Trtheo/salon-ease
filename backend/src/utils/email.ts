import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'niyigabatheo10@gmail.com',
    pass: 'ekspxyfvwseqmcyz'
  }
});

export const sendEmail = async (email: string, subject: string, message: string): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: '"SalonEase" <niyigabatheo10@gmail.com>',
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SalonEase</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f7;">
          <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="background: #1a365d; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 500;">SalonEase</h1>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;">${subject}</h2>
              <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.5;">${message}</p>
            </div>
            <div style="background: #f7fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 11px; margin: 0; text-align: center;">SalonEase Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendOTPEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    console.log(` Email OTP for ${email}: ${code}`);
    
    const info = await transporter.sendMail({
      from: '"SalonEase" <niyigabatheo10@gmail.com>',
      to: email,
      subject: ' Your SalonEase Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SalonEase Verification</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f7;">
          <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: #1a365d; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 500;">SalonEase</h1>
              <p style="color: #cbd5e0; margin: 8px 0 0 0; font-size: 14px;">Account Verification</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px; text-align: center;">
              <h2 style="color: #2d3748; margin: 0 0 8px 0; font-size: 16px; font-weight: 500;">Your verification code</h2>
              <p style="color: #718096; margin: 0 0 24px 0; font-size: 14px;">Please enter this code to complete your account setup:</p>
              
              <!-- OTP Code with Copy -->
              <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 0 0 24px 0;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                  <span style="font-size: 24px; font-weight: 600; color: #2d3748; letter-spacing: 3px; font-family: 'Courier New', monospace;">${code}</span>
                  <button onclick="copyOTP()" style="background: #4a5568; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; color: white; font-size: 11px;" title="Copy to clipboard">
                    Copy
                  </button>
                </div>
              </div>
              
              <!-- Info -->
              <div style="background: #fefcbf; border: 1px solid #f6e05e; border-radius: 4px; padding: 12px; margin: 0 0 20px 0;">
                <p style="margin: 0; color: #744210; font-size: 12px;">This code expires in 10 minutes</p>
              </div>
              
              <p style="color: #a0aec0; font-size: 11px; margin: 0;">If you didn't request this, please ignore this email.</p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f7fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 11px; margin: 0; text-align: center;">SalonEase Team</p>
            </div>
          </div>
          
          <script>
            function copyOTP() {
              const otpText = '${code}';
              if (navigator.clipboard) {
                navigator.clipboard.writeText(otpText).then(() => {
                  const btn = event.target;
                  btn.innerHTML = 'Copied';
                  btn.style.background = '#38a169';
                  setTimeout(() => {
                    btn.innerHTML = 'Copy';
                    btn.style.background = '#4a5568';
                  }, 1500);
                });
              }
            }
          </script>
        </body>
        </html>
      `
    });
    
    console.log(' Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return true;
  } catch (error) {
    console.error(' Email sending failed - FULL ERROR:', error);
    return false;
  }
};