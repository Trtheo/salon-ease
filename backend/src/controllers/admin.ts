import { Request, Response } from 'express';
import User from '../models/User';
import Salon from '../models/Salon';
import { AuthRequest } from '../middleware/auth';

// Get all users
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all salon owners
export const getSalonOwners = async (req: AuthRequest, res: Response) => {
  try {
    const salonOwners = await User.find({ role: 'salon_owner' }).select('-password');
    res.status(200).json({
      success: true,
      count: salonOwners.length,
      data: salonOwners
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update user role
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = (req as any).params;
    const { role } = (req as any).body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

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

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = (req as any).params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all salons
export const getAllSalons = async (req: AuthRequest, res: Response) => {
  try {
    const salons = await Salon.find().populate('owner', 'name email');
    res.status(200).json({
      success: true,
      count: salons.length,
      data: salons
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Approve/reject salon
export const updateSalonStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = (req as any).params;
    const { status } = (req as any).body;

    const salon = await Salon.findByIdAndUpdate(
      salonId,
      { status },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: salon
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};