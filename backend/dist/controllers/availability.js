"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlots = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Salon_1 = __importDefault(require("../models/Salon"));
const helpers_1 = require("../utils/helpers");
const getAvailableSlots = async (req, res) => {
    try {
        const { salonId, date, serviceId } = req.query;
        if (!salonId || !date) {
            return res.status(400).json({
                success: false,
                error: 'Salon ID and date are required'
            });
        }
        const salon = await Salon_1.default.findById(salonId);
        if (!salon) {
            return res.status(404).json({
                success: false,
                error: 'Salon not found'
            });
        }
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const workingHours = salon.workingHours[dayOfWeek];
        if (!workingHours || !workingHours.isOpen) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }
        // Generate all possible time slots
        const allSlots = (0, helpers_1.generateTimeSlots)(workingHours.open, workingHours.close, 60);
        // Get booked slots for the date
        const bookedSlots = await Booking_1.default.find({
            salon: salonId,
            date: new Date(date),
            status: { $in: ['pending', 'confirmed'] }
        }).select('time');
        const bookedTimes = bookedSlots.map(booking => booking.time);
        const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
        res.status(200).json({
            success: true,
            data: availableSlots
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getAvailableSlots = getAvailableSlots;
//# sourceMappingURL=availability.js.map