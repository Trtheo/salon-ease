"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendOTPEmail = async (email, code) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'SalonEase - Verification Code',
            html: `
        <h2>Your Verification Code</h2>
        <p>Your SalonEase verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
        });
        return true;
    }
    catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};
exports.sendOTPEmail = sendOTPEmail;
//# sourceMappingURL=email.js.map