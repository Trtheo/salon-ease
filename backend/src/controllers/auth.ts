import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import OTP from '../models/OTP';
import { sendOTPEmail } from '../utils/email';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
};

const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check email uniqueness
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Check phone uniqueness if phone is provided
    if (phone && phone.trim()) {
      const existingPhoneUser = await User.findOne({ phone });
      if (existingPhoneUser) {
        return res.status(400).json({
          success: false,
          error: 'Phone already exists'
        });
      }
    }

    // Generate and send OTP to both email and SMS
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Generated OTP:', code);
    console.log('Email:', email);
    
    let emailSent = false;

    // Only use email
    console.log('Using email only...');
    
    try {
      // Send OTP via Email  
      console.log('Creating Email OTP...');
      const emailOTP = await OTP.create({ email, code, expiresAt });
      console.log('Email OTP created successfully:', emailOTP._id);
      console.log('Attempting to send email to:', email);
      emailSent = await sendOTPEmail(email, code);
      console.log('Email send result:', emailSent);
    } catch (error) {
      console.error('Email OTP creation/sending failed:', error);
    }
    
    // If email fails, return error
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send OTP via email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      tempData: { name, email, password, phone, role },
      sentVia: {
        email: emailSent
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const verifyRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role, code } = req.body;

    console.log('Verification attempt:', { email, code });

    // Verify OTP - check both phone and email
    const otp = await OTP.findOne({
      email,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    console.log('Found OTP:', otp ? { id: otp._id, code: otp.code, email: otp.email, isUsed: otp.isUsed, expiresAt: otp.expiresAt } : 'No OTP found');

    if (!otp) {
      // For development, allow a test code
      if (process.env.NODE_ENV === 'development' && code === '1234') {
        console.log('Using development test code');
      } else {
        // Get all OTPs for this email for debugging
        const allOTPs = await OTP.find({ email }).sort({ createdAt: -1 });
        console.log('All OTPs for email:', allOTPs.map(o => ({ code: o.code, isUsed: o.isUsed, expiresAt: o.expiresAt, createdAt: o.createdAt })));
        
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP'
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
      isVerified: true
    });

    console.log('User created successfully:', user._id);

    // Mark OTP as used if found
    if (otp) {
      otp.isUsed = true;
      await otp.save();
      console.log('OTP marked as used');
    }

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error: any) {
    console.error('Verify registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, phone, method } = req.body;
    
    console.log('Forgot password request:', { email, phone, method });
    
    if (!method || !['email', 'phone'].includes(method)) {
      return res.status(400).json({
        success: false,
        error: 'Method is required (email or phone)'
      });
    }

    const identifier = method === 'email' ? email : phone;
    
    if (!identifier) {
      return res.status(400).json({
        success: false,
        error: `${method} is required`
      });
    }

    // Find user
    const user = await User.findOne({ email: identifier });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate and send OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log('Generated OTP for forgot password:', code);

    if (method === 'phone') {
      return res.status(400).json({
        success: false,
        error: 'SMS OTP is not available. Please use email method.'
      });
    } else {
      await OTP.create({ email: identifier, code, expiresAt });
      console.log(`Development OTP for ${identifier}: ${code}`);
      
      // For development, always return success even if email fails
      const sent = await sendOTPEmail(identifier, code);
      console.log('Email sent result:', sent);
      
      // In development, continue even if email fails
      if (!sent && process.env.NODE_ENV !== 'development') {
        return res.status(500).json({
          success: false,
          error: 'Failed to send OTP email'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `OTP sent via ${method} for password reset`
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const verifyPasswordResetOTP = async (req: Request, res: Response) => {
  try {
    const { email, phone, code, method } = req.body;
    const identifier = method === 'email' ? email : phone;

    console.log('Verifying password reset OTP:', { identifier, code, method });

    // Verify OTP
    const otp = await OTP.findOne({
      email: identifier,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    console.log('Found OTP for verification:', otp ? { id: otp._id, code: otp.code, isUsed: otp.isUsed } : 'No OTP found');

    if (!otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error: any) {
    console.error('Verify password reset OTP error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, phone, code, newPassword, method } = req.body;
    const identifier = method === 'email' ? email : phone;

    console.log('Reset password attempt:', { identifier, code, method });

    // Verify OTP
    const otp = await OTP.findOne({
      email: identifier,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    console.log('Found OTP:', otp ? { id: otp._id, code: otp.code, isUsed: otp.isUsed } : 'No OTP found');

    if (!otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    // Find and update user password
    const user = await User.findOne({ email: identifier });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.password = newPassword;
    await user.save();

    // Mark OTP as used
    otp.isUsed = true;
    await otp.save();

    console.log('Password reset successful for:', identifier);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your account first'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    // Since we're using stateless JWT, we just send a success response
    // Client should remove the token from storage
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
export const socialLogin = async (req: Request, res: Response) => {
  try {
    const { provider, uid, email, name, photoURL } = req.body;

    if (!provider || !uid) {
      return res.status(400).json({
        success: false,
        error: 'Provider and UID are required'
      });
    }

    // Check if user already exists with this social provider
    let user = await User.findOne({ 
      $or: [
        { [`socialAuth.${provider}.uid`]: uid },
        { email: email }
      ]
    });

    if (user) {
      // Update social auth info if not already set
      if (!user.socialAuth) {
        user.socialAuth = {};
      }
      if (!user.socialAuth[provider]) {
        user.socialAuth[provider] = { uid, email, name, photoURL };
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || 'Social User',
        email: email || `${provider}_${uid}@social.local`,
        password: Math.random().toString(36).slice(-8), // Random password
        role: 'customer',
        isVerified: true,
        socialAuth: {
          [provider]: { uid, email, name, photoURL }
        }
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error: any) {
    console.error('Social login error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getTestOTP = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        success: false,
        error: 'This endpoint is only available in development mode'
      });
    }

    const { phone, email } = req.query;
    const identifier = phone || email;

    // Get all OTPs for debugging
    const allOTPs = await OTP.find({
      $or: [{ phone: identifier }, { email: identifier }]
    }).sort({ createdAt: -1 });

    const validOTP = await OTP.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      validOTP: validOTP ? {
        code: validOTP.code,
        expiresAt: validOTP.expiresAt,
        phone: validOTP.phone,
        email: validOTP.email
      } : null,
      allOTPs: allOTPs.map(otp => ({
        code: otp.code,
        phone: otp.phone,
        email: otp.email,
        isUsed: otp.isUsed,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt
      }))
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getNotificationSettings = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const settings = user.notificationSettings || {
      emailBookings: true,
      emailPromotions: false,
      smsReminders: true,
      pushNotifications: true
    };

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateNotificationSettings = async (req: any, res: Response) => {
  try {
    const { emailBookings, emailPromotions, smsReminders, pushNotifications } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.notificationSettings = {
      emailBookings: emailBookings !== undefined ? emailBookings : true,
      emailPromotions: emailPromotions !== undefined ? emailPromotions : false,
      smsReminders: smsReminders !== undefined ? smsReminders : true,
      pushNotifications: pushNotifications !== undefined ? pushNotifications : true
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: user.notificationSettings
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const uploadAvatar = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Store the file path as avatar
    user.avatar = `/uploads/avatars/${file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        avatar: user.avatar,
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};