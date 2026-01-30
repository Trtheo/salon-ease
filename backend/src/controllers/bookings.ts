import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Salon from '../models/Salon';
import Service from '../models/Service';
import User from '../models/User';
import { isValidTimeSlot } from '../utils/helpers';
import { sendAppointmentConfirmationEmail, sendAppointmentNotificationEmail } from '../utils/email';

export const getBookings = async (req: any, res: Response) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('salon', 'name address')
      .populate('service', 'name price duration')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const createBooking = async (req: any, res: Response) => {
  try {
    const { salon, service, date, time } = req.body;
    
    // Check if time slot is valid
    if (!isValidTimeSlot(new Date(date), time)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot book appointments in the past'
      });
    }

    // Check for double booking
    const existingBooking = await Booking.findOne({
      salon,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'Time slot already booked'
      });
    }

    req.body.customer = req.user.id;
    const booking = await Booking.create(req.body);

    // Get booking details for email notifications
    const populatedBooking = await Booking.findById(booking._id)
      .populate('salon', 'name owner')
      .populate('service', 'name price')
      .populate('customer', 'name email');

    if (populatedBooking) {
      const customer = populatedBooking.customer as any;
      const salonData = populatedBooking.salon as any;
      const serviceData = populatedBooking.service as any;

      // Send confirmation email to customer
      await sendAppointmentConfirmationEmail(
        customer.email,
        customer.name,
        salonData.name,
        serviceData.name,
        date,
        time,
        serviceData.price
      );

      // Get salon owner details
      const salonOwner = await User.findById(salonData.owner);
      if (salonOwner) {
        // Send notification to salon owner
        await sendAppointmentNotificationEmail(
          salonOwner.email,
          salonOwner.name,
          customer.name,
          salonData.name,
          serviceData.name,
          date,
          time,
          true
        );
      }

      // Send notification to admin
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await sendAppointmentNotificationEmail(
          admin.email,
          admin.name,
          customer.name,
          salonData.name,
          serviceData.name,
          date,
          time,
          false
        );
      }
    }

    res.status(201).json({
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

export const cancelBooking = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

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

export const rescheduleBooking = async (req: any, res: Response) => {
  try {
    const { date, time } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to reschedule this booking'
      });
    }

    // Check if new time slot is valid
    if (!isValidTimeSlot(new Date(date), time)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot reschedule to past time'
      });
    }

    // Check for conflicts
    const existingBooking = await Booking.findOne({
      salon: booking.salon,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: booking._id }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: 'Time slot already booked'
      });
    }

    booking.date = new Date(date);
    booking.time = time;
    await booking.save();

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