import { Request, Response } from 'express';
import User from '../models/User';

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      data: user
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
    const fieldsToUpdate: any = {};

    // Only update fields that are provided
    if (req.body.name !== undefined) fieldsToUpdate.name = req.body.name;
    if (req.body.phone !== undefined) fieldsToUpdate.phone = req.body.phone;

    // Handle avatar upload
    if ((req as any).file) {
      fieldsToUpdate.avatar = `/uploads/avatars/${(req as any).file.filename}`;
    } else if (req.body.avatar !== undefined) {
      fieldsToUpdate.avatar = req.body.avatar;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};