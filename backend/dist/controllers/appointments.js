"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingAppointments = exports.getAppointmentStatus = exports.requestAppointment = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const requestAppointment = async (req, res) => {
    try {
        const { salon, service, date, time, notes } = req.body;
        const booking = await Booking_1.default.create({
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.requestAppointment = requestAppointment;
const getAppointmentStatus = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id)
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getAppointmentStatus = getAppointmentStatus;
const getUpcomingAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await Booking_1.default.find({
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getUpcomingAppointments = getUpcomingAppointments;
//# sourceMappingURL=appointments.js.map