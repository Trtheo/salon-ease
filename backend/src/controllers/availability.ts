import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Salon from '../models/Salon';
import { generateTimeSlots } from '../utils/helpers';

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { salonId, date, serviceId } = req.query;

    if (!salonId || !date) {
      return res.status(400).json({
        success: false,
        error: 'Salon ID and date are required'
      });
    }

    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({
        success: false,
        error: 'Salon not found'
      });
    }

    const dayOfWeek = new Date(date as string).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHours = salon.workingHours[dayOfWeek];

    if (!workingHours || !workingHours.isOpen) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Generate all possible time slots
    const allSlots = generateTimeSlots(workingHours.open, workingHours.close, 60);

    // Get booked slots for the date
    const bookedSlots = await Booking.find({
      salon: salonId,
      date: new Date(date as string),
      status: { $in: ['pending', 'confirmed'] }
    }).select('time');

    const bookedTimes = bookedSlots.map(booking => booking.time);
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.status(200).json({
      success: true,
      data: availableSlots
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};