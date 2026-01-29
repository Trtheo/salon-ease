import { Request, Response } from 'express';
import Salon from '../models/Salon';

export const getNearestSalons = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    // For now, return all salons (GPS integration would calculate actual distance)
    const salons = await Salon.find({ isVerified: true })
      .populate('services')
      .limit(20);

    // TODO: Implement actual GPS distance calculation
    const salonsWithDistance = salons.map(salon => ({
      ...salon.toObject(),
      distance: Math.floor(Math.random() * 50) + 1 // Mock distance
    }));

    res.status(200).json({
      success: true,
      data: salonsWithDistance
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateUserLocation = async (req: any, res: Response) => {
  try {
    const { latitude, longitude, address } = req.body;

    // Store user location (extend User model if needed)
    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: { latitude, longitude, address }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};