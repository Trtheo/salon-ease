import Notification from '../models/Notification';
import NotificationPreference from '../models/NotificationPreference';
import { sendEmail } from './email';
import { sendSMS } from './sms';

interface NotificationData {
  recipient: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'review' | 'payment' | 'general';
  data?: any;
}

export const createNotification = async (notificationData: NotificationData) => {
  try {
    // Create in-app notification
    const notification = await Notification.create(notificationData);

    // Get user preferences
    const preferences = await NotificationPreference.findOne({
      user: notificationData.recipient
    });

    if (!preferences) {
      // Create default preferences if not exists
      await NotificationPreference.create({
        user: notificationData.recipient
      });
      return notification;
    }

    // Check if user wants this type of notification
    const typeKey = notificationData.type as keyof typeof preferences.preferences;
    if (!preferences.preferences[typeKey]) {
      return notification;
    }

    // Send push notification (placeholder - implement with FCM/APNS)
    if (preferences.pushNotifications) {
      await sendPushNotification(notificationData);
    }

    // Send email notification
    if (preferences.emailNotifications) {
      await sendEmailNotification(notificationData);
    }

    // Send SMS notification
    if (preferences.smsNotifications) {
      await sendSMSNotification(notificationData);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const sendPushNotification = async (data: NotificationData) => {
  // Placeholder for push notification implementation
  // Implement with Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNS)
  console.log('Push notification sent:', data.title);
};

const sendEmailNotification = async (data: NotificationData) => {
  try {
    // Get user email from User model
    const User = require('../models/User').default;
    const user = await User.findById(data.recipient);
    
    if (user?.email) {
      await sendEmail(user.email, data.title, data.message);
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

const sendSMSNotification = async (data: NotificationData) => {
  try {
    // Get user phone from User model
    const User = require('../models/User').default;
    const user = await User.findById(data.recipient);
    
    if (user?.phone) {
      await sendSMS(user.phone, `${data.title}: ${data.message}`);
    }
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
};

// Notification templates
export const NotificationTemplates = {
  newBooking: (salonName: string) => ({
    title: 'New Booking',
    message: `You have a new booking at ${salonName}`
  }),
  
  bookingConfirmed: (salonName: string, date: string) => ({
    title: 'Booking Confirmed',
    message: `Your booking at ${salonName} on ${date} has been confirmed`
  }),
  
  newMessage: (senderName: string) => ({
    title: 'New Message',
    message: `You have a new message from ${senderName}`
  }),
  
  newReview: (customerName: string, rating: number) => ({
    title: 'New Review',
    message: `${customerName} left a ${rating}-star review for your salon`
  }),
  
  paymentReceived: (amount: number) => ({
    title: 'Payment Received',
    message: `Payment of $${amount} has been received`
  })
};