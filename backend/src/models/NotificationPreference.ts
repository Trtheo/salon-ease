import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationPreference extends Document {
  user: mongoose.Types.ObjectId;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  preferences: {
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    payments: boolean;
    promotions: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationPreferenceSchema = new Schema<INotificationPreference>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  preferences: {
    bookings: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

export default mongoose.model<INotificationPreference>('NotificationPreference', notificationPreferenceSchema);