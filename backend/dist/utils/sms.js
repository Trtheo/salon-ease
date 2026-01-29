"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPSMS = exports.sendSMS = void 0;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendSMS = async (phone, message) => {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        return true;
    }
    catch (error) {
        console.error('SMS Error:', error);
        return false;
    }
};
exports.sendSMS = sendSMS;
const sendOTPSMS = async (phone, code) => {
    const message = `Your SalonEase verification code is: ${code}. Valid for 10 minutes.`;
    return (0, exports.sendSMS)(phone, message);
};
exports.sendOTPSMS = sendOTPSMS;
//# sourceMappingURL=sms.js.map