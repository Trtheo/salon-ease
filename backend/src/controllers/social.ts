import { Response } from 'express';
import Favorite from '../models/Favorite';
import Referral from '../models/Referral';
import Salon from '../models/Salon';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Add to favorites
export const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.body;
    const userId = req.user!._id;

    const existingFavorite = await Favorite.findOne({
      user: userId,
      salon: salonId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        error: 'Salon already in favorites'
      });
    }

    const favorite = await Favorite.create({
      user: userId,
      salon: salonId
    });

    const populatedFavorite = await Favorite.findById(favorite._id)
      .populate('salon', 'name images rating');

    res.status(201).json({
      success: true,
      data: populatedFavorite
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    const userId = req.user!._id;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      salon: salonId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user favorites
export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const favorites = await Favorite.find({ user: userId })
      .populate('salon', 'name images rating address reviewCount')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Favorite.countDocuments({ user: userId });

    res.json({
      success: true,
      data: favorites,
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

// Generate referral code
export const generateReferralCode = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const user = req.user!;

    // Check if user already has an active referral code
    const existingReferral = await Referral.findOne({
      referrer: userId,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (existingReferral) {
      return res.json({
        success: true,
        data: existingReferral
      });
    }

    // Generate unique code
    const code = `${user.name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;

    const referral = await Referral.create({
      referrer: userId,
      code
    });

    res.status(201).json({
      success: true,
      data: referral
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Use referral code
export const useReferralCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user!._id;

    const referral = await Referral.findOne({
      code,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!referral) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired referral code'
      });
    }

    if (referral.referrer.equals(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot use your own referral code'
      });
    }

    // Check if user already used a referral code
    const existingUse = await Referral.findOne({
      referred: userId,
      status: 'completed'
    });

    if (existingUse) {
      return res.status(400).json({
        success: false,
        error: 'You have already used a referral code'
      });
    }

    // Update referral
    referral.referred = userId;
    referral.status = 'completed';
    await referral.save();

    res.json({
      success: true,
      data: referral,
      message: `You've earned a ${referral.reward.amount}% discount!`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user referrals
export const getUserReferrals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const referrals = await Referral.find({ referrer: userId })
      .populate('referred', 'name email')
      .sort({ createdAt: -1 });

    const stats = {
      total: referrals.length,
      completed: referrals.filter(r => r.status === 'completed').length,
      pending: referrals.filter(r => r.status === 'pending').length,
      totalRewards: referrals
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.reward.amount, 0)
    };

    res.json({
      success: true,
      data: {
        referrals,
        stats
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Share salon
export const shareSalon = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    const { platform } = req.body; // 'whatsapp', 'facebook', 'twitter', 'copy'

    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    const shareUrl = `${process.env.FRONTEND_URL}/salon/${salonId}`;
    const shareText = `Check out ${salon.name} - ${salon.description}`;

    let platformUrl = '';
    switch (platform) {
      case 'whatsapp':
        platformUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      case 'facebook':
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        platformUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        platformUrl = shareUrl;
        break;
      default:
        platformUrl = shareUrl;
    }

    res.json({
      success: true,
      data: {
        shareUrl,
        shareText,
        platformUrl,
        platform
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Check if salon is favorited
export const checkFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId } = req.params;
    const userId = req.user!._id;

    const favorite = await Favorite.findOne({
      user: userId,
      salon: salonId
    });

    res.json({
      success: true,
      data: {
        isFavorited: !!favorite
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};