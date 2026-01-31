import { Request, Response } from 'express';
import Salon from '../models/Salon';
import Service from '../models/Service';

export const searchSalons = async (req: Request, res: Response) => {
  try {
    const { q, name, location, service } = req.query;
    let query: any = { isVerified: true };

    // Enhanced search with 'q' parameter - searches across multiple fields
    if (q) {
      const searchRegex = { $regex: q, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    // Individual field searches (for backward compatibility)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (location) {
      query.address = { $regex: location, $options: 'i' };
    }

    const salons = await Salon.find(query)
      .populate('owner', 'name email')
      .populate('services')
      .sort({ rating: -1, reviewCount: -1 });

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

export const getSalonServices = async (req: Request, res: Response) => {
  try {
    const salon = await Salon.findById(req.params.id).populate('services');
    
    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: salon.services
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};