"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDevOTP = exports.sendEmailToSMS = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Free SMS via Email-to-SMS gateways
const carrierGateways = {
    'verizon': 'vtext.com',
    'att': 'txt.att.net',
    'tmobile': 'tmomail.net',
    'sprint': 'messaging.sprintpcs.com'
};
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendEmailToSMS = async (phone, carrier, message) => {
    try {
        const gateway = carrierGateways[carrier.toLowerCase()];
        if (!gateway)
            return false;
        const phoneNumber = phone.replace(/\D/g, ''); // Remove non-digits
        const smsEmail = `${phoneNumber}@${gateway}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: smsEmail,
            subject: '',
            text: message
        });
        return true;
    }
    catch (error) {
        console.error('Email-to-SMS Error:', error);
        return false;
    }
};
exports.sendEmailToSMS = sendEmailToSMS;
// Fallback: Console log for development
const sendDevOTP = (phone, code) => {
    console.log(`📱 OTP for ${phone}: ${code}`);
    return true;
};
exports.sendDevOTP = sendDevOTP;
//# sourceMappingURL=freeSMS.js.map