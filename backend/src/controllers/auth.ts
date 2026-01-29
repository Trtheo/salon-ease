import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role
    });

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
          role: user.role
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
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
          role: user.role
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