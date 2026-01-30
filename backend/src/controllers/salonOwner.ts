import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Salon from '../models/Salon';
import Booking from '../models/Booking';

// Get salon owner's salons
export const getMySalons = async (req: AuthRequest, res: Response) => {
  try {
    const salons = await Salon.find({ owner: req.user.id }).populate('services');
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

// Get salon bookings
export const getSalonBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    
    // Verify salon ownership
    const salon = await Salon.findOne({ _id: salonId, owner: req.user.id });
    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found or not authorized'
      });
    }

    const bookings = await Booking.find({ salon: salonId })
      .populate('user', 'name email phone')
      .populate('service', 'name price duration')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId).populate('salon');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify salon ownership
    if (booking.salon.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get salon dashboard stats
export const getSalonStats = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    
    // Verify salon ownership
    const salon = await Salon.findOne({ _id: salonId, owner: req.user.id });
    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found or not authorized'
      });
    }

    const totalBookings = await Booking.countDocuments({ salon: salonId });
    const pendingBookings = await Booking.countDocuments({ salon: salonId, status: 'pending' });
    const completedBookings = await Booking.countDocuments({ salon: salonId, status: 'completed' });
    
    // Calculate total revenue from completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { salon: salon._id, status: 'completed' } },
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceData' } },
      { $unwind: '$serviceData' },
      { $group: { _id: null, totalRevenue: { $sum: '$serviceData.price' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
        salonStatus: salon.status
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};