import { Request, Response } from 'express';
import User from '../models/User';
import Salon from '../models/Salon';
import Booking from '../models/Booking';
import Service from '../models/Service';

export const getSystemAnalytics = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalSalons,
      totalBookings,
      totalServices,
      verifiedSalons,
      pendingBookings,
      completedBookings,
      monthlyBookings,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Salon.countDocuments(),
      Booking.countDocuments(),
      Service.countDocuments(),
      Salon.countDocuments({ isVerified: true }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSalons,
          totalBookings,
          totalServices,
          verifiedSalons,
          pendingBookings,
          completedBookings,
          monthlyBookings,
          recentUsers
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('name email role isVerified createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        userGrowth
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getBookingAnalytics = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('salon', 'name')
      .populate('service', 'name price')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const bookingTrends = await Booking.aggregate([
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
    ]);

    const topSalons = await Booking.aggregate([
      { $group: { _id: '$salon', bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'salons',
          localField: '_id',
          foreignField: '_id',
          as: 'salon'
        }
      },
      { $unwind: '$salon' },
      {
        $project: {
          salonName: '$salon.name',
          bookingCount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentBookings: bookings,
        bookingTrends,
        topSalons
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getSalonAnalytics = async (req: Request, res: Response) => {
  try {
    const salons = await Salon.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const salonStats = await Salon.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'salon',
          as: 'bookings'
        }
      },
      {
        $project: {
          name: 1,
          isVerified: 1,
          createdAt: 1,
          bookingCount: { $size: '$bookings' },
          revenue: { $sum: '$bookings.totalAmount' }
        }
      },
      { $sort: { bookingCount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salons,
        salonStats
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};