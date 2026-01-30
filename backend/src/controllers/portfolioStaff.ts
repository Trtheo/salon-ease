import { Response } from 'express';
import Portfolio from '../models/Portfolio';
import Staff from '../models/Staff';
import Salon from '../models/Salon';
import { AuthRequest } from '../middleware/auth';

// Portfolio Management

// Create portfolio item
export const createPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId, title, description, category, images, services } = req.body;
    const userId = req.user!._id;

    // Verify salon ownership
    const salon = await Salon.findOne({ _id: salonId, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to manage this salon'
      });
    }

    const portfolio = await Portfolio.create({
      salon: salonId,
      title,
      description,
      category,
      images,
      services
    });

    const populated = await Portfolio.findById(portfolio._id)
      .populate('services', 'name');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get salon portfolio
export const getSalonPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    const { category } = req.query;

    const filter: any = { salon: salonId, isPublic: true };
    if (category) {
      filter.category = category;
    }

    const portfolio = await Portfolio.find(filter)
      .populate('services', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update portfolio item
export const updatePortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user!._id;
    const updates = req.body;

    const portfolio = await Portfolio.findById(portfolioId).populate('salon');
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio item not found'
      });
    }

    // Verify salon ownership
    const salon = await Salon.findOne({ _id: portfolio.salon, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const updated = await Portfolio.findByIdAndUpdate(portfolioId, updates, { new: true })
      .populate('services', 'name');

    res.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Staff Management

// Add staff member
export const addStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId, name, email, phone, position, specialties, workingHours, services } = req.body;
    const userId = req.user!._id;

    // Verify salon ownership
    const salon = await Salon.findOne({ _id: salonId, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to manage this salon'
      });
    }

    const staff = await Staff.create({
      salon: salonId,
      name,
      email,
      phone,
      position,
      specialties,
      workingHours,
      services
    });

    const populated = await Staff.findById(staff._id)
      .populate('services', 'name');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get salon staff
export const getSalonStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;

    const staff = await Staff.find({ salon: salonId, isActive: true })
      .populate('services', 'name')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: staff
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update staff member
export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { staffId } = req.params;
    const userId = req.user!._id;
    const updates = req.body;

    const staff = await Staff.findById(staffId).populate('salon');
    if (!staff) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      });
    }

    // Verify salon ownership
    const salon = await Salon.findOne({ _id: staff.salon, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const updated = await Staff.findByIdAndUpdate(staffId, updates, { new: true })
      .populate('services', 'name');

    res.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get staff availability
export const getStaffAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { staffId } = req.params;
    const { date } = req.query;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      });
    }

    const dayOfWeek = new Date(date as string).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHours = staff.workingHours[dayOfWeek];

    res.json({
      success: true,
      data: {
        staffId,
        date,
        isWorking: workingHours?.isWorking || false,
        hours: workingHours?.isWorking ? {
          start: workingHours.start,
          end: workingHours.end
        } : null
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};