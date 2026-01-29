"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.createPayment = void 0;
const Payment_1 = __importDefault(require("../models/Payment"));
const Booking_1 = __importDefault(require("../models/Booking"));
const createPayment = async (req, res) => {
    try {
        const { bookingId, paymentMethod, paymentGateway } = req.body;
        const booking = await Booking_1.default.findById(bookingId);
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
        const payment = await Payment_1.default.create({
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.createPayment = createPayment;
const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment_1.default.find({ customer: req.user.id })
            .populate('booking')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: payments
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getPaymentHistory = getPaymentHistory;
//# sourceMappingURL=payments.js.map