import { Request, Response } from 'express';
import OTP from '../models/OTP';
import { sendOTPSMS } from '../utils/sms';
import { sendOTPEmail } from '../utils/email';

const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone, email, method } = req.body;

    if (!method) {
      return res.status(400).json({
        success: false,
        error: 'Method is required (phone or email)'
      });
    }

    if (method === 'phone' && !phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required for SMS OTP'
      });
    }

    if (method === 'email' && !email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required for email OTP'
      });
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (method === 'phone') {
      await OTP.create({ phone, code, expiresAt });
      
      const sent = await sendOTPSMS(phone, code);
      if (!sent) {
        return res.status(500).json({
          success: false,
          error: 'Failed to send OTP SMS'
        });
      }
    }

    if (method === 'email') {
      await OTP.create({ email, code, expiresAt });
      
      const sent = await sendOTPEmail(email, code);
      if (!sent) {
        return res.status(500).json({
          success: false,
          error: 'Failed to send OTP email'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `OTP sent successfully via ${method}`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, email, code } = req.body;
    const identifier = phone || email;

    const otp = await OTP.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    otp.isUsed = true;
    await otp.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};