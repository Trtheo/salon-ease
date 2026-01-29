"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAppointmentReminder = exports.sendBookingConfirmation = exports.sendPushNotification = void 0;
// Initialize Firebase Admin (configure with your credentials)
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   }),
// });
const sendPushNotification = async (token, title, body, data) => {
    try {
        const message = {
            notification: { title, body },
            data: data || {},
            token
        };
        // const response = await admin.messaging().send(message);
        console.log('Push notification sent:', { title, body, token });
        return { success: true };
    }
    catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error };
    }
};
exports.sendPushNotification = sendPushNotification;
const sendBookingConfirmation = async (userToken, bookingDetails) => {
    return (0, exports.sendPushNotification)(userToken, 'Booking Confirmed', `Your appointment at ${bookingDetails.salonName} is confirmed for ${bookingDetails.date} at ${bookingDetails.time}`, { type: 'booking_confirmation', bookingId: bookingDetails.id });
};
exports.sendBookingConfirmation = sendBookingConfirmation;
const sendAppointmentReminder = async (userToken, bookingDetails) => {
    return (0, exports.sendPushNotification)(userToken, 'Appointment Reminder', `Don't forget your appointment at ${bookingDetails.salonName} tomorrow at ${bookingDetails.time}`, { type: 'appointment_reminder', bookingId: bookingDetails.id });
};
exports.sendAppointmentReminder = sendAppointmentReminder;
//# sourceMappingURL=notifications.js.map