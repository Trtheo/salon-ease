import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Salon from '../models/Salon';
import Booking from '../models/Booking';
import Service from '../models/Service';
import mongoose from 'mongoose';

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

export const getSalonAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    
    const salon = await Salon.findOne({ _id: salonId, owner: req.user.id });
    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found or not authorized'
      });
    }

    const [bookingTrends, servicePerformance, revenueAnalytics, customerAnalytics] = await Promise.all([
      // Monthly booking trends
      Booking.aggregate([
        { $match: { salon: new mongoose.Types.ObjectId(salonId) } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),
      
      // Service performance
      Booking.aggregate([
        { $match: { salon: new mongoose.Types.ObjectId(salonId) } },
        { $group: { _id: '$service', bookingCount: { $sum: 1 } } },
        { $sort: { bookingCount: -1 } },
        {
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        { $unwind: '$service' },
        {
          $project: {
            serviceName: '$service.name',
            bookingCount: 1,
            revenue: { $multiply: ['$bookingCount', '$service.price'] }
          }
        }
      ]),
      
      // Revenue analytics
      Booking.aggregate([
        { $match: { salon: new mongoose.Types.ObjectId(salonId), status: 'completed' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            avgBookingValue: { $avg: '$totalAmount' },
            totalBookings: { $sum: 1 }
          }
        }
      ]),
      
      // Customer analytics
      Booking.aggregate([
        { $match: { salon: new mongoose.Types.ObjectId(salonId) } },
        { $group: { _id: '$customer', bookingCount: { $sum: 1 } } },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            repeatCustomers: {
              $sum: { $cond: [{ $gt: ['$bookingCount', 1] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        bookingTrends,
        servicePerformance,
        revenueAnalytics: revenueAnalytics[0] || { totalRevenue: 0, avgBookingValue: 0, totalBookings: 0 },
        customerAnalytics: customerAnalytics[0] || { totalCustomers: 0, repeatCustomers: 0 }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getOwnerOverview = async (req: AuthRequest, res: Response) => {
  try {
    const salons = await Salon.find({ owner: req.user.id });
    const salonIds = salons.map(salon => salon._id);

    const [totalBookings, totalRevenue, recentBookings] = await Promise.all([
      Booking.countDocuments({ salon: { $in: salonIds } }),
      Booking.aggregate([
        { $match: { salon: { $in: salonIds }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Booking.find({ salon: { $in: salonIds } })
        .populate('salon', 'name')
        .populate('service', 'name price')
        .populate('customer', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSalons: salons.length,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentBookings,
        salons: salons.map(salon => ({
          id: salon._id,
          name: salon.name,
          isVerified: salon.isVerified
        }))
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};