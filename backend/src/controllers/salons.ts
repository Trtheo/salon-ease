import { Request, Response } from 'express';
import Salon from '../models/Salon';

export const getSalons = async (req: Request, res: Response) => {
  try {
    const salons = await Salon.find().populate('owner', 'name email').populate('services');

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

export const getSalon = async (req: Request, res: Response) => {
  try {
    const salon = await Salon.findById(req.params.id).populate('owner', 'name email').populate('services');

    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: salon
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const createSalon = async (req: any, res: Response) => {
  try {
    const salonData = { ...req.body };
    salonData.owner = req.user.id;
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      salonData.images = req.files.map((file: any) => `/uploads/salons/${file.filename}`);
    }
    
    // Parse JSON fields if they're strings
    if (typeof salonData.workingHours === 'string') {
      // Decode HTML entities first
      const decodedHours = salonData.workingHours
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
      salonData.workingHours = JSON.parse(decodedHours);
    }
    if (typeof salonData.services === 'string') {
      // Decode HTML entities first
      const decodedServices = salonData.services
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
      salonData.services = JSON.parse(decodedServices);
    }
    
    const salon = await Salon.create(salonData);

    res.status(201).json({
      success: true,
      data: salon
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateSalon = async (req: any, res: Response) => {
  try {
    let salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this salon'
      });
    }

    const updateData = { ...req.body };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file: any) => `/uploads/salons/${file.filename}`);
    }
    
    // Parse JSON fields if they're strings
    if (typeof updateData.workingHours === 'string') {
      // Decode HTML entities first
      const decodedHours = updateData.workingHours.replace(/&quot;/g, '"');
      updateData.workingHours = JSON.parse(decodedHours);
    }
    if (typeof updateData.services === 'string') {
      // Decode HTML entities first
      const decodedServices = updateData.services.replace(/&quot;/g, '"');
      updateData.services = JSON.parse(decodedServices);
    }

    salon = await Salon.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: salon
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteSalon = async (req: any, res: Response) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this salon'
      });
    }

    await salon.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};