"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = exports.formatResponse = exports.isValidTimeSlot = exports.generateTimeSlots = void 0;
const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    while (start < end) {
        slots.push(start.toTimeString().slice(0, 5));
        start.setMinutes(start.getMinutes() + duration);
    }
    return slots;
};
exports.generateTimeSlots = generateTimeSlots;
const isValidTimeSlot = (date, time) => {
    const now = new Date();
    const bookingDateTime = new Date(`${date.toDateString()} ${time}`);
    return bookingDateTime > now;
};
exports.isValidTimeSlot = isValidTimeSlot;
const formatResponse = (success, data, error) => {
    return {
        success,
        ...(data && { data }),
        ...(error && { error })
    };
};
exports.formatResponse = formatResponse;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
exports.calculateDistance = calculateDistance;
//# sourceMappingURL=helpers.js.map