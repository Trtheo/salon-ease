import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Booking from '../models/Booking';

export const createPayment = async (req: any, res: Response) => {
  try {
    const { bookingId, paymentMethod, paymentGateway } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.customer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const payment = await Payment.create({
      booking: bookingId,
      customer: req.user.id,
      amount: booking.totalAmount,
      paymentMethod,
      paymentGateway,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Update booking status
    booking.status = 'confirmed';
    await booking.save();

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getPaymentHistory = async (req: any, res: Response) => {
  try {
    const payments = await Payment.find({ customer: req.user.id })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};