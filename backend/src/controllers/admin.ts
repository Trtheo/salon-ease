import { Request, Response } from 'express';
import User from '../models/User';
import Salon from '../models/Salon';
import { AuthRequest } from '../middleware/auth';

// Get all users with pagination
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
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

// Get all salons with pagination
export const getAllSalons = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Salon.countDocuments();
    const salons = await Salon.find()
      .populate('owner', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: salons.length,
      total,
      page,
      pages: Math.ceil(total / limit),
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

// Update salon details
export const updateSalon = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = (req as any).params;
    const updateData = (req as any).body;

    const salon = await Salon.findByIdAndUpdate(
      salonId,
      updateData,
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

// Delete salon
export const deleteSalon = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = (req as any).params;

    const salon = await Salon.findByIdAndDelete(salonId);

    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salon deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};