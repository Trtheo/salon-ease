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

export const sendAppointmentConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  salonName: string,
  serviceName: string,
  date: string,
  time: string,
  price: number
): Promise<boolean> => {
  try {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const info = await transporter.sendMail({
      from: '"SalonEase" <niyigabatheo10@gmail.com>',
      to: customerEmail,
      subject: 'Appointment Confirmation - SalonEase',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Appointment Confirmation</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f7;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="background: #1a365d; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 500;">SalonEase</h1>
              <p style="color: #cbd5e0; margin: 8px 0 0 0; font-size: 14px;">Appointment Confirmed</p>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;">Hi ${customerName},</h2>
              <p style="color: #718096; margin: 0 0 24px 0; font-size: 14px; line-height: 1.5;">Your appointment has been confirmed! Here are the details:</p>
              
              <div style="background: #f7fafc; border-radius: 6px; padding: 20px; margin: 0 0 24px 0;">
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Salon:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${salonName}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Service:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${serviceName}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Date:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${formattedDate}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Time:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${time}</span>
                </div>
                <div>
                  <strong style="color: #2d3748; font-size: 14px;">Price:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">$${price}</span>
                </div>
              </div>
              
              <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.5;">We look forward to seeing you! If you need to reschedule or cancel, please contact us as soon as possible.</p>
            </div>
            <div style="background: #f7fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 11px; margin: 0; text-align: center;">SalonEase Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('Appointment confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Appointment confirmation email failed:', error);
    return false;
  }
};

export const sendAppointmentNotificationEmail = async (
  recipientEmail: string,
  recipientName: string,
  customerName: string,
  salonName: string,
  serviceName: string,
  date: string,
  time: string,
  isOwner: boolean = false
): Promise<boolean> => {
  try {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const subject = isOwner ? 'New Appointment Booking' : 'New Appointment Alert';
    const greeting = isOwner ? 'salon owner' : 'admin';

    const info = await transporter.sendMail({
      from: '"SalonEase" <niyigabatheo10@gmail.com>',
      to: recipientEmail,
      subject: `${subject} - SalonEase`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f7;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
            <div style="background: #1a365d; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 18px; font-weight: 500;">SalonEase</h1>
              <p style="color: #cbd5e0; margin: 8px 0 0 0; font-size: 14px;">${subject}</p>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="color: #2d3748; margin: 0 0 16px 0; font-size: 16px; font-weight: 500;">Hi ${recipientName},</h2>
              <p style="color: #718096; margin: 0 0 24px 0; font-size: 14px; line-height: 1.5;">A new appointment has been booked. Here are the details:</p>
              
              <div style="background: #f7fafc; border-radius: 6px; padding: 20px; margin: 0 0 24px 0;">
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Customer:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${customerName}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Salon:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${salonName}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Service:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${serviceName}</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #2d3748; font-size: 14px;">Date:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${formattedDate}</span>
                </div>
                <div>
                  <strong style="color: #2d3748; font-size: 14px;">Time:</strong>
                  <span style="color: #718096; font-size: 14px; margin-left: 8px;">${time}</span>
                </div>
              </div>
              
              <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.5;">Please review and manage this appointment through your dashboard.</p>
            </div>
            <div style="background: #f7fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 11px; margin: 0; text-align: center;">SalonEase Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log(`Appointment notification email sent to ${greeting}`);
    return true;
  } catch (error) {
    console.error('Appointment notification email failed:', error);
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
              
              <!-- OTP Code -->
              <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 0 0 24px 0;">
                <span style="font-size: 24px; font-weight: 600; color: #2d3748; letter-spacing: 3px; font-family: 'Courier New', monospace;">${code}</span>
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