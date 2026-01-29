"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalonStats = exports.updateBookingStatus = exports.getSalonBookings = exports.getMySalons = void 0;
const Salon_1 = __importDefault(require("../models/Salon"));
const Booking_1 = __importDefault(require("../models/Booking"));
// Get salon owner's salons
const getMySalons = async (req, res) => {
    try {
        const salons = await Salon_1.default.find({ owner: req.user.id }).populate('services');
        res.status(200).json({
            success: true,
            count: salons.length,
            data: salons
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getMySalons = getMySalons;
// Get salon bookings
const getSalonBookings = async (req, res) => {
    try {
        const { salonId } = req.params;
        // Verify salon ownership
        const salon = await Salon_1.default.findOne({ _id: salonId, owner: req.user.id });
        if (!salon) {
            return res.status(404).json({
                success: false,
                error: 'Salon not found or not authorized'
            });
        }
        const bookings = await Booking_1.default.find({ salon: salonId })
            .populate('user', 'name email phone')
            .populate('service', 'name price duration')
            .sort({ date: -1 });
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
exports.getSalonBookings = getSalonBookings;
// Update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const booking = await Booking_1.default.findById(bookingId).populate('salon');
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        // Verify salon ownership
        if (booking.salon.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this booking'
            });
        }
        booking.status = status;
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
exports.updateBookingStatus = updateBookingStatus;
// Get salon dashboard stats
const getSalonStats = async (req, res) => {
    try {
        const { salonId } = req.params;
        // Verify salon ownership
        const salon = await Salon_1.default.findOne({ _id: salonId, owner: req.user.id });
        if (!salon) {
            return res.status(404).json({
                success: false,
                error: 'Salon not found or not authorized'
            });
        }
        const totalBookings = await Booking_1.default.countDocuments({ salon: salonId });
        const pendingBookings = await Booking_1.default.countDocuments({ salon: salonId, status: 'pending' });
        const completedBookings = await Booking_1.default.countDocuments({ salon: salonId, status: 'completed' });
        // Calculate total revenue from completed bookings
        const revenueData = await Booking_1.default.aggregate([
            { $match: { salon: salon._id, status: 'completed' } },
            { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceData' } },
            { $unwind: '$serviceData' },
            { $group: { _id: null, totalRevenue: { $sum: '$serviceData.price' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        res.status(200).json({
            success: true,
            data: {
                totalBookings,
                pendingBookings,
                completedBookings,
                totalRevenue,
                salonStatus: salon.status
            }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getSalonStats = getSalonStats;
//# sourceMappingURL=salonOwner.js.map