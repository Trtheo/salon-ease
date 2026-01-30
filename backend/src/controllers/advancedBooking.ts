import { Response } from 'express';
import RecurringBooking from '../models/RecurringBooking';
import GroupBooking from '../models/GroupBooking';
import Waitlist from '../models/Waitlist';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notificationService';

// Create recurring booking
export const createRecurringBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId, serviceId, pattern, startDate, endDate, totalAmount } = req.body;
    const customerId = req.user!._id;

    const recurringBooking = await RecurringBooking.create({
      customer: customerId,
      salon: salonId,
      service: serviceId,
      pattern,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      totalAmount
    });

    const populated = await RecurringBooking.findById(recurringBooking._id)
      .populate('salon', 'name')
      .populate('service', 'name duration');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user recurring bookings
export const getRecurringBookings = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user!._id;

    const bookings = await RecurringBooking.find({ customer: customerId })
      .populate('salon', 'name')
      .populate('service', 'name duration')
      .populate('bookings')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Cancel recurring booking
export const cancelRecurringBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { recurringId } = req.params;
    const customerId = req.user!._id;

    const booking = await RecurringBooking.findOneAndUpdate(
      { _id: recurringId, customer: customerId },
      { isActive: false },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Recurring booking not found'
      });
    }

    res.json({
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

// Create group booking
export const createGroupBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId, serviceId, date, time, maxParticipants, totalAmount, participants } = req.body;
    const organizerId = req.user!._id;

    const groupBooking = await GroupBooking.create({
      organizer: organizerId,
      salon: salonId,
      service: serviceId,
      date: new Date(date),
      time,
      maxParticipants,
      totalAmount,
      participants: participants.map((p: any) => ({
        user: p.userId,
        amount: p.amount
      }))
    });

    // Send invitations to participants
    for (const participant of participants) {
      await createNotification({
        recipient: participant.userId,
        title: 'Group Booking Invitation',
        message: `You've been invited to a group booking`,
        type: 'booking',
        data: { groupBookingId: groupBooking._id }
      });
    }

    const populated = await GroupBooking.findById(groupBooking._id)
      .populate('salon', 'name')
      .populate('service', 'name')
      .populate('participants.user', 'name');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Respond to group booking invitation
export const respondToGroupBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { groupBookingId } = req.params;
    const { response } = req.body; // 'confirmed' or 'declined'
    const userId = req.user!._id;

    const groupBooking = await GroupBooking.findById(groupBookingId);
    
    if (!groupBooking) {
      return res.status(404).json({
        success: false,
        error: 'Group booking not found'
      });
    }

    const participant = groupBooking.participants.find(p => p.user.equals(userId));
    
    if (!participant) {
      return res.status(403).json({
        success: false,
        error: 'Not invited to this group booking'
      });
    }

    participant.status = response;
    await groupBooking.save();

    res.json({
      success: true,
      data: groupBooking
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Join waitlist
export const joinWaitlist = async (req: AuthRequest, res: Response) => {
  try {
    const { salonId, serviceId, preferredDate, preferredTime, flexibleTiming } = req.body;
    const customerId = req.user!._id;

    // Check if already on waitlist
    const existing = await Waitlist.findOne({
      customer: customerId,
      salon: salonId,
      service: serviceId,
      preferredDate: new Date(preferredDate),
      status: 'active'
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Already on waitlist for this slot'
      });
    }

    // Get next position
    const position = await Waitlist.countDocuments({
      salon: salonId,
      service: serviceId,
      preferredDate: new Date(preferredDate),
      status: 'active'
    }) + 1;

    const waitlistEntry = await Waitlist.create({
      customer: customerId,
      salon: salonId,
      service: serviceId,
      preferredDate: new Date(preferredDate),
      preferredTime,
      flexibleTiming,
      position
    });

    const populated = await Waitlist.findById(waitlistEntry._id)
      .populate('salon', 'name')
      .populate('service', 'name');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user waitlist
export const getUserWaitlist = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user!._id;

    const waitlist = await Waitlist.find({ 
      customer: customerId,
      status: { $in: ['active', 'notified'] }
    })
    .populate('salon', 'name')
    .populate('service', 'name')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: waitlist
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};