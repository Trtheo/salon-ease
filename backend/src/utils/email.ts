import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'niyigabatheo10@gmail.com',
    pass: 'ekspxyfvwseqmcyz'
  }
});

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
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #085788 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
                 SalonEase
              </h1>
              <p style="color: #e8eaff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Your Beauty, Our Priority
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 50px 30px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 36px;"></span>
                </div>
                <h2 style="color: #2d3748; margin: 0; font-size: 24px; font-weight: 600;">
                  Verification Code
                </h2>
                <p style="color: #718096; margin: 15px 0 0 0; font-size: 16px; line-height: 1.5;">
                  Please use the following code to complete your verification
                </p>
              </div>
              
              <!-- OTP Code -->
              <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <div style="background: #667eea; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                  ${code}
                </div>
              </div>
              
              <!-- Instructions -->
              <div style="background: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.6;">
                  <strong> Instructions:</strong><br>
                  • This code will expire in <strong>10 minutes</strong><br>
                  • Enter this code in the SalonEase app to continue<br>
                  • Do not share this code with anyone
                </p>
              </div>
              
              <!-- Security Notice -->
              <div style="background: #fffaf0; border: 1px solid #fbd38d; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #744210; font-size: 14px; line-height: 1.6;">
                  <strong> Security Notice:</strong><br>
                  If you didn't request this verification code, please ignore this email. Your account remains secure.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #2d3748; padding: 30px; text-align: center;">
              <p style="color: #a0aec0; margin: 0 0 10px 0; font-size: 14px;">
                Thank you for choosing SalonEase!
              </p>
              <p style="color: #718096; margin: 0; font-size: 12px;">
                This is an automated message, please do not reply to this email.
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #4a5568;">
                <p style="color: #718096; margin: 0; font-size: 12px;">
                  © 2026 SalonEase. All rights reserved.
                </p>
              </div>
            </div>
          </div>
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