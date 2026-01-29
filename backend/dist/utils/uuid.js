"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentId = exports.generateBookingId = exports.generateUserId = exports.generateUUID = void 0;
const uuid_1 = require("uuid");
const generateUUID = () => {
    return (0, uuid_1.v4)();
};
exports.generateUUID = generateUUID;
const generateUserId = () => {
    return `USER-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`;
};
exports.generateUserId = generateUserId;
const generateBookingId = () => {
    return `BK-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`;
};
exports.generateBookingId = generateBookingId;
const generatePaymentId = () => {
    return `PAY-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}`;
};
exports.generatePaymentId = generatePaymentId;
//# sourceMappingURL=uuid.js.map