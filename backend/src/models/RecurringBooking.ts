import mongoose, { Document, Schema } from 'mongoose';

export interface IRecurringBooking extends Document {
  customer: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  pattern: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    time: string;
  };
  startDate: Date;
  endDate?: Date;
  totalAmount: number;
  isActive: boolean;
  bookings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const recurringBookingSchema = new Schema<IRecurringBooking>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salon: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  pattern: {
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      required: true
    },
    dayOfWeek: Number,
    dayOfMonth: Number,
    time: { type: String, required: true }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  totalAmount: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IRecurringBooking>('RecurringBooking', recurringBookingSchema);