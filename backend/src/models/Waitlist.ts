import mongoose, { Document, Schema } from 'mongoose';

export interface IWaitlist extends Document {
  customer: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  preferredDate: Date;
  preferredTime: string;
  flexibleTiming: boolean;
  position: number;
  status: 'active' | 'notified' | 'booked' | 'expired';
  notifiedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const waitlistSchema = new Schema<IWaitlist>({
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
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  flexibleTiming: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'notified', 'booked', 'expired'],
    default: 'active'
  },
  notifiedAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

waitlistSchema.index({ salon: 1, service: 1, preferredDate: 1, position: 1 });

export default mongoose.model<IWaitlist>('Waitlist', waitlistSchema);