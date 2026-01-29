import { Request, Response } from 'express';
import Service from '../models/Service';

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().populate('salon', 'name address');

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const createService = async (req: any, res: Response) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};