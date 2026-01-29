import { Request, Response } from 'express';
import Salon from '../models/Salon';

export const searchSalons = async (req: Request, res: Response) => {
  try {
    const { name, location, service } = req.query;
    let query: any = { isVerified: true };

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (location) {
      query.address = { $regex: location, $options: 'i' };
    }

    const salons = await Salon.find(query)
      .populate('owner', 'name email')
      .populate('services');

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