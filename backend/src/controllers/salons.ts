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
    req.body.owner = req.user.id;
    const salon = await Salon.create(req.body);

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

    salon = await Salon.findByIdAndUpdate(req.params.id, req.body, {
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