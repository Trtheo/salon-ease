"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleBooking = exports.cancelBooking = exports.createBooking = exports.getBookings = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const helpers_1 = require("../utils/helpers");
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.default.find({ customer: req.user.id })
            .populate('salon', 'name address')
            .populate('service', 'name price duration')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getBookings = getBookings;
const createBooking = async (req, res) => {
    try {
        const { salon, service, date, time } = req.body;
        // Check if time slot is valid
        if (!(0, helpers_1.isValidTimeSlot)(new Date(date), time)) {
            return res.status(400).json({
                success: false,
                error: 'Cannot book appointments in the past'
            });
        }
        // Check for double booking
        const existingBooking = await Booking_1.default.findOne({
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
        const booking = await Booking_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: booking
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.createBooking = createBooking;
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.cancelBooking = cancelBooking;
const rescheduleBooking = async (req, res) => {
    try {
        const { date, time } = req.body;
        const booking = await Booking_1.default.findById(req.params.id);
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
        if (!(0, helpers_1.isValidTimeSlot)(new Date(date), time)) {
            return res.status(400).json({
                success: false,
                error: 'Cannot reschedule to past time'
            });
        }
        // Check for conflicts
        const existingBooking = await Booking_1.default.findOne({
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.rescheduleBooking = rescheduleBooking;
//# sourceMappingURL=bookings.js.map