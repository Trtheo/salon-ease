import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review';
import Salon from '../models/Salon';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

// Submit review
export const submitReview = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId, rating, comment, bookingId, images } = req.body;
    const customerId = req.user!._id;

    // Check if user already reviewed this salon
    const existingReview = await Review.findOne({
      customer: customerId,
      salon: salonId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this salon'
      });
    }

    // Verify booking if provided
    if (bookingId) {
      const booking = await Booking.findOne({
        _id: bookingId,
        customer: customerId,
        salon: salonId,
        status: 'completed'
      });

      if (!booking) {
        return res.status(400).json({
          success: false,
          error: 'Invalid booking or booking not completed'
        });
      }
    }

    const review = await Review.create({
      customer: customerId,
      salon: salonId,
      booking: bookingId,
      rating,
      comment,
      images,
      isVerified: !!bookingId
    });

    // Update salon rating
    await updateSalonRating(salonId);

    const populatedReview = await Review.findById(review._id)
      .populate('customer', 'name avatar')
      .populate('salon', 'name');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get salon reviews
export const getSalonReviews = async (req: Request, res: Response) => {
  try {
    const { salonId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const rating = req.query.rating as string;

    const filter: any = { salon: salonId };
    if (rating) {
      filter.rating = parseInt(rating);
    }

    const reviews = await Review.find(filter)
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user reviews
export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const reviews = await Review.find({ customer: userId })
      .populate('salon', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Respond to review (Salon Owner)
export const respondToReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    const userId = req.user!._id;

    const review = await Review.findById(reviewId).populate('salon');
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user owns the salon
    const salon = await Salon.findOne({ _id: review.salon, owner: userId });
    if (!salon) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to respond to this review'
      });
    }

    review.response = {
      text: response,
      respondedAt: new Date()
    };
    await review.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get salon rating stats
export const getSalonRatingStats = async (req: Request, res: Response) => {
  try {
    const { salonId } = req.params;

    const stats = await Review.aggregate([
      { $match: { salon: new mongoose.Types.ObjectId(salonId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const totalReviews = await Review.countDocuments({ salon: salonId });
    const avgRating = await Review.aggregate([
      { $match: { salon: new mongoose.Types.ObjectId(salonId) } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalReviews,
        averageRating: avgRating[0]?.avg || 0,
        ratingBreakdown: stats
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Helper function to update salon rating
const updateSalonRating = async (salonId: string) => {
  const result = await Review.aggregate([
    { $match: { salon: new mongoose.Types.ObjectId(salonId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await Salon.findByIdAndUpdate(salonId, {
      rating: Math.round(result[0].averageRating * 10) / 10,
      reviewCount: result[0].totalReviews
    });
  }
};