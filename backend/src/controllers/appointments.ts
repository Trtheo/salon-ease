import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { sendBookingConfirmation } from '../utils/notifications';

export const requestAppointment = async (req: any, res: Response) => {
  try {
    const { salon, service, date, time, notes } = req.body;

    const booking = await Booking.create({
      customer: req.user.id,
      salon,
      service,
      date: new Date(date),
      time,
      status: 'pending',
      totalAmount: req.body.totalAmount,
      notes
    });

    // TODO: Send notification to salon owner
    console.log('Appointment request sent to salon');

    res.status(201).json({
      success: true,
      message: 'Appointment request sent successfully',
      data: booking
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getAppointmentStatus = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('salon', 'name address phone')
      .populate('service', 'name duration');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getUpcomingAppointments = async (req: any, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Booking.find({
      customer: req.user.id,
      date: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('salon', 'name address')
    .populate('service', 'name duration')
    .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};