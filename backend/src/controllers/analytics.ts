import { Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import Payment from '../models/Payment';
import Review from '../models/Review';
import Salon from '../models/Salon';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Customer Analytics
export const getCustomerAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    const { period = '30' } = req.query; // days
    const userId = req.user!._id;

    // Verify salon ownership
    const salon = await Salon.findOne({ _id: salonId, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period as string));

    // Customer behavior analysis
    const customerStats = await Booking.aggregate([
      {
        $match: {
          salon: new mongoose.Types.ObjectId(salonId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$customer',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastBooking: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          customerName: '$customer.name',
          customerEmail: '$customer.email',
          totalBookings: 1,
          totalSpent: 1,
          lastBooking: 1,
          avgBookingValue: { $divide: ['$totalSpent', '$totalBookings'] }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 20 }
    ]);

    // New vs returning customers
    const customerTypes = await Booking.aggregate([
      {
        $match: {
          salon: new mongoose.Types.ObjectId(salonId),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$customer',
          bookingCount: { $sum: 1 },
          firstBooking: { $min: '$createdAt' }
        }
      },
      {
        $group: {
          _id: null,
          newCustomers: {
            $sum: { $cond: [{ $eq: ['$bookingCount', 1] }, 1, 0] }
          },
          returningCustomers: {
            $sum: { $cond: [{ $gt: ['$bookingCount', 1] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        topCustomers: customerStats,
        customerTypes: customerTypes[0] || { newCustomers: 0, returningCustomers: 0 }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Revenue Reports
export const getRevenueReports = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    const { period = 'month' } = req.query; // day, week, month, year
    const userId = req.user!._id;

    // Verify salon ownership
    const salon = await Salon.findOne({ _id: salonId, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    let groupBy: any;
    let startDate = new Date();

    switch (period) {
      case 'day':
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'week':
        groupBy = { $dateToString: { format: '%Y-W%U', date: '$createdAt' } };
        startDate.setDate(startDate.getDate() - 84); // 12 weeks
        break;
      case 'month':
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        startDate.setMonth(startDate.getMonth() - 12);
        break;
      case 'year':
        groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
        startDate.setFullYear(startDate.getFullYear() - 3);
        break;
    }

    // Revenue over time
    const revenueData = await Payment.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'booking'
        }
      },
      { $unwind: '$booking' },
      {
        $match: {
          'booking.salon': new mongoose.Types.ObjectId(salonId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Service performance
    const servicePerformance = await Booking.aggregate([
      {
        $match: {
          salon: new mongoose.Types.ObjectId(salonId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $group: {
          _id: '$service._id',
          serviceName: { $first: '$service.name' },
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgPrice: { $avg: '$totalAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        revenueOverTime: revenueData,
        servicePerformance
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Booking Trends
export const getBookingTrends = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    const userId = req.user!._id;

    // Verify salon ownership
    const salon = await Salon.findOne({ _id: salonId, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Peak hours analysis
    const peakHours = await Booking.aggregate([
      {
        $match: {
          salon: new mongoose.Types.ObjectId(salonId),
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$time',
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 }
    ]);

    // Day of week analysis
    const dayOfWeekTrends = await Booking.aggregate([
      {
        $match: {
          salon: new mongoose.Types.ObjectId(salonId),
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          bookingCount: { $sum: 1 },
          avgRevenue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Monthly trends (last 12 months)
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const monthlyTrends = await Booking.aggregate([
      {
        $match: {
          salon: new mongoose.Types.ObjectId(salonId),
          createdAt: { $gte: yearAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Cancellation analysis
    const cancellationRate = await Booking.aggregate([
      {
        $match: {
          salon: new mongoose.Types.ObjectId(salonId),
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          totalBookings: 1,
          cancelledBookings: 1,
          cancellationRate: {
            $multiply: [
              { $divide: ['$cancelledBookings', '$totalBookings'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        peakHours,
        dayOfWeekTrends,
        monthlyTrends,
        cancellationAnalysis: cancellationRate[0] || {
          totalBookings: 0,
          cancelledBookings: 0,
          cancellationRate: 0
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