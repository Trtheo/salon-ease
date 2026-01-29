import admin from 'firebase-admin';

// Initialize Firebase Admin (configure with your credentials)
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   }),
// });

export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: any
) => {
  try {
    const message = {
      notification: { title, body },
      data: data || {},
      token
    };

    // const response = await admin.messaging().send(message);
    console.log('Push notification sent:', { title, body, token });
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};

export const sendBookingConfirmation = async (userToken: string, bookingDetails: any) => {
  return sendPushNotification(
    userToken,
    'Booking Confirmed',
    `Your appointment at ${bookingDetails.salonName} is confirmed for ${bookingDetails.date} at ${bookingDetails.time}`,
    { type: 'booking_confirmation', bookingId: bookingDetails.id }
  );
};

export const sendAppointmentReminder = async (userToken: string, bookingDetails: any) => {
  return sendPushNotification(
    userToken,
    'Appointment Reminder',
    `Don't forget your appointment at ${bookingDetails.salonName} tomorrow at ${bookingDetails.time}`,
    { type: 'appointment_reminder', bookingId: bookingDetails.id }
  );
};