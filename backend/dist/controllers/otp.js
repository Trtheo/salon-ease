"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = void 0;
const OTP_1 = __importDefault(require("../models/OTP"));
const sms_1 = require("../utils/sms");
const email_1 = require("../utils/email");
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
const sendOTP = async (req, res) => {
    try {
        const { phone, email, method } = req.body;
        if (!method) {
            return res.status(400).json({
                success: false,
                error: 'Method is required (phone or email)'
            });
        }
        if (method === 'phone' && !phone) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required for SMS OTP'
            });
        }
        if (method === 'email' && !email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required for email OTP'
            });
        }
        const code = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        if (method === 'phone') {
            await OTP_1.default.create({ phone, code, expiresAt });
            const sent = await (0, sms_1.sendOTPSMS)(phone, code);
            if (!sent) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send OTP SMS'
                });
            }
        }
        if (method === 'email') {
            await OTP_1.default.create({ email, code, expiresAt });
            const sent = await (0, email_1.sendOTPEmail)(email, code);
            if (!sent) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send OTP email'
                });
            }
        }
        res.status(200).json({
            success: true,
            message: `OTP sent successfully via ${method}`
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (req, res) => {
    try {
        const { phone, email, code } = req.body;
        const identifier = phone || email;
        const otp = await OTP_1.default.findOne({
            $or: [{ phone: identifier }, { email: identifier }],
            code,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });
        if (!otp) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired OTP'
            });
        }
        otp.isUsed = true;
        await otp.save();
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=otp.js.map